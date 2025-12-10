import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - integrates with Clerk auth
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    university: v.optional(v.string()),
    year: v.optional(v.number()),
    major: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Schedules table
  schedules: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    type: v.union(
      v.literal("CLASS"),
      v.literal("STUDY"),
      v.literal("BREAK"),
      v.literal("SOCIAL"),
      v.literal("EXERCISE"),
      v.literal("OTHER")
    ),
    recurrence: v.union(
      v.literal("NONE"),
      v.literal("DAILY"),
      v.literal("WEEKLY"),
      v.literal("MONTHLY")
    ),
    location: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_time", ["userId", "startTime"]),

  // Tasks table
  tasks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    deadline: v.optional(v.number()),
    priority: v.union(
      v.literal("LOW"),
      v.literal("MEDIUM"),
      v.literal("HIGH"),
      v.literal("URGENT")
    ),
    status: v.union(
      v.literal("TODO"),
      v.literal("IN_PROGRESS"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
    estimatedDuration: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_user_and_deadline", ["userId", "deadline"]),

  // Mood entries table
  moodEntries: defineTable({
    userId: v.id("users"),
    moodLevel: v.number(),
    stressLevel: v.optional(v.number()),
    notes: v.optional(v.string()),
    timestamp: v.number(),
    activities: v.optional(v.array(v.string())),
    sleepHours: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_time", ["userId", "timestamp"]),

  // Activities table (predefined activities)
  activities: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("EXERCISE"),
      v.literal("MEDITATION"),
      v.literal("SOCIAL"),
      v.literal("OUTDOOR"),
      v.literal("CREATIVE"),
      v.literal("RELAXATION"),
      v.literal("LEARNING")
    ),
    duration: v.number(),
    stressReliefScore: v.number(),
    instructions: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_stress_relief", ["stressReliefScore"]),

  // User activity log
  userActivities: defineTable({
    userId: v.id("users"),
    activityId: v.id("activities"),
    completedAt: v.number(),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_time", ["userId", "completedAt"]),

  // Reminders table
  reminders: defineTable({
    userId: v.id("users"),
    scheduleId: v.optional(v.id("schedules")),
    taskId: v.optional(v.id("tasks")),
    type: v.union(
      v.literal("SCHEDULE"),
      v.literal("TASK"),
      v.literal("MOOD_CHECK"),
      v.literal("BREAK"),
      v.literal("ACTIVITY")
    ),
    reminderTime: v.number(),
    message: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("SENT"),
      v.literal("DISMISSED"),
      v.literal("SNOOZED")
    ),
    createdAt: v.number(),
    sentAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status", "reminderTime"]),

  // Relaxation techniques table
  relaxationTechniques: defineTable({
    name: v.string(),
    description: v.string(),
    duration: v.number(),
    instructions: v.array(v.string()),
    benefits: v.array(v.string()),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    audioUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    category: v.string(),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"]),
});
