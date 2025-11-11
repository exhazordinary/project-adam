import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, maxDuration } = req.query;

    const where: any = {};
    if (category) where.category = category;
    if (maxDuration) where.duration = { lte: parseInt(maxDuration as string) };

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { stressReliefScore: 'desc' },
    });

    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

export const getActivityById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.json({ activity });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

export const logActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { activityId, rating, notes } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    const userActivity = await prisma.userActivity.create({
      data: {
        userId,
        activityId,
        rating: rating ? parseInt(rating) : null,
        notes,
      },
      include: {
        activity: true,
      },
    });

    res.status(201).json({
      message: 'Activity logged successfully',
      userActivity,
    });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
};

export const getUserActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { startDate, endDate, limit } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const where: any = { userId };

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = new Date(startDate as string);
      if (endDate) where.completedAt.lte = new Date(endDate as string);
    }

    const userActivities = await prisma.userActivity.findMany({
      where,
      include: {
        activity: true,
      },
      orderBy: { completedAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
    });

    res.json({ userActivities });
  } catch (error) {
    console.error('Get user activities error:', error);
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
};

export const getRecommendedActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { maxDuration = 30, limit = 5 } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get user's recent mood entries to determine stress level
    const recentMood = await prisma.moodEntry.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    // Get activities the user hasn't done recently
    const recentActivities = await prisma.userActivity.findMany({
      where: {
        userId,
        completedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      select: { activityId: true },
    });

    const recentActivityIds = recentActivities.map(ua => ua.activityId);

    // Recommend activities based on stress level and preferences
    const recommendedActivities = await prisma.activity.findMany({
      where: {
        duration: { lte: parseInt(maxDuration as string) },
        ...(recentActivityIds.length > 0 && {
          id: { notIn: recentActivityIds },
        }),
      },
      orderBy: { stressReliefScore: 'desc' },
      take: parseInt(limit as string),
    });

    res.json({
      recommendedActivities,
      reason: recentMood && recentMood.stressLevel && recentMood.stressLevel > 6
        ? 'High stress detected - prioritizing relaxation activities'
        : 'Balanced activity recommendations for your well-being',
    });
  } catch (error) {
    console.error('Get recommended activities error:', error);
    res.status(500).json({ error: 'Failed to fetch recommended activities' });
  }
};

export const getActivityStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { days = 30 } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const activities = await prisma.userActivity.findMany({
      where: {
        userId,
        completedAt: { gte: daysAgo },
      },
      include: {
        activity: true,
      },
    });

    const categoryCount: Record<string, number> = {};
    activities.forEach(ua => {
      const category = ua.activity.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const totalActivities = activities.length;
    const averageRating = activities.filter(a => a.rating)
      .reduce((sum, a) => sum + (a.rating || 0), 0) / activities.filter(a => a.rating).length || 0;

    res.json({
      stats: {
        totalActivities,
        averageRating: Math.round(averageRating * 10) / 10,
        categoryBreakdown: categoryCount,
      },
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ error: 'Failed to fetch activity statistics' });
  }
};
