import { mutation } from "./_generated/server";

// Seed activities data
export const seedActivities = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if activities already exist
    const existingActivities = await ctx.db.query("activities").collect();
    if (existingActivities.length > 0) {
      return { message: "Activities already seeded", count: existingActivities.length };
    }

    const activities = [
      {
        name: "Morning Yoga",
        description: "Start your day with a gentle 15-minute yoga session to awaken your body and mind.",
        category: "EXERCISE" as const,
        duration: 15,
        stressReliefScore: 8,
        instructions: "Find a quiet space, use a yoga mat if available, and follow a beginner-friendly routine.",
      },
      {
        name: "Guided Meditation",
        description: "A 10-minute guided meditation to help you find inner peace and reduce anxiety.",
        category: "MEDITATION" as const,
        duration: 10,
        stressReliefScore: 9,
        instructions: "Sit comfortably, close your eyes, and focus on your breath.",
      },
      {
        name: "Coffee Chat with Friends",
        description: "Connect with a friend over coffee or tea for meaningful conversation.",
        category: "SOCIAL" as const,
        duration: 30,
        stressReliefScore: 7,
        instructions: "Reach out to a friend and schedule a casual meetup.",
      },
      {
        name: "Nature Walk",
        description: "Take a refreshing 20-minute walk in nature to clear your mind.",
        category: "OUTDOOR" as const,
        duration: 20,
        stressReliefScore: 8,
        instructions: "Find a park or trail nearby and enjoy the scenery.",
      },
      {
        name: "Journaling",
        description: "Express your thoughts and feelings through creative writing.",
        category: "CREATIVE" as const,
        duration: 15,
        stressReliefScore: 7,
        instructions: "Write freely without judgment about your day, feelings, or goals.",
      },
      {
        name: "Deep Breathing Exercises",
        description: "Practice deep breathing techniques to instantly reduce stress.",
        category: "RELAXATION" as const,
        duration: 5,
        stressReliefScore: 8,
        instructions: "Inhale for 4 counts, hold for 4 counts, exhale for 4 counts.",
      },
      {
        name: "Read a Book",
        description: "Escape into a good book for mental relaxation and learning.",
        category: "LEARNING" as const,
        duration: 30,
        stressReliefScore: 6,
        instructions: "Choose a book you enjoy and find a comfortable reading spot.",
      },
      {
        name: "Quick HIIT Workout",
        description: "A high-intensity interval training session to boost endorphins.",
        category: "EXERCISE" as const,
        duration: 20,
        stressReliefScore: 9,
        instructions: "Alternate between 30 seconds of intense exercise and 10 seconds of rest.",
      },
      {
        name: "Mindful Coloring",
        description: "Engage in mindful coloring to relax and express creativity.",
        category: "CREATIVE" as const,
        duration: 20,
        stressReliefScore: 7,
        instructions: "Use a coloring book or printable and focus on the present moment.",
      },
      {
        name: "Progressive Muscle Relaxation",
        description: "Systematically tense and relax muscle groups to release physical tension.",
        category: "RELAXATION" as const,
        duration: 15,
        stressReliefScore: 8,
        instructions: "Start from your toes and work up to your head, tensing each muscle group for 5 seconds.",
      },
    ];

    for (const activity of activities) {
      await ctx.db.insert("activities", {
        ...activity,
        createdAt: Date.now(),
      });
    }

    return { message: "Activities seeded successfully", count: activities.length };
  },
});

// Seed relaxation techniques data
export const seedRelaxationTechniques = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if techniques already exist
    const existingTechniques = await ctx.db.query("relaxationTechniques").collect();
    if (existingTechniques.length > 0) {
      return { message: "Relaxation techniques already seeded", count: existingTechniques.length };
    }

    const techniques = [
      {
        name: "4-7-8 Breathing Technique",
        description: "A powerful breathing exercise that promotes relaxation and helps you fall asleep.",
        duration: 5,
        instructions: [
          "Exhale completely through your mouth",
          "Close your mouth and inhale through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale completely through your mouth for 8 counts",
          "Repeat the cycle 3-4 times",
        ],
        benefits: [
          "Reduces anxiety",
          "Helps with sleep",
          "Lowers heart rate",
          "Improves focus",
        ],
        difficulty: "beginner" as const,
        category: "breathing",
      },
      {
        name: "Body Scan Meditation",
        description: "A mindfulness practice that involves paying attention to parts of the body in sequence.",
        duration: 15,
        instructions: [
          "Lie down in a comfortable position",
          "Close your eyes and take several deep breaths",
          "Focus your attention on your toes",
          "Slowly move your attention up through your body",
          "Notice any sensations without judgment",
          "Continue until you reach the top of your head",
        ],
        benefits: [
          "Increases body awareness",
          "Reduces physical tension",
          "Promotes relaxation",
          "Improves sleep quality",
        ],
        difficulty: "beginner" as const,
        category: "meditation",
      },
      {
        name: "Progressive Muscle Relaxation",
        description: "A technique that involves tensing and relaxing muscle groups to reduce stress.",
        duration: 20,
        instructions: [
          "Find a quiet, comfortable place",
          "Start with your feet - tense the muscles for 5 seconds",
          "Release and notice the feeling of relaxation",
          "Move to your calves, then thighs",
          "Continue through your entire body",
          "End with your face muscles",
        ],
        benefits: [
          "Reduces muscle tension",
          "Decreases anxiety",
          "Improves sleep",
          "Helps manage chronic pain",
        ],
        difficulty: "intermediate" as const,
        category: "physical",
      },
      {
        name: "Visualization Exercise",
        description: "Use your imagination to create calming mental images and scenarios.",
        duration: 10,
        instructions: [
          "Close your eyes and take deep breaths",
          "Imagine a peaceful place (beach, forest, mountain)",
          "Engage all your senses in the visualization",
          "Imagine the sounds, smells, and textures",
          "Stay in this peaceful place for several minutes",
          "Slowly return to the present moment",
        ],
        benefits: [
          "Reduces stress hormones",
          "Improves mood",
          "Enhances creativity",
          "Promotes emotional healing",
        ],
        difficulty: "beginner" as const,
        category: "meditation",
      },
      {
        name: "Mindful Walking",
        description: "A form of meditation where you focus entirely on the act of walking.",
        duration: 15,
        instructions: [
          "Find a quiet path or space",
          "Walk slowly and deliberately",
          "Pay attention to each step",
          "Notice how your feet feel touching the ground",
          "Be aware of your breath and surroundings",
          "If your mind wanders, gently return focus to walking",
        ],
        benefits: [
          "Combines exercise with meditation",
          "Reduces anxiety",
          "Improves focus",
          "Connects you with nature",
        ],
        difficulty: "beginner" as const,
        category: "physical",
      },
    ];

    for (const technique of techniques) {
      await ctx.db.insert("relaxationTechniques", {
        ...technique,
        createdAt: Date.now(),
      });
    }

    return { message: "Relaxation techniques seeded successfully", count: techniques.length };
  },
});

