import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const priorityValidator = v.union(
  v.literal("LOW"),
  v.literal("MEDIUM"),
  v.literal("HIGH"),
  v.literal("URGENT")
);

const statusValidator = v.union(
  v.literal("TODO"),
  v.literal("IN_PROGRESS"),
  v.literal("COMPLETED"),
  v.literal("CANCELLED")
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

// List all tasks for the user
export const list = query({
  args: {
    status: v.optional(statusValidator),
    priority: v.optional(priorityValidator),
  },
  handler: async (ctx, { status, priority }) => {
    const user = await getCurrentUser(ctx);

    let tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    // Filter by status if provided
    if (status) {
      tasks = tasks.filter((t: any) => t.status === status);
    }

    // Filter by priority if provided
    if (priority) {
      tasks = tasks.filter((t: any) => t.priority === priority);
    }

    // Sort by deadline (nulls last), then by priority
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return tasks.sort((a: any, b: any) => {
      // First sort by deadline
      if (a.deadline && b.deadline) {
        return a.deadline - b.deadline;
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      // Then by priority
      return priorityOrder[a.priority as keyof typeof priorityOrder] -
             priorityOrder[b.priority as keyof typeof priorityOrder];
    });
  },
});

// Get upcoming tasks (next 7 days)
export const getUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    const now = Date.now();
    const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    // Filter for upcoming tasks with deadlines
    const upcomingTasks = tasks.filter((t: any) =>
      t.deadline &&
      t.deadline <= sevenDaysFromNow &&
      t.status !== "COMPLETED" &&
      t.status !== "CANCELLED"
    );

    // Sort by deadline
    return upcomingTasks.sort((a: any, b: any) => a.deadline - b.deadline);
  },
});

// Get task by ID
export const getById = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUser(ctx);
    const task = await ctx.db.get(id);

    if (!task || task.userId !== user._id) {
      return null;
    }

    return task;
  },
});

// Create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    deadline: v.optional(v.number()),
    priority: v.optional(priorityValidator),
    estimatedDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const taskId = await ctx.db.insert("tasks", {
      userId: user._id,
      title: args.title,
      description: args.description,
      deadline: args.deadline,
      priority: args.priority ?? "MEDIUM",
      status: "TODO",
      estimatedDuration: args.estimatedDuration,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return taskId;
  },
});

// Update a task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    deadline: v.optional(v.number()),
    priority: v.optional(priorityValidator),
    status: v.optional(statusValidator),
    estimatedDuration: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const user = await getCurrentUser(ctx);
    const task = await ctx.db.get(id);

    if (!task || task.userId !== user._id) {
      throw new Error("Task not found");
    }

    const updateData: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.estimatedDuration !== undefined) updateData.estimatedDuration = updates.estimatedDuration;

    if (updates.status !== undefined) {
      updateData.status = updates.status;
      if (updates.status === "COMPLETED") {
        updateData.completedAt = Date.now();
      }
    }

    await ctx.db.patch(id, updateData);

    return await ctx.db.get(id);
  },
});

// Update task status (optimized for drag-and-drop)
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: statusValidator,
  },
  handler: async (ctx, { id, status }) => {
    const user = await getCurrentUser(ctx);
    const task = await ctx.db.get(id);

    if (!task || task.userId !== user._id) {
      throw new Error("Task not found");
    }

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: Date.now(),
    };

    if (status === "COMPLETED") {
      updateData.completedAt = Date.now();
    }

    await ctx.db.patch(id, updateData);

    return await ctx.db.get(id);
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUser(ctx);
    const task = await ctx.db.get(id);

    if (!task || task.userId !== user._id) {
      throw new Error("Task not found");
    }

    await ctx.db.delete(id);

    return { success: true };
  },
});
