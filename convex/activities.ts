import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const categoryValidator = v.union(
  v.literal("EXERCISE"),
  v.literal("MEDITATION"),
  v.literal("SOCIAL"),
  v.literal("OUTDOOR"),
  v.literal("CREATIVE"),
  v.literal("RELAXATION"),
  v.literal("LEARNING")
);

// Helper to get current user
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// List all predefined activities
export const listAll = query({
  args: {
    category: v.optional(categoryValidator),
    maxDuration: v.optional(v.number()),
  },
  handler: async (ctx, { category, maxDuration }) => {
    let activities = await ctx.db.query("activities").collect();

    // Filter by category if provided
    if (category) {
      activities = activities.filter((a: any) => a.category === category);
    }

    // Filter by max duration if provided
    if (maxDuration) {
      activities = activities.filter((a: any) => a.duration <= maxDuration);
    }

    // Sort by stress relief score (highest first)
    return activities.sort((a: any, b: any) => b.stressReliefScore - a.stressReliefScore);
  },
});

// Get activity by ID
export const getById = query({
  args: { id: v.id("activities") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Get recommended activities based on stress level
export const getRecommended = query({
  args: {
    stressLevel: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { stressLevel, limit = 5 }) => {
    const activities = await ctx.db.query("activities").collect();

    // Sort activities based on stress relief score
    let recommended = [...activities];

    // If stress level is high (7+), prioritize high stress relief activities
    if (stressLevel && stressLevel >= 7) {
      recommended = recommended.filter((a: any) => a.stressReliefScore >= 7);
    } else if (stressLevel && stressLevel >= 4) {
      // Medium stress - balance activities
      recommended = recommended.filter((a: any) => a.stressReliefScore >= 5);
    }

    // Sort by stress relief score (highest first)
    recommended.sort((a: any, b: any) => b.stressReliefScore - a.stressReliefScore);

    return recommended.slice(0, limit);
  },
});

// Get user's completed activities
export const getUserActivities = query({
  args: {
    limit: v.optional(v.number()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, { limit, startDate, endDate }) => {
    const user = await getCurrentUser(ctx);

    let userActivities = await ctx.db
      .query("userActivities")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    // Filter by date range if provided
    if (startDate) {
      userActivities = userActivities.filter((a: any) => a.completedAt >= startDate);
    }
    if (endDate) {
      userActivities = userActivities.filter((a: any) => a.completedAt <= endDate);
    }

    // Sort by completion date (newest first)
    userActivities.sort((a: any, b: any) => b.completedAt - a.completedAt);

    // Apply limit if provided
    if (limit) {
      userActivities = userActivities.slice(0, limit);
    }

    // Fetch activity details for each user activity
    const result = await Promise.all(
      userActivities.map(async (ua: any) => {
        const activity = await ctx.db.get(ua.activityId);
        return {
          ...ua,
          activity,
        };
      })
    );

    return result;
  },
});

// Get activity statistics
export const getStats = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, { days = 30 }) => {
    const user = await getCurrentUser(ctx);

    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const userActivities = await ctx.db
      .query("userActivities")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    const filteredActivities = userActivities.filter(
      (a: any) => a.completedAt >= startDate
    );

    // Fetch activity details and calculate stats
    const activitiesWithDetails = await Promise.all(
      filteredActivities.map(async (ua: any) => {
        const activity = await ctx.db.get(ua.activityId);
        return { ...ua, activity };
      })
    );

    // Calculate category distribution
    const categoryCount: Record<string, number> = {};
    let totalDuration = 0;
    let totalRating = 0;
    let ratingCount = 0;

    for (const ua of activitiesWithDetails) {
      if (ua.activity) {
        categoryCount[ua.activity.category] =
          (categoryCount[ua.activity.category] || 0) + 1;
        totalDuration += ua.activity.duration;
      }
      if (ua.rating) {
        totalRating += ua.rating;
        ratingCount++;
      }
    }

    return {
      totalActivities: filteredActivities.length,
      totalDuration,
      averageRating: ratingCount > 0 ? Math.round((totalRating / ratingCount) * 10) / 10 : 0,
      categoryDistribution: categoryCount,
    };
  },
});

// Log a completed activity
export const logActivity = mutation({
  args: {
    activityId: v.id("activities"),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { activityId, rating, notes }) => {
    const user = await getCurrentUser(ctx);

    // Verify the activity exists
    const activity = await ctx.db.get(activityId);
    if (!activity) {
      throw new Error("Activity not found");
    }

    // Validate rating if provided (1-5)
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    const userActivityId = await ctx.db.insert("userActivities", {
      userId: user._id,
      activityId,
      completedAt: Date.now(),
      rating,
      notes,
    });

    return userActivityId;
  },
});