// Seed all data at once
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const results = [];

    // Seed activities
    const existingActivities = await ctx.db.query("activities").collect();
    if (existingActivities.length === 0) {
      const activities = [
        { name: "Morning Yoga", description: "Start your day with a gentle 15-minute yoga session.", category: "EXERCISE" as const, duration: 15, stressReliefScore: 8 },
        { name: "Guided Meditation", description: "A 10-minute guided meditation for inner peace.", category: "MEDITATION" as const, duration: 10, stressReliefScore: 9 },
        { name: "Coffee Chat", description: "Connect with a friend over coffee.", category: "SOCIAL" as const, duration: 30, stressReliefScore: 7 },
        { name: "Nature Walk", description: "Take a refreshing 20-minute walk in nature.", category: "OUTDOOR" as const, duration: 20, stressReliefScore: 8 },
        { name: "Journaling", description: "Express your thoughts through writing.", category: "CREATIVE" as const, duration: 15, stressReliefScore: 7 },
        { name: "Deep Breathing", description: "Practice deep breathing techniques.", category: "RELAXATION" as const, duration: 5, stressReliefScore: 8 },
        { name: "Read a Book", description: "Escape into a good book.", category: "LEARNING" as const, duration: 30, stressReliefScore: 6 },
        { name: "Quick HIIT", description: "High-intensity interval training.", category: "EXERCISE" as const, duration: 20, stressReliefScore: 9 },
        { name: "Mindful Coloring", description: "Engage in mindful coloring.", category: "CREATIVE" as const, duration: 20, stressReliefScore: 7 },
        { name: "Muscle Relaxation", description: "Progressive muscle relaxation.", category: "RELAXATION" as const, duration: 15, stressReliefScore: 8 },
      ];

      for (const activity of activities) {
        await ctx.db.insert("activities", { ...activity, createdAt: Date.now() });
      }
      results.push({ activities: activities.length });
    }

    // Seed relaxation techniques
    const existingTechniques = await ctx.db.query("relaxationTechniques").collect();
    if (existingTechniques.length === 0) {
      const techniques = [
        { name: "4-7-8 Breathing", description: "Powerful breathing exercise.", duration: 5, instructions: ["Inhale for 4", "Hold for 7", "Exhale for 8"], benefits: ["Reduces anxiety", "Helps sleep"], difficulty: "beginner" as const, category: "breathing" },
        { name: "Body Scan", description: "Mindfulness body scan meditation.", duration: 15, instructions: ["Lie down", "Focus on each body part"], benefits: ["Reduces tension", "Improves awareness"], difficulty: "beginner" as const, category: "meditation" },
        { name: "PMR", description: "Progressive Muscle Relaxation.", duration: 20, instructions: ["Tense muscles", "Release and relax"], benefits: ["Reduces tension", "Improves sleep"], difficulty: "intermediate" as const, category: "physical" },
        { name: "Visualization", description: "Create calming mental images.", duration: 10, instructions: ["Close eyes", "Imagine peaceful place"], benefits: ["Reduces stress", "Improves mood"], difficulty: "beginner" as const, category: "meditation" },
        { name: "Mindful Walking", description: "Walking meditation.", duration: 15, instructions: ["Walk slowly", "Focus on steps"], benefits: ["Exercise + meditation", "Reduces anxiety"], difficulty: "beginner" as const, category: "physical" },
      ];

      for (const technique of techniques) {
        await ctx.db.insert("relaxationTechniques", { ...technique, createdAt: Date.now() });
      }
      results.push({ techniques: techniques.length });
    }

    return { message: "Seed completed", results };
  },
});
