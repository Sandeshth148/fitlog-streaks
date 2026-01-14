import { Injectable } from '@angular/core';
import { WeightEntry } from '../../weight-tracker/models/weight-entry.model';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  lastLogDate: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class StreakCalculatorService {
  
  /**
   * Calculate streak from weight entries
   * Simple logic: Count consecutive days with entries
   */
  calculateStreak(entries: WeightEntry[]): StreakResult {
    if (!entries || entries.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDaysLogged: 0,
        lastLogDate: null
      };
    }

    // Sort entries by date (newest first)
    const sorted = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Get unique dates (one entry per day)
    const uniqueDates = this.getUniqueDates(sorted);
    
    // Calculate current streak
    const currentStreak = this.getCurrentStreak(uniqueDates);
    
    // Calculate longest streak
    const longestStreak = this.getLongestStreak(uniqueDates);

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalDaysLogged: uniqueDates.length,
      lastLogDate: uniqueDates.length > 0 ? uniqueDates[0] : null
    };
  }

  /**
   * Get unique dates (one per day)
   */
  private getUniqueDates(entries: WeightEntry[]): Date[] {
    const dateStrings = new Set<string>();
    const dates: Date[] = [];

    for (const entry of entries) {
      const dateStr = new Date(entry.date).toDateString();
      if (!dateStrings.has(dateStr)) {
        dateStrings.add(dateStr);
        dates.push(new Date(entry.date));
      }
    }

    return dates.sort((a, b) => b.getTime() - a.getTime());
  }

  /**
   * Calculate current streak (consecutive days from today)
   */
  private getCurrentStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    for (const entryDate of dates) {
      const entry = new Date(entryDate);
      entry.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((checkDate.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        checkDate = new Date(entry);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculate longest streak ever
   */
  private getLongestStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }
}
