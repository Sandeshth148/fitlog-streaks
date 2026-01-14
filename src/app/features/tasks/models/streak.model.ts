/**
 * Streak Model
 * Represents a user's streak tracking data
 */

export interface Streak {
  id: string;
  userId: string;
  type: 'logging' | 'goal' | 'consistency';
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date;
  startDate: Date;
  freezesAvailable: number;
  freezesUsed: number;
  milestones: Milestone[];
}

export interface Milestone {
  days: number;
  achieved: boolean;
  achievedDate?: Date;
  badge?: Badge;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'weight-loss' | 'weight-gain' | 'maintenance' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedDate?: Date;
}

export interface StreakStats {
  totalDaysLogged: number;
  currentStreak: number;
  longestStreak: number;
  totalBadges: number;
  streakPercentage: number;
}
