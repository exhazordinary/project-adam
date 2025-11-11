import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Seed Activities
  const activities = [
    {
      name: '10-Minute Walk',
      description: 'A refreshing outdoor walk to clear your mind and boost energy',
      category: 'OUTDOOR',
      duration: 10,
      stressReliefScore: 7,
      instructions: 'Take a leisurely walk around campus or your neighborhood',
    },
    {
      name: 'Deep Breathing Exercise',
      description: 'Simple breathing technique to reduce stress and anxiety',
      category: 'RELAXATION',
      duration: 5,
      stressReliefScore: 8,
      instructions: 'Breathe in for 4 counts, hold for 4, exhale for 4. Repeat 10 times.',
    },
    {
      name: 'Quick Yoga Session',
      description: 'Gentle stretches to release tension and improve flexibility',
      category: 'EXERCISE',
      duration: 15,
      stressReliefScore: 9,
      instructions: 'Follow a beginner yoga routine focusing on stretching',
    },
    {
      name: 'Meditation',
      description: 'Guided meditation for mental clarity and peace',
      category: 'MEDITATION',
      duration: 10,
      stressReliefScore: 9,
      instructions: 'Find a quiet space, sit comfortably, and focus on your breath',
    },
    {
      name: 'Coffee with Friends',
      description: 'Social connection to boost mood and reduce isolation',
      category: 'SOCIAL',
      duration: 30,
      stressReliefScore: 8,
      instructions: 'Meet a friend at a cafe and catch up',
    },
    {
      name: 'Creative Drawing',
      description: 'Express yourself through art and unleash creativity',
      category: 'CREATIVE',
      duration: 20,
      stressReliefScore: 7,
      instructions: 'Draw, doodle, or sketch whatever comes to mind',
    },
    {
      name: 'Power Nap',
      description: 'Short rest to recharge and improve focus',
      category: 'RELAXATION',
      duration: 20,
      stressReliefScore: 8,
      instructions: 'Find a quiet place and rest for 15-20 minutes',
    },
    {
      name: 'Study Group',
      description: 'Collaborative learning with peers',
      category: 'LEARNING',
      duration: 60,
      stressReliefScore: 5,
      instructions: 'Meet with classmates to study and discuss course material',
    },
    {
      name: 'Jogging',
      description: 'Cardiovascular exercise to boost endorphins',
      category: 'EXERCISE',
      duration: 30,
      stressReliefScore: 9,
      instructions: 'Go for a light jog at your own pace',
    },
    {
      name: 'Music Break',
      description: 'Listen to your favorite music to lift your spirits',
      category: 'RELAXATION',
      duration: 10,
      stressReliefScore: 7,
      instructions: 'Put on headphones and enjoy your favorite playlist',
    },
  ];

  for (const activity of activities) {
    const existing = await prisma.activity.findFirst({
      where: { name: activity.name },
    });

    if (!existing) {
      await prisma.activity.create({ data: activity });
    }
  }

  console.log('Activities seeded successfully');

  // Seed Relaxation Techniques
  const techniques = [
    {
      name: '4-7-8 Breathing',
      description: 'A powerful breathing technique to reduce anxiety',
      duration: 5,
      instructions: JSON.stringify([
        'Exhale completely through your mouth',
        'Close your mouth and inhale through nose for 4 counts',
        'Hold breath for 7 counts',
        'Exhale completely through mouth for 8 counts',
        'Repeat cycle 4 times',
      ]),
      benefits: JSON.stringify([
        'Reduces anxiety',
        'Helps with sleep',
        'Manages stress response',
        'Improves focus',
      ]),
      difficulty: 'beginner',
      category: 'breathing',
    },
    {
      name: 'Progressive Muscle Relaxation',
      description: 'Systematically tense and relax muscle groups',
      duration: 15,
      instructions: JSON.stringify([
        'Find a comfortable position',
        'Tense each muscle group for 5 seconds',
        'Release and relax for 10 seconds',
        'Move through all major muscle groups',
        'End with full body relaxation',
      ]),
      benefits: JSON.stringify([
        'Reduces physical tension',
        'Decreases stress',
        'Improves sleep quality',
        'Increases body awareness',
      ]),
      difficulty: 'beginner',
      category: 'physical',
    },
    {
      name: 'Mindfulness Meditation',
      description: 'Present-moment awareness meditation',
      duration: 10,
      instructions: JSON.stringify([
        'Sit comfortably with eyes closed',
        'Focus on your breath',
        'Notice thoughts without judgment',
        'Gently return focus to breath',
        'Continue for desired duration',
      ]),
      benefits: JSON.stringify([
        'Reduces stress',
        'Improves concentration',
        'Enhances emotional regulation',
        'Increases self-awareness',
      ]),
      difficulty: 'beginner',
      category: 'meditation',
    },
    {
      name: 'Body Scan',
      description: 'Mental tour of physical sensations',
      duration: 20,
      instructions: JSON.stringify([
        'Lie down comfortably',
        'Close your eyes',
        'Focus attention on each body part',
        'Notice sensations without judgment',
        'Move systematically from toes to head',
      ]),
      benefits: JSON.stringify([
        'Reduces tension',
        'Improves body awareness',
        'Promotes relaxation',
        'Helps with pain management',
      ]),
      difficulty: 'intermediate',
      category: 'meditation',
    },
    {
      name: 'Visualization',
      description: 'Mental imagery for relaxation',
      duration: 10,
      instructions: JSON.stringify([
        'Close your eyes and relax',
        'Imagine a peaceful place',
        'Engage all your senses',
        'Stay in this mental space',
        'Slowly return to present',
      ]),
      benefits: JSON.stringify([
        'Reduces stress',
        'Improves mood',
        'Enhances creativity',
        'Promotes calm',
      ]),
      difficulty: 'beginner',
      category: 'meditation',
    },
  ];

  for (const technique of techniques) {
    const existing = await prisma.relaxationTechnique.findFirst({
      where: { name: technique.name },
    });

    if (!existing) {
      await prisma.relaxationTechnique.create({ data: technique });
    }
  }

  console.log('Relaxation techniques seeded successfully');
  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
