import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

// List mood entries
export const list = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { startDate, endDate, limit }) => {
    const user = await getCurrentUser(ctx);

    let entries = await ctx.db
      .query("moodEntries")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    // Filter by date range if provided
    if (startDate) {
      entries = entries.filter((e: any) => e.timestamp >= startDate);
    }
    if (endDate) {
      entries = entries.filter((e: any) => e.timestamp <= endDate);
    }

    // Sort by timestamp descending (newest first)
    entries = entries.sort((a: any, b: any) => b.timestamp - a.timestamp);

    // Apply limit if provided
    if (limit) {
      entries = entries.slice(0, limit);
    }

    return entries;
  },
});

// Get latest mood entry
export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    const entries = await ctx.db
      .query("moodEntries")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    if (entries.length === 0) {
      return null;
    }

    // Sort by timestamp descending and get the first one
    entries.sort((a: any, b: any) => b.timestamp - a.timestamp);
    return entries[0];
  },
});

// Get mood statistics
export const getStats = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, { days = 7 }) => {
    const user = await getCurrentUser(ctx);

    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const entries = await ctx.db
      .query("moodEntries")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    const filteredEntries = entries.filter((e: any) => e.timestamp >= startDate);

    if (filteredEntries.length === 0) {
      return {
        averageMood: 0,
        averageStress: 0,
        averageSleep: 0,
        totalEntries: 0,
        trend: "stable" as const,
      };
    }

    // Calculate averages
    const totalMood = filteredEntries.reduce((sum: number, e: any) => sum + e.moodLevel, 0);
    const stressEntries = filteredEntries.filter((e: any) => e.stressLevel !== undefined);
    const totalStress = stressEntries.reduce((sum: number, e: any) => sum + e.stressLevel, 0);
    const sleepEntries = filteredEntries.filter((e: any) => e.sleepHours !== undefined);
    const totalSleep = sleepEntries.reduce((sum: number, e: any) => sum + e.sleepHours, 0);

    // Calculate trend (compare first half vs second half)
    const sortedEntries = [...filteredEntries].sort((a: any, b: any) => a.timestamp - b.timestamp);
    const midpoint = Math.floor(sortedEntries.length / 2);

    let trend: "improving" | "stable" | "declining" = "stable";

    if (sortedEntries.length >= 2) {
      const firstHalf = sortedEntries.slice(0, midpoint);
      const secondHalf = sortedEntries.slice(midpoint);

      const firstHalfAvg = firstHalf.reduce((sum: number, e: any) => sum + e.moodLevel, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum: number, e: any) => sum + e.moodLevel, 0) / secondHalf.length;

      const difference = secondHalfAvg - firstHalfAvg;
      if (difference > 0.5) {
        trend = "improving";
      } else if (difference < -0.5) {
        trend = "declining";
      }
    }

    return {
      averageMood: Math.round((totalMood / filteredEntries.length) * 10) / 10,
      averageStress: stressEntries.length > 0
        ? Math.round((totalStress / stressEntries.length) * 10) / 10
        : 0,
      averageSleep: sleepEntries.length > 0
        ? Math.round((totalSleep / sleepEntries.length) * 10) / 10
        : 0,
      totalEntries: filteredEntries.length,
      trend,
    };
  },
});

// Create a mood entry
export const create = mutation({
  args: {
    moodLevel: v.number(),
    stressLevel: v.optional(v.number()),
    notes: v.optional(v.string()),
    activities: v.optional(v.array(v.string())),
    sleepHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Validate mood level (1-10)
    if (args.moodLevel < 1 || args.moodLevel > 10) {
      throw new Error("Mood level must be between 1 and 10");
    }

    // Validate stress level if provided (1-10)
    if (args.stressLevel !== undefined && (args.stressLevel < 1 || args.stressLevel > 10)) {
      throw new Error("Stress level must be between 1 and 10");
    }

    const entryId = await ctx.db.insert("moodEntries", {
      userId: user._id,
      moodLevel: args.moodLevel,
      stressLevel: args.stressLevel,
      notes: args.notes,
      activities: args.activities,
      sleepHours: args.sleepHours,
      timestamp: Date.now(),
    });

    return entryId;
  },
});
