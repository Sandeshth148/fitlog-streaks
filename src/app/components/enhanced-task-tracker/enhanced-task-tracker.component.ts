import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { Task } from '../../models/task.model';
import * as TaskActions from '../../store/task.actions';
import * as TaskSelectors from '../../store/task.selectors';

@Component({
  selector: 'app-enhanced-task-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-tracker">
      <header class="task-header">
        <h1>✅ Task Tracker Pro</h1>
        <p class="subtitle">Manage your tasks with recurring schedules</p>
      </header>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ activeTasks.length }}</div>
            <div class="stat-label">Active Tasks</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ completedToday }}</div>
            <div class="stat-label">Completed Today</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔁</div>
          <div class="stat-content">
            <div class="stat-value">{{ recurringTasks.length }}</div>
            <div class="stat-label">Recurring</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-value">{{ archivedTasks.length }}</div>
            <div class="stat-label">Archived</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="task-actions">
        <button class="btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? '✕ Cancel' : '+ Add Task' }}
        </button>
        <button class="btn-secondary" (click)="showArchived = !showArchived">
          {{ showArchived ? '📋 Show Active' : '📦 Show Archived' }}
        </button>
        <button 
          class="btn-notification" 
          [class.enabled]="notificationsEnabled"
          (click)="enableNotifications()"
          *ngIf="!notificationsEnabled"
          title="Enable browser notifications">
          🔔 Enable Notifications
        </button>
        <span class="notification-status" *ngIf="notificationsEnabled">
          ✅ Notifications On
        </span>
      </div>

      <!-- Task Form -->
      <div class="task-form" *ngIf="showAddForm">
        <h3>{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h3>
        <form (ngSubmit)="saveTask()">
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              id="title"
              type="text" 
              [(ngModel)]="formData.title" 
              name="title"
              placeholder="e.g., Drink water, Visit temple"
              required>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              [(ngModel)]="formData.description" 
              name="description"
              rows="3"
              placeholder="Add details about this task"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" [(ngModel)]="formData.priority" name="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div class="form-group">
              <label for="recurrence">Recurrence</label>
              <select id="recurrence" [(ngModel)]="formData.recurrence" name="recurrence">
                <option value="none">None (One-time)</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div class="form-group" *ngIf="formData.recurrence === 'none'">
            <label for="dueDate">Due Date</label>
            <input 
              id="dueDate"
              type="date" 
              [(ngModel)]="formData.dueDate" 
              name="dueDate">
          </div>

          <div class="recurrence-info" *ngIf="formData.recurrence !== 'none'">
            <div class="info-box">
              <span class="info-icon">ℹ️</span>
              <span>This task will repeat {{ formData.recurrence }}. Complete it to track your progress!</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="cancelForm()">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ editingTask ? 'Update' : 'Add' }} Task
            </button>
          </div>
        </form>
      </div>

      <!-- Filter & Search -->
      <div class="filter-container">
        <select [(ngModel)]="filterStatus" (change)="applyFilter()">
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select [(ngModel)]="filterPriority" (change)="applyFilter()">
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select [(ngModel)]="filterRecurrence" (change)="applyFilter()">
          <option value="">All Types</option>
          <option value="none">One-time</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="applyFilter()"
          placeholder="Search tasks...">
      </div>

      <!-- Pagination Info -->
      <div class="pagination-info" *ngIf="filteredTasks.length > pageSize">
        <span>Showing {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredTasks.length) }} of {{ filteredTasks.length }} tasks</span>
      </div>

      <!-- Task List -->
      <div class="task-list">
        <div *ngIf="paginatedTasks.length === 0" class="empty-state">
          <div class="empty-icon">{{ showArchived ? '📦' : '📝' }}</div>
          <h3>{{ showArchived ? 'No archived tasks' : 'No tasks found' }}</h3>
          <p>{{ showArchived ? 'Completed tasks will appear here when archived' : 'Create your first task to get started!' }}</p>
        </div>

        <div 
          *ngFor="let task of paginatedTasks" 
          class="task-item"
          [class.completed]="task.completed"
          [class.high-priority]="task.priority === 'high'"
          [class.recurring]="task.recurrence !== 'none'"
          [class.archived]="task.archived">
          
          <div class="task-checkbox">
            <input 
              type="checkbox" 
              [checked]="task.completed"
              (change)="toggleComplete(task.id)"
              [disabled]="task.archived">
          </div>

          <div class="task-content">
            <div class="task-title-row">
              <h4 class="task-title">{{ task.title }}</h4>
              <span class="recurrence-badge" *ngIf="task.recurrence !== 'none'">
                🔁 {{ task.recurrence }}
              </span>
            </div>
            <p class="task-description" *ngIf="task.description">
              {{ task.description }}
            </p>
            <div class="task-meta">
              <span class="priority-badge" [class]="'priority-' + task.priority">
                {{ task.priority }}
              </span>
              <span class="due-date" *ngIf="task.dueDate && task.recurrence === 'none'">
                📅 {{ formatDate(task.dueDate) }}
              </span>
              <span class="next-due" *ngIf="task.nextDueDate && task.recurrence !== 'none'">
                ⏰ Next: {{ formatDate(task.nextDueDate) }}
              </span>
              <span class="completion-count" *ngIf="task.completionCount > 0">
                ✓ Completed {{ task.completionCount }}x
              </span>
              <span class="last-completed" *ngIf="task.lastCompleted">
                Last: {{ formatDate(task.lastCompleted) }}
              </span>
            </div>
          </div>

          <div class="task-actions-btns">
            <button 
              class="btn-icon" 
              (click)="editTask(task)"
              *ngIf="!task.archived"
              title="Edit task">
              ✏️
            </button>
            <button 
              class="btn-icon btn-archive" 
              (click)="archiveTask(task.id)"
              *ngIf="!task.archived && task.recurrence === 'none'"
              title="Archive task">
              📦
            </button>
            <button 
              class="btn-icon btn-unarchive" 
              (click)="unarchiveTask(task.id)"
              *ngIf="task.archived"
              title="Unarchive task">
              📤
            </button>
            <button 
              class="btn-icon btn-delete" 
              (click)="deleteTask(task.id)"
              title="Delete task">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button 
          class="btn-page" 
          (click)="goToPage(currentPage - 1)"
          [disabled]="currentPage === 1">
          ← Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          class="btn-page" 
          (click)="goToPage(currentPage + 1)"
          [disabled]="currentPage === totalPages">
          Next →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task-tracker {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .task-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .task-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #1f2937;
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 400;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.875rem;
      transition: all 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #3b82f6;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .task-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.625rem 1.5rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .btn-secondary {
      background: white;
      color: #1f2937;
      border: 1.5px solid #e2e8f0;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .btn-notification {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-notification:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    .notification-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #dcfce7;
      color: #166534;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .task-form {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .task-form h3 {
      margin: 0 0 1.5rem 0;
      color: #1f2937;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #64748b;
      font-size: 0.875rem;
    }

    input, textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      font-family: inherit;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .recurrence-info {
      margin-bottom: 1.5rem;
    }

    .info-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      color: #1e40af;
      font-size: 0.875rem;
    }

    .info-icon {
      font-size: 1.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .filter-container {
      display: grid;
      grid-template-columns: auto auto auto 1fr;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .pagination-info {
      text-align: center;
      color: #64748b;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #64748b;
      background: white;
      border-radius: 12px;
      border: 2px dashed #e2e8f0;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .task-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .task-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .task-item.completed {
      opacity: 0.7;
      background: #f8fafc;
    }

    .task-item.completed .task-title {
      text-decoration: line-through;
      color: #94a3b8;
    }

    .task-item.high-priority {
      border-left: 4px solid #ef4444;
    }

    .task-item.recurring {
      border-left: 4px solid #8b5cf6;
    }

    .task-item.archived {
      background: #fafafa;
      border-color: #d1d5db;
    }

    .task-checkbox input {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #667eea;
    }

    .task-content {
      flex: 1;
    }

    .task-title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .task-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .recurrence-badge {
      padding: 0.25rem 0.75rem;
      background: #f3e8ff;
      color: #7c3aed;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .task-description {
      margin: 0 0 0.75rem 0;
      color: #64748b;
      line-height: 1.5;
    }

    .task-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }

    .priority-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .priority-high {
      background: #fee2e2;
      color: #991b1b;
    }

    .priority-medium {
      background: #fef3c7;
      color: #92400e;
    }

    .priority-low {
      background: #dbeafe;
      color: #1e40af;
    }

    .due-date, .next-due, .completion-count, .last-completed {
      font-size: 0.875rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .completion-count {
      background: #dcfce7;
      color: #166534;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .task-actions-btns {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #f8fafc;
    }

    .btn-archive:hover {
      background: #fef3c7;
    }

    .btn-unarchive:hover {
      background: #dbeafe;
    }

    .btn-delete:hover {
      background: #fee2e2;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .btn-page {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
      color: #1f2937;
    }

    .btn-page:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .btn-page:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: #64748b;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .task-tracker {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .filter-container {
        grid-template-columns: 1fr;
      }

      .task-actions {
        flex-direction: column;
      }

      .task-item {
        flex-direction: column;
      }

      .task-actions-btns {
        justify-content: flex-end;
      }
    }
  `]
})
export class EnhancedTaskTrackerComponent implements OnInit, OnDestroy {
  private worker?: Worker;
  private checkInterval?: number;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  paginatedTasks: Task[] = [];
  showAddForm = false;
  showArchived = false;
  editingTask: Task | null = null;
  
  formData = {
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    recurrence: 'none' as 'none' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly',
    dueDate: ''
  };

  filterStatus = 'all';
  filterPriority = '';
  filterRecurrence = '';
  searchTerm = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  Math = Math;
  notificationsEnabled = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadTasks();
    this.checkRecurringTasks();
    this.applyFilter();
    this.initializeWorker();
    this.checkNotificationPermission();
    
    // Fallback: Check recurring tasks every minute if worker fails
    this.checkInterval = window.setInterval(() => this.checkRecurringTasks(), 60000);
  }

  get activeTasks() {
    return this.tasks.filter(t => !t.completed && !t.archived);
  }

  get completedToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.tasks.filter(t => {
      if (!t.lastCompleted) return false;
      const completedDate = new Date(t.lastCompleted);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;
  }

  get recurringTasks() {
    return this.tasks.filter(t => t.recurrence !== 'none' && !t.archived);
  }

  get archivedTasks() {
    return this.tasks.filter(t => t.archived);
  }

  loadTasks() {
    const stored = localStorage.getItem('fitlog-tasks-enhanced');
    if (stored) {
      this.tasks = JSON.parse(stored);
    }
  }

  saveTasks() {
    localStorage.setItem('fitlog-tasks-enhanced', JSON.stringify(this.tasks));
  }

  checkRecurringTasks() {
    const now = new Date();
    let updated = false;

    this.tasks.forEach(task => {
      if (task.recurrence === 'none' || task.archived) return;

      if (!task.nextDueDate) {
        task.nextDueDate = this.calculateNextDueDate(task.recurrence, now);
        updated = true;
      }

      // Reset completed status if next due date has passed
      if (task.completed && task.nextDueDate) {
        const nextDue = new Date(task.nextDueDate);
        if (now >= nextDue) {
          task.completed = false;
          task.nextDueDate = this.calculateNextDueDate(task.recurrence, now);
          updated = true;
        }
      }
    });

    if (updated) {
      this.saveTasks();
      this.applyFilter();
    }
  }

  calculateNextDueDate(recurrence: string, from: Date): Date {
    const next = new Date(from);
    
    switch (recurrence) {
      case 'hourly':
        next.setHours(next.getHours() + 1);
        break;
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    
    return next;
  }

  saveTask() {
    if (!this.formData.title.trim()) return;

    if (this.editingTask) {
      const index = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (index !== -1) {
        this.tasks[index] = {
          ...this.editingTask,
          title: this.formData.title,
          description: this.formData.description,
          priority: this.formData.priority,
          recurrence: this.formData.recurrence,
          dueDate: this.formData.dueDate ? new Date(this.formData.dueDate) : undefined,
          nextDueDate: this.formData.recurrence !== 'none' 
            ? this.calculateNextDueDate(this.formData.recurrence, new Date())
            : undefined
        };
      }
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: this.formData.title,
        description: this.formData.description,
        completed: false,
        priority: this.formData.priority,
        recurrence: this.formData.recurrence,
        dueDate: this.formData.dueDate ? new Date(this.formData.dueDate) : undefined,
        createdAt: new Date(),
        completionCount: 0,
        archived: false,
        nextDueDate: this.formData.recurrence !== 'none' 
          ? this.calculateNextDueDate(this.formData.recurrence, new Date())
          : undefined
      };
      this.tasks.unshift(newTask);
    }

    this.saveTasks();
    this.applyFilter();
    
    // Show notification when task is created
    if (this.notificationsEnabled && !this.editingTask) {
      const recurrenceText = this.formData.recurrence === 'none' ? 'one-time task' : `${this.formData.recurrence} recurring task`;
      this.notificationService.showNotification('Task Created! ✅', {
        body: `${this.formData.title} (${recurrenceText})`,
        tag: 'task-created',
        requireInteraction: false
      });
    }
    
    this.cancelForm();
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.formData = {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      recurrence: task.recurrence,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    };
    this.showAddForm = true;
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveTasks();
      this.applyFilter();
    }
  }

  toggleComplete(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (task && !task.archived) {
      task.completed = !task.completed;
      
      if (task.completed) {
        task.lastCompleted = new Date();
        task.completionCount = (task.completionCount || 0) + 1;
        
        // For recurring tasks, calculate next due date
        if (task.recurrence !== 'none') {
          task.nextDueDate = this.calculateNextDueDate(task.recurrence, new Date());
        }
      }
      
      this.saveTasks();
      this.applyFilter();
    }
  }

  archiveTask(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.archived = true;
      this.saveTasks();
      this.applyFilter();
    }
  }

  unarchiveTask(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.archived = false;
      this.saveTasks();
      this.applyFilter();
    }
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingTask = null;
    this.formData = {
      title: '',
      description: '',
      priority: 'medium',
      recurrence: 'none',
      dueDate: ''
    };
  }

  applyFilter() {
    let filtered = [...this.tasks];

    // Filter by archived status
    filtered = filtered.filter(t => this.showArchived ? t.archived : !t.archived);

    // Filter by status
    if (this.filterStatus === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (this.filterStatus === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    // Filter by priority
    if (this.filterPriority) {
      filtered = filtered.filter(t => t.priority === this.filterPriority);
    }

    // Filter by recurrence
    if (this.filterRecurrence) {
      filtered = filtered.filter(t => t.recurrence === this.filterRecurrence);
    }

    // Search
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search)
      );
    }

    this.filteredTasks = filtered;
    this.totalPages = Math.ceil(this.filteredTasks.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTasks = this.filteredTasks.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  async checkNotificationPermission() {
    this.notificationsEnabled = this.notificationService.hasPermission();
  }

  async enableNotifications() {
    const granted = await this.notificationService.requestPermission();
    this.notificationsEnabled = granted;
    if (granted) {
      await this.notificationService.showNotification('Notifications Enabled! 🔔', {
        body: 'You will now receive task reminders. If you don\'t see this notification, check Windows Settings → System → Notifications → Google Chrome and enable "Show notification banners".'
      });
    } else {
      alert('Notifications blocked! Please enable notifications in your browser settings.\n\nChrome: Settings → Privacy and security → Site Settings → Notifications\nWindows: Settings → System → Notifications → Google Chrome → Enable');
    }
  }

  initializeWorker() {
    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(new URL('../../workers/task-checker.worker', import.meta.url), { type: 'module' });
        
        this.worker.onmessage = ({ data }) => {
          if (data.type === 'RESET_TASKS') {
            this.handleTaskResets(data.taskIds);
          }
        };

        // Send tasks to worker every minute
        setInterval(() => {
          if (this.worker) {
            this.worker.postMessage({ type: 'CHECK_TASKS', tasks: this.tasks });
          }
        }, 60000);
      } catch (error) {
        console.log('Web Worker not available, using fallback timer');
      }
    }
  }

  handleTaskResets(taskIds: string[]) {
    taskIds.forEach(id => {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.completed = false;
        task.nextDueDate = this.calculateNextDueDate(task.recurrence, new Date());
        
        // Send browser notification
        if (this.notificationsEnabled) {
          this.notificationService.notifyTaskReset(task.title);
        }
      }
    });
    
    this.saveTasks();
    this.applyFilter();
  }

  ngOnDestroy() {
    if (this.worker) {
      this.worker.terminate();
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}
