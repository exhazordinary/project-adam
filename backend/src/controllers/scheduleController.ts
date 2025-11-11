import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createScheduleValidation = [
  body('title').trim().notEmpty(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('type').optional().isIn(['CLASS', 'STUDY', 'BREAK', 'SOCIAL', 'EXERCISE', 'OTHER']),
  body('recurrence').optional().isIn(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']),
];

export const createSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, startTime, endTime, type, recurrence, location } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const schedule = await prisma.schedule.create({
      data: {
        userId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type: type || 'OTHER',
        recurrence: recurrence || 'NONE',
        location,
      },
    });

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule,
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

export const getSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { startDate, endDate, type } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const where: any = { userId };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate as string);
      if (endDate) where.startTime.lte = new Date(endDate as string);
    }

    if (type) {
      where.type = type;
    }

    const schedules = await prisma.schedule.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        reminders: {
          where: { status: 'PENDING' },
        },
      },
    });

    res.json({ schedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

export const getScheduleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const schedule = await prisma.schedule.findFirst({
      where: { id, userId },
      include: {
        reminders: true,
      },
    });

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.json({ schedule });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};

export const updateSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { title, description, startTime, endTime, type, recurrence, location } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existingSchedule = await prisma.schedule.findFirst({
      where: { id, userId },
    });

    if (!existingSchedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(type && { type }),
        ...(recurrence && { recurrence }),
        ...(location !== undefined && { location }),
      },
    });

    res.json({
      message: 'Schedule updated successfully',
      schedule,
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

export const deleteSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const schedule = await prisma.schedule.findFirst({
      where: { id, userId },
    });

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    await prisma.schedule.delete({ where: { id } });

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

export const getTodaySchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedules = await prisma.schedule.findMany({
      where: {
        userId,
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { startTime: 'asc' },
    });

    res.json({ schedules });
  } catch (error) {
    console.error('Get today schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s schedule' });
  }
};
