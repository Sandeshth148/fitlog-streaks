import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as StreakActions from './streaks.actions';
import { Streak } from '../models/streak.model';

@Injectable()
export class StreaksEffects {
  
  // Load streaks from storage
  loadStreaks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StreakActions.loadStreaks),
      switchMap(() => {
        // TODO: Load from IndexedDB
        // For now, return mock data
        const mockStreak: Streak = {
          id: '1',
          userId: 'user1',
          type: 'logging',
          currentStreak: 5,
          longestStreak: 12,
          lastCheckIn: new Date(),
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          freezesAvailable: 3,
          freezesUsed: 0,
          milestones: [
            { days: 7, achieved: false },
            { days: 30, achieved: false },
            { days: 90, achieved: false }
          ]
        };
        
        return of(StreakActions.loadStreaksSuccess({ streaks: [mockStreak] }));
      }),
      catchError((error) =>
        of(StreakActions.loadStreaksFailure({ error: error.message }))
      )
    )
  );
  
  // Increment streak
  incrementStreak$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StreakActions.incrementStreak),
      switchMap(({ streakId }) => {
        // TODO: Update in IndexedDB
        // For now, return updated streak
        const updatedStreak: Streak = {
          id: streakId,
          userId: 'user1',
          type: 'logging',
          currentStreak: 6,
          longestStreak: 12,
          lastCheckIn: new Date(),
          startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          freezesAvailable: 3,
          freezesUsed: 0,
          milestones: [
            { days: 7, achieved: false },
            { days: 30, achieved: false },
            { days: 90, achieved: false }
          ]
        };
        
        return of(StreakActions.incrementStreakSuccess({ streak: updatedStreak }));
      })
    )
  );
  
  constructor(private actions$: Actions) {}
}
