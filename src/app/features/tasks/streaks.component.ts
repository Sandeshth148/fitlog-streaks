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
      padding: 2rem;
    }

    .streaks-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .streaks-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary);
    }

    .subtitle {
      font-size: 1.1rem;
      color: var(--color-text-secondary);
    }

    .streak-display {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .streak-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }

    .streak-card:hover {
      transform: translateY(-4px);
    }

    .fire-icon, .trophy-icon, .freeze-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    .streak-card h2 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      opacity: 0.9;
    }

    .streak-number {
      font-size: 3rem;
      font-weight: bold;
      margin: 1rem 0;
    }

    .last-checkin, .subtitle-text {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .streak-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .action-btn.secondary {
      background: var(--color-surface);
      color: var(--color-text-primary);
      border: 2px solid #667eea;
    }

    .action-btn.secondary:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .calendar-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: pulse 2s ease-in-out infinite;
    }

    /* Badges Section */
    .badges-section {
      margin: 3rem 0;
    }

    .badges-section h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 2rem;
      color: var(--color-text-primary);
    }

    .badges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .badge-card {
      background: var(--color-surface);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s;
      border: 2px solid transparent;
    }

    .badge-card.earned {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .badge-card.earned .badge-icon {
      animation: bounce 1s ease-in-out;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .badge-card.locked {
      opacity: 0.5;
      filter: grayscale(100%);
    }

    .badge-card:hover:not(.locked) {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .badge-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .badge-card h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .badge-card p {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 0.5rem;
    }

    .badge-card.earned p {
      opacity: 0.9;
    }

    .badge-status {
      font-weight: 600;
      margin-top: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.2);
    }

    .badge-status.locked {
      background: rgba(0, 0, 0, 0.1);
      color: var(--color-text-secondary);
    }

    .loading-state {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
      color: #667eea;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .info-card {
      background: var(--color-surface);
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .info-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .info-card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary);
    }

    .info-card p {
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .streaks-container {
        padding: 1rem;
      }

      .streaks-header h1 {
        font-size: 2rem;
      }

      .mfe-placeholder {
        padding: 3rem 1.5rem;
      }

      .fire-icon {
        font-size: 4rem;
      }

      .placeholder-content h2 {
        font-size: 1.5rem;
      }

      .info-cards {
        grid-template-columns: 1fr;
        gap: 1rem;
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
