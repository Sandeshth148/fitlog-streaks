import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StreaksState, selectAll, selectEntities } from './streaks.reducer';

// Feature selector
export const selectStreaksState = createFeatureSelector<StreaksState>('streaks');

// Get all streaks
export const selectAllStreaks = createSelector(
  selectStreaksState,
  selectAll
);

// Get streak entities
export const selectStreakEntities = createSelector(
  selectStreaksState,
  selectEntities
);

// Get loading state
export const selectStreaksLoading = createSelector(
  selectStreaksState,
  (state) => state.loading
);

// Get error
export const selectStreaksError = createSelector(
  selectStreaksState,
  (state) => state.error
);

// Get current streak
export const selectCurrentStreak = createSelector(
  selectStreaksState,
  selectStreakEntities,
  (state, entities) => state.currentStreakId ? entities[state.currentStreakId] : null
);

// Get current streak count
export const selectCurrentStreakCount = createSelector(
  selectCurrentStreak,
  (streak) => streak?.currentStreak || 0
);

// Get longest streak
export const selectLongestStreak = createSelector(
  selectCurrentStreak,
  (streak) => streak?.longestStreak || 0
);

// Get freezes available
export const selectFreezesAvailable = createSelector(
  selectCurrentStreak,
  (streak) => streak?.freezesAvailable || 0
);

// Get last check-in date
export const selectLastCheckIn = createSelector(
  selectCurrentStreak,
  (streak) => streak?.lastCheckIn
);
