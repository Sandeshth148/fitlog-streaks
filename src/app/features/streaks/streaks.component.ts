import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { StreakCalculatorService } from './services/streak-calculator.service';
import { WeightEntry } from '../weight-tracker/models/weight-entry.model';
import { ToastService } from '../../core/services/toast.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-streaks',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="streaks-container">
      <div class="streaks-header">
        <h1>🔥 {{ 'streaks.title' | translate }}</h1>
        <p class="subtitle">{{ 'streaks.subtitle' | translate }}</p>
      </div>

      <div class="streak-display">
        <div class="streak-card" title="Days you've logged weight in a row">
          <div class="fire-icon">🔥</div>
          <h2>{{ 'streaks.current' | translate }}</h2>
          <div class="streak-number">{{ currentStreak }} {{ 'streaks.days' | translate }}</div>
          <p class="last-checkin" *ngIf="lastLogDate">{{ 'streaks.last' | translate }} {{ lastLogDate | date:'MMM d' }}</p>
          <p class="last-checkin" *ngIf="!lastLogDate">{{ 'streaks.noEntries' | translate }}</p>
        </div>

        <div class="streak-card" title="Your longest streak ever">
          <div class="trophy-icon">🏆</div>
          <h2>{{ 'streaks.longest' | translate }}</h2>
          <div class="streak-number">{{ longestStreak }} {{ 'streaks.days' | translate }}</div>
          <p class="subtitle-text">{{ 'streaks.personalBest' | translate }}</p>
        </div>

        <div class="streak-card" title="Total days you've tracked your weight">
          <div class="calendar-icon">📅</div>
          <h2>{{ 'streaks.total' | translate }}</h2>
          <div class="streak-number">{{ totalDaysLogged }}</div>
          <p class="subtitle-text">{{ 'streaks.keepUp' | translate }}</p>
        </div>
      </div>

      <!-- Badges Section -->
      <div class="badges-section">
        <h2>🏆 {{ 'streaks.achievements' | translate }}</h2>
        <div class="badges-grid">
          <!-- Profile Badge -->
          <div class="badge-card" [class.earned]="hasCompleteProfile" [class.locked]="!hasCompleteProfile">
            <div class="badge-icon">📝</div>
            <h3>{{ 'streaks.badges.trailblazer' | translate }}</h3>
            <p>{{ 'streaks.badges.trailblazerDesc' | translate }}</p>
            <div class="badge-status" *ngIf="hasCompleteProfile">✅ {{ 'streaks.badges.earned' | translate }}</div>
            <div class="badge-status locked" *ngIf="!hasCompleteProfile">🔒 {{ 'streaks.badges.trailblazerLock' | translate }}</div>
          </div>

          <!-- First Entry Badge -->
          <div class="badge-card" [class.earned]="totalDaysLogged >= 1" [class.locked]="totalDaysLogged < 1">
            <div class="badge-icon">🎯</div>
            <h3>{{ 'streaks.badges.firstStep' | translate }}</h3>
            <p>{{ 'streaks.badges.firstStepDesc' | translate }}</p>
            <div class="badge-status" *ngIf="totalDaysLogged >= 1">✅ {{ 'streaks.badges.earned' | translate }}</div>
            <div class="badge-status locked" *ngIf="totalDaysLogged < 1">🔒 {{ 'streaks.badges.firstStepLock' | translate }}</div>
          </div>

          <!-- 365-Day Streak -->
          <div class="badge-card" [class.earned]="longestStreak >= 365" [class.locked]="longestStreak < 365">
            <div class="badge-icon">🏆</div>
            <h3>{{ 'streaks.badges.legend' | translate }}</h3>
            <p>{{ 'streaks.badges.legendDesc' | translate }}</p>
            <div class="badge-progress" *ngIf="longestStreak < 365">
              🔒 {{ longestStreak }}/365 {{ 'streaks.days' | translate }}
            </div>
          </div>

          <!-- 7-Day Streak -->
          <div class="badge-card" [class.earned]="longestStreak >= 7" [class.locked]="longestStreak < 7">
            <div class="badge-icon">⭐</div>
            <h3>{{ 'streaks.badges.weekender' | translate }}</h3>
            <p>{{ 'streaks.badges.weekenderDesc' | translate }}</p>
            <div class="badge-progress" *ngIf="longestStreak < 7">
              🔒 {{ longestStreak }}/7 {{ 'streaks.days' | translate }}
            </div>
          </div>

          <!-- 14-Day Streak -->
          <div class="badge-card" [class.earned]="longestStreak >= 14" [class.locked]="longestStreak < 14">
            <div class="badge-icon">💪</div>
            <h3>{{ 'streaks.badges.fortnight' | translate }}</h3>
            <p>{{ 'streaks.badges.fortnightDesc' | translate }}</p>
            <div class="badge-progress" *ngIf="longestStreak < 14">
              🔒 {{ longestStreak }}/14 {{ 'streaks.days' | translate }}
            </div>
          </div>

          <!-- 100-Day Streak -->
          <div class="badge-card" [class.earned]="longestStreak >= 100" [class.locked]="longestStreak < 100">
            <div class="badge-icon">👑</div>
            <h3>{{ 'streaks.badges.centurion' | translate }}</h3>
            <p>{{ 'streaks.badges.centurionDesc' | translate }}</p>
            <div class="badge-progress" *ngIf="longestStreak < 100">
              🔒 {{ longestStreak }}/100 {{ 'streaks.days' | translate }}
            </div>
          </div>

          <!-- 50 Entries -->
          <div class="badge-card" [class.earned]="totalDaysLogged >= 50" [class.locked]="totalDaysLogged < 50">
            <div class="badge-icon">📊</div>
            <h3>{{ 'streaks.badges.dataCollector' | translate }}</h3>
            <p>{{ 'streaks.badges.dataCollectorDesc' | translate }}</p>
            <div class="badge-status" *ngIf="totalDaysLogged >= 50">✅ Earned!</div>
            <div class="badge-status locked" *ngIf="totalDaysLogged < 50">🔒 {{ totalDaysLogged }}/50 {{ 'streaks.entries' | translate }}</div>
          </div>

          <!-- 100-Day Streak -->
          <div class="badge-card" [class.earned]="currentStreak >= 100" [class.locked]="currentStreak < 100">
            <div class="badge-icon">👑</div>
            <h3>{{ 'streaks.badges.centurion' | translate }}</h3>
            <p>{{ 'streaks.badges.centurionDesc' | translate }}</p>
            <div class="badge-status" *ngIf="currentStreak >= 100">✅ {{ 'streaks.badges.earned' | translate }}</div>
            <div class="badge-status locked" *ngIf="currentStreak < 100">🔒 {{ currentStreak }}/100 {{ 'streaks.days' | translate }}</div>
          </div>

          <!-- 100 Entries -->
          <div class="badge-card" [class.earned]="totalDaysLogged >= 100" [class.locked]="totalDaysLogged < 100">
            <div class="badge-icon">🎖️</div>
            <h3>{{ 'streaks.badges.dedicated' | translate }}</h3>
            <p>{{ 'streaks.badges.dedicatedDesc' | translate }}</p>
            <div class="badge-status" *ngIf="totalDaysLogged >= 100">✅ {{ 'streaks.badges.earned' | translate }}</div>
            <div class="badge-status locked" *ngIf="totalDaysLogged < 100">🔒 {{ totalDaysLogged }}/100 {{ 'streaks.entries' | translate }}</div>
          </div>

          <!-- 365-Day Streak -->
          <div class="badge-card" [class.earned]="currentStreak >= 365" [class.locked]="currentStreak < 365">
            <div class="badge-icon">🏆</div>
            <h3>{{ 'streaks.badges.legend' | translate }}</h3>
            <p>{{ 'streaks.badges.legendDesc' | translate }}</p>
            <div class="badge-status" *ngIf="currentStreak >= 365">✅ {{ 'streaks.badges.earned' | translate }}</div>
            <div class="badge-status locked" *ngIf="currentStreak < 365">🔒 {{ currentStreak }}/365 {{ 'streaks.days' | translate }}</div>
          </div>
        </div>
      </div>

      <div class="info-cards">
        <div class="info-card">
          <div class="card-icon">📅</div>
          <h3>{{ 'streaks.info.daily' | translate }}</h3>
          <p>{{ 'streaks.info.dailyDesc' | translate }}</p>
        </div>
        <div class="info-card">
          <div class="card-icon">🏆</div>
          <h3>{{ 'streaks.info.badges' | translate }}</h3>
          <p>{{ 'streaks.info.badgesDesc' | translate }}</p>
        </div>
        <div class="info-card">
          <div class="card-icon">📊</div>
          <h3>{{ 'streaks.info.progress' | translate }}</h3>
          <p>{{ 'streaks.info.progressDesc' | translate }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .streaks-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }
 
    .streaks-header {
      text-align: center;
      margin-bottom: 3.5rem;
      
      h1 {
        font-size: 3rem;
        margin-bottom: 0.5rem;
        font-weight: 800;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
 
    .subtitle {
      font-size: 1.25rem;
      color: var(--color-text-secondary);
    }
 
    .streak-display {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }
 
    .streak-card {
      background: var(--color-card-bg, var(--color-surface));
      backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      border: 1px solid var(--color-card-border, var(--glass-border));
      border-radius: 20px;
      padding: 2.5rem 2rem;
      text-align: center;
      color: var(--color-text);
      box-shadow: var(--glass-shadow);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
        border-color: rgba(var(--color-primary-rgb), 0.25);
      }
      
      h2 {
        font-size: 1.15rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-text-secondary);
        margin-bottom: 0.5rem;
      }
    }
 
    .fire-icon, .trophy-icon, .calendar-icon {
      font-size: 3.5rem;
      margin-bottom: 1.25rem;
      display: inline-block;
      filter: drop-shadow(0 4px 10px rgba(var(--color-primary-rgb), 0.2));
    }
 
    .streak-number {
      font-size: 3.25rem;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
      color: var(--color-primary, #4f46e5);
      margin: 0.75rem 0;
    }
 
    .last-checkin, .subtitle-text {
      font-size: 0.95rem;
      color: var(--color-text-secondary);
      margin: 0;
    }
 
    /* Badges Section */
    .badges-section {
      margin: 4rem 0;
      
      h2 {
        text-align: center;
        font-size: 2.25rem;
        font-weight: 800;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 2.5rem;
      }
    }
 
    .badges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.75rem;
    }
 
    .badge-card {
      background: var(--color-card-bg, var(--color-surface));
      backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      border: 1px solid var(--color-card-border, var(--glass-border));
      border-radius: 18px;
      padding: 2rem 1.5rem;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--glass-shadow);
      display: flex;
      flex-direction: column;
      align-items: center;
      
      h3 {
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0.75rem 0 0.5rem 0;
        color: var(--color-text-primary);
      }
      
      p {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        margin: 0 0 1.25rem 0;
        line-height: 1.5;
        flex-grow: 1;
      }
      
      &:hover:not(.locked) {
        transform: translateY(-4px);
        box-shadow: 0 10px 24px rgba(var(--color-primary-rgb), 0.15);
        border-color: rgba(var(--color-primary-rgb), 0.3);
      }
    }
 
    .badge-card.earned {
      border-color: rgba(16, 185, 129, 0.3);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(var(--color-primary-rgb), 0.04) 100%);
      
      &:hover {
        border-color: rgba(16, 185, 129, 0.5);
        box-shadow: 0 10px 24px rgba(16, 185, 129, 0.15);
      }
      
      .badge-icon {
        animation: badgeBounce 1.2s ease-in-out infinite alternate;
      }
    }
 
    @keyframes badgeBounce {
      from { transform: translateY(0); }
      to { transform: translateY(-6px); }
    }
 
    .badge-card.locked {
      opacity: 0.55;
      filter: grayscale(100%);
      background: rgba(var(--color-primary-rgb, 79, 70, 229), 0.03);
      border-color: var(--color-card-border, rgba(0, 0, 0, 0.05));
    }
 
    .badge-icon {
      font-size: 2.75rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }
 
    .badge-status, .badge-progress {
      font-size: 0.825rem;
      font-weight: 700;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      background: rgba(var(--color-primary-rgb), 0.08);
      color: var(--color-primary);
      border: 1px solid rgba(var(--color-primary-rgb), 0.15);
      width: fit-content;
    }
 
    .badge-status.locked, .badge-progress {
      background: rgba(255, 255, 255, 0.05);
      color: var(--color-text-secondary);
      border-color: var(--glass-border);
    }
 
    .badge-card.earned .badge-status {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border-color: rgba(16, 185, 129, 0.2);
    }
 
    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
 
    .info-card {
      background: var(--color-card-bg, var(--color-surface));
      backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
      border: 1px solid var(--color-card-border, var(--glass-border));
      border-radius: 18px;
      padding: 2.5rem 2rem;
      text-align: center;
      box-shadow: var(--glass-shadow);
      transition: transform 0.3s ease, border-color 0.3s ease;
      
      &:hover {
        transform: translateY(-3px);
        border-color: rgba(var(--color-primary-rgb), 0.2);
      }
      
      h3 {
        font-size: 1.35rem;
        font-weight: 700;
        margin-top: 0.5rem;
        margin-bottom: 0.75rem;
        color: var(--color-text-primary);
      }
      
      p {
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0;
      }
    }
 
    .card-icon {
      font-size: 2.5rem;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--color-primary-rgb), 0.08);
      border-radius: 50%;
      margin: 0 auto 1.25rem auto;
    }
 
    @media (max-width: 768px) {
      .streaks-container {
        padding: 1.5rem 1rem;
      }
 
      .streaks-header h1 {
        font-size: 2.25rem;
      }
 
      .info-cards {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
    }

  `]
})
export class StreaksComponent implements OnInit {
  // Streak data
  currentStreak = 0;
  longestStreak = 0;
  totalDaysLogged = 0;
  lastLogDate: Date | null = null;
  hasCompleteProfile = false;

  constructor(
    private storageService: StorageService,
    private streakCalculator: StreakCalculatorService,
    private toastService: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.calculateStreaks();
    await this.checkProfileCompletion();
  }

  /**
   * Calculate streaks automatically from weight entries
   */
  private async calculateStreaks(): Promise<void> {
    const entries = await this.storageService.getAllEntries();
    const result = this.streakCalculator.calculateStreak(entries);
    
    this.currentStreak = result.currentStreak;
    this.longestStreak = result.longestStreak;
    this.totalDaysLogged = result.totalDaysLogged;
    this.lastLogDate = result.lastLogDate;

    // Debug: Show entry dates
    console.log('📊 Streak Calculation Debug:');
    console.log('Total Entries:', entries.length);
    console.log('All Entry Dates (with duplicates):', entries.map(e => new Date(e.date).toDateString()));
    console.log('Unique Dates:', [...new Set(entries.map(e => new Date(e.date).toDateString()))]);
    console.log('Current Streak:', result.currentStreak);
    console.log('Longest Streak:', result.longestStreak);
    console.log('Total Days Logged:', result.totalDaysLogged);
    console.log('Last Log Date:', result.lastLogDate);
  }

  /**
   * Check if user has completed their profile
   */
  private async checkProfileCompletion(): Promise<void> {
    const profile = await this.storageService.getUserProfile();
    
    if (profile) {
      // Profile is complete if has name, age, and avatar
      this.hasCompleteProfile = !!(
        profile.name && 
        profile.name.trim().length > 0 &&
        profile.age && 
        profile.age > 0
      );
    }
  }
}
