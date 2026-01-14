import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Streak } from '../models/streak.model';
import * as StreakActions from './streaks.actions';

export interface StreaksState extends EntityState<Streak> {
  loading: boolean;
  error: string | null;
  currentStreakId: string | null;
}

export const adapter: EntityAdapter<Streak> = createEntityAdapter<Streak>();

export const initialState: StreaksState = adapter.getInitialState({
  loading: false,
  error: null,
  currentStreakId: null
});

export const streaksReducer = createReducer(
  initialState,
  
  // Load Streaks
  on(StreakActions.loadStreaks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(StreakActions.loadStreaksSuccess, (state, { streaks }) =>
    adapter.setAll(streaks, {
      ...state,
      loading: false,
      currentStreakId: streaks[0]?.id || null
    })
  ),
  
  on(StreakActions.loadStreaksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Increment Streak
  on(StreakActions.incrementStreakSuccess, (state, { streak }) =>
    adapter.updateOne(
      {
        id: streak.id,
        changes: {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastCheckIn: streak.lastCheckIn
        }
      },
      state
    )
  ),
  
  // Break Streak
  on(StreakActions.breakStreak, (state, { streakId }) =>
    adapter.updateOne(
      {
        id: streakId,
        changes: {
          currentStreak: 0,
          lastCheckIn: new Date()
        }
      },
      state
    )
  ),
  
  // Use Freeze
  on(StreakActions.useFreeze, (state, { streakId }) => {
    const streak = state.entities[streakId];
    if (!streak) return state;
    
    return adapter.updateOne(
      {
        id: streakId,
        changes: {
          freezesUsed: streak.freezesUsed + 1,
          freezesAvailable: streak.freezesAvailable - 1
        }
      },
      state
    );
  }),
  
  // Reset Streak
  on(StreakActions.resetStreak, (state, { streakId }) =>
    adapter.updateOne(
      {
        id: streakId,
        changes: {
          currentStreak: 0,
          longestStreak: 0,
          lastCheckIn: new Date(),
          freezesUsed: 0,
          freezesAvailable: 3
        }
      },
      state
    )
  )
);

// Selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
