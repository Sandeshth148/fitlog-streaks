import { createAction, props } from '@ngrx/store';
import { Streak } from '../models/streak.model';

// Load Streaks
export const loadStreaks = createAction('[Streaks] Load Streaks');

export const loadStreaksSuccess = createAction(
  '[Streaks] Load Streaks Success',
  props<{ streaks: Streak[] }>()
);

export const loadStreaksFailure = createAction(
  '[Streaks] Load Streaks Failure',
  props<{ error: string }>()
);

// Increment Streak (when user logs weight)
export const incrementStreak = createAction(
  '[Streaks] Increment Streak',
  props<{ streakId: string }>()
);

export const incrementStreakSuccess = createAction(
  '[Streaks] Increment Streak Success',
  props<{ streak: Streak }>()
);

// Break Streak
export const breakStreak = createAction(
  '[Streaks] Break Streak',
  props<{ streakId: string }>()
);

// Use Freeze
export const useFreeze = createAction(
  '[Streaks] Use Freeze',
  props<{ streakId: string }>()
);

// Reset Streak
export const resetStreak = createAction(
  '[Streaks] Reset Streak',
  props<{ streakId: string }>()
);
