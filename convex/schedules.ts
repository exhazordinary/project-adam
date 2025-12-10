import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const scheduleTypeValidator = v.union(
  v.literal("CLASS"),
  v.literal("STUDY"),
  v.literal("BREAK"),
  v.literal("SOCIAL"),
  v.literal("EXERCISE"),
  v.literal("OTHER")
);

const recurrenceValidator = v.union(
  v.literal("NONE"),
  v.literal("DAILY"),
  v.literal("WEEKLY"),
  v.literal("MONTHLY")
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

// List all schedules for the user
export const list = query({
  args: {
    type: v.optional(scheduleTypeValidator),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, { type, startDate, endDate }) => {
    const user = await getCurrentUser(ctx);

    let schedules = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    // Filter by type if provided
    if (type) {
      schedules = schedules.filter((s: any) => s.type === type);
    }

    // Filter by date range if provided
    if (startDate) {
      schedules = schedules.filter((s: any) => s.startTime >= startDate);
    }
    if (endDate) {
      schedules = schedules.filter((s: any) => s.endTime <= endDate);
    }

    // Sort by start time
    return schedules.sort((a: any, b: any) => a.startTime - b.startTime);
  },
});

// Get today's schedules
export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    // Filter for today's schedules
    const todaySchedules = schedules.filter(
      (s: any) => s.startTime >= startOfDay && s.startTime <= endOfDay
    );

    return todaySchedules.sort((a: any, b: any) => a.startTime - b.startTime);
  },
});

// Get schedule by ID
export const getById = query({
  args: { id: v.id("schedules") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUser(ctx);
    const schedule = await ctx.db.get(id);

    if (!schedule || schedule.userId !== user._id) {
      return null;
    }

    return schedule;
  },
});

// Create a new schedule
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    type: scheduleTypeValidator,
    recurrence: v.optional(recurrenceValidator),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const scheduleId = await ctx.db.insert("schedules", {
      userId: user._id,
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      endTime: args.endTime,
      type: args.type,
      recurrence: args.recurrence ?? "NONE",
      location: args.location,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return scheduleId;
  },
});

// Update a schedule
export const update = mutation({
  args: {
    id: v.id("schedules"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    type: v.optional(scheduleTypeValidator),
    recurrence: v.optional(recurrenceValidator),
    location: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const user = await getCurrentUser(ctx);
    const schedule = await ctx.db.get(id);

    if (!schedule || schedule.userId !== user._id) {
      throw new Error("Schedule not found");
    }

    const updateData: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.startTime !== undefined) updateData.startTime = updates.startTime;
    if (updates.endTime !== undefined) updateData.endTime = updates.endTime;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.recurrence !== undefined) updateData.recurrence = updates.recurrence;
    if (updates.location !== undefined) updateData.location = updates.location;

    await ctx.db.patch(id, updateData);

    return await ctx.db.get(id);
  },
});

// Delete a schedule
export const remove = mutation({
  args: { id: v.id("schedules") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUser(ctx);
    const schedule = await ctx.db.get(id);

    if (!schedule || schedule.userId !== user._id) {
      throw new Error("Schedule not found");
    }

    await ctx.db.delete(id);

    return { success: true };
  },
});
