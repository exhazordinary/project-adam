import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createMoodEntryValidation = [
  body('moodLevel').isInt({ min: 1, max: 10 }),
  body('stressLevel').optional().isInt({ min: 1, max: 10 }),
];

export const createMoodEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { moodLevel, stressLevel, notes, activities, sleepHours } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId,
        moodLevel: parseInt(moodLevel),
        stressLevel: stressLevel ? parseInt(stressLevel) : null,
        notes,
        activities: activities ? JSON.stringify(activities) : null,
        sleepHours: sleepHours ? parseFloat(sleepHours) : null,
      },
    });

    res.status(201).json({
      message: 'Mood entry created successfully',
      moodEntry,
    });
  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({ error: 'Failed to create mood entry' });
  }
};

export const getMoodEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { startDate, endDate, limit } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const where: any = { userId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate as string);
      if (endDate) where.timestamp.lte = new Date(endDate as string);
    }

    const moodEntries = await prisma.moodEntry.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
    });

    res.json({ moodEntries });
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
};

export const getMoodStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { days = 7 } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId,
        timestamp: { gte: daysAgo },
      },
      orderBy: { timestamp: 'asc' },
    });

    if (entries.length === 0) {
      res.json({
        stats: {
          averageMood: 0,
          averageStress: 0,
          averageSleep: 0,
          totalEntries: 0,
          trend: 'stable',
        },
        entries: [],
      });
      return;
    }

    const averageMood = entries.reduce((sum, e) => sum + e.moodLevel, 0) / entries.length;

    const stressEntries = entries.filter(e => e.stressLevel !== null);
    const averageStress = stressEntries.length > 0
      ? stressEntries.reduce((sum, e) => sum + (e.stressLevel || 0), 0) / stressEntries.length
      : 0;

    const sleepEntries = entries.filter(e => e.sleepHours !== null);
    const averageSleep = sleepEntries.length > 0
      ? sleepEntries.reduce((sum, e) => sum + (e.sleepHours || 0), 0) / sleepEntries.length
      : 0;

    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(entries.length / 2);
    const firstHalfAvg = entries.slice(0, midPoint).reduce((sum, e) => sum + e.moodLevel, 0) / midPoint;
    const secondHalfAvg = entries.slice(midPoint).reduce((sum, e) => sum + e.moodLevel, 0) / (entries.length - midPoint);

    let trend = 'stable';
    if (secondHalfAvg > firstHalfAvg + 0.5) trend = 'improving';
    else if (secondHalfAvg < firstHalfAvg - 0.5) trend = 'declining';

    res.json({
      stats: {
        averageMood: Math.round(averageMood * 10) / 10,
        averageStress: Math.round(averageStress * 10) / 10,
        averageSleep: Math.round(averageSleep * 10) / 10,
        totalEntries: entries.length,
        trend,
      },
      entries,
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Failed to fetch mood statistics' });
  }
};

export const getLatestMoodEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const moodEntry = await prisma.moodEntry.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    if (!moodEntry) {
      res.status(404).json({ error: 'No mood entries found' });
      return;
    }

    res.json({ moodEntry });
  } catch (error) {
    console.error('Get latest mood entry error:', error);
    res.status(500).json({ error: 'Failed to fetch latest mood entry' });
  }
};
