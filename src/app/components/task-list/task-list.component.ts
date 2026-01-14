import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-list">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading tasks...</p>
      </div>

      <div *ngIf="!loading && (!tasks || tasks.length === 0)" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>

      <div *ngIf="!loading && tasks && tasks.length > 0" class="tasks">
        <div 
          *ngFor="let task of tasks" 
          class="task-item"
          [class.completed]="task.completed"
          [class.high-priority]="task.priority === 'high'"
          [class.overdue]="isOverdue(task)">
          
          <div class="task-checkbox">
            <input 
              type="checkbox" 
              [checked]="task.completed"
              (change)="toggleComplete.emit(task.id)">
          </div>

          <div class="task-content">
            <h4 class="task-title">{{ task.title }}</h4>
            <p class="task-description" *ngIf="task.description">
              {{ task.description }}
            </p>
            <div class="task-meta">
              <span class="priority-badge" [class]="'priority-' + task.priority">
                {{ task.priority }}
              </span>
              <span class="due-date" *ngIf="task.dueDate">
                📅 {{ formatDate(task.dueDate) }}
              </span>
              <span class="tags" *ngIf="task.tags && task.tags.length > 0">
                <span *ngFor="let tag of task.tags" class="tag">{{ tag }}</span>
              </span>
            </div>
          </div>

          <div class="task-actions">
            <button 
              class="btn-icon" 
              (click)="edit.emit(task)"
              title="Edit task">
              ✏️
            </button>
            <button 
              class="btn-icon btn-delete" 
              (click)="delete.emit(task.id)"
              title="Delete task">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-list {
      min-height: 300px;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: var(--color-text-secondary, #64748b);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--color-border, #e2e8f0);
      border-top-color: var(--color-primary, #3b82f6);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      color: var(--color-text-secondary, #64748b);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text-primary, #1f2937);
    }

    .tasks {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .task-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .task-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .task-item.completed {
      opacity: 0.6;
    }

    .task-item.completed .task-title {
      text-decoration: line-through;
    }

    .task-item.high-priority {
      border-left: 4px solid #ef4444;
    }

    .task-item.overdue {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .task-checkbox {
      display: flex;
      align-items: flex-start;
      padding-top: 0.25rem;
    }

    .task-checkbox input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .task-content {
      flex: 1;
    }

    .task-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary, #1f2937);
    }

    .task-description {
      margin: 0 0 0.75rem 0;
      color: var(--color-text-secondary, #64748b);
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

    .due-date {
      font-size: 0.875rem;
      color: var(--color-text-secondary, #64748b);
    }

    .tags {
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
    }

    .tag {
      padding: 0.25rem 0.5rem;
      background: var(--color-bg-offset, #f8fafc);
      border-radius: 6px;
      font-size: 0.75rem;
      color: var(--color-text-secondary, #64748b);
    }

    .task-actions {
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
      background: var(--color-bg-offset, #f8fafc);
    }

    .btn-delete:hover {
      background: #fee2e2;
    }

    @media (max-width: 768px) {
      .task-item {
        flex-direction: column;
      }

      .task-actions {
        justify-content: flex-end;
      }
    }
  `]
})
export class TaskListComponent {
  @Input() tasks: Task[] | null = [];
  @Input() loading: boolean | null = false;
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
