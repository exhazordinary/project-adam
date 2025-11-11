export interface User {
  id: string;
  email: string;
  name: string;
  university?: string;
  year?: number;
  major?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: ScheduleType;
  recurrence: Recurrence;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ScheduleType {
  CLASS = 'CLASS',
  STUDY = 'STUDY',
  BREAK = 'BREAK',
  SOCIAL = 'SOCIAL',
  EXERCISE = 'EXERCISE',
  OTHER = 'OTHER',
}

export enum Recurrence {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedDuration?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodLevel: number;
  stressLevel?: number;
  notes?: string;
  timestamp: string;
  activities: string[];
  sleepHours?: number;
}

export interface MoodStats {
  averageMood: number;
  averageStress: number;
  averageSleep: number;
  totalEntries: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  duration: number;
  stressReliefScore: number;
  instructions?: string;
  videoUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

export enum ActivityCategory {
  EXERCISE = 'EXERCISE',
  MEDITATION = 'MEDITATION',
  SOCIAL = 'SOCIAL',
  OUTDOOR = 'OUTDOOR',
  CREATIVE = 'CREATIVE',
  RELAXATION = 'RELAXATION',
  LEARNING = 'LEARNING',
}

export interface UserActivity {
  id: string;
  userId: string;
  activityId: string;
  completedAt: string;
  rating?: number;
  notes?: string;
  activity: Activity;
}
