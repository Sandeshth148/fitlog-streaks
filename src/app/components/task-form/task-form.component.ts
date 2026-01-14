import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <h3>{{ task?.id ? 'Edit Task' : 'Add New Task' }}</h3>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title *</label>
          <input 
            id="title"
            type="text" 
            [(ngModel)]="formData.title" 
            name="title"
            placeholder="Enter task title"
            required>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            [(ngModel)]="formData.description" 
            name="description"
            rows="3"
            placeholder="Enter task description"></textarea>
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
            <label for="dueDate">Due Date</label>
            <input 
              id="dueDate"
              type="date" 
              [(ngModel)]="formData.dueDate" 
              name="dueDate">
          </div>
        </div>

        <div class="form-group">
          <label for="tags">Tags (comma-separated)</label>
          <input 
            id="tags"
            type="text" 
            [(ngModel)]="tagsString" 
            name="tags"
            placeholder="work, personal, urgent">
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="onCancel()">
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            {{ task?.id ? 'Update' : 'Add' }} Task
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      background: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    h3 {
      margin: 0 0 1.5rem 0;
      color: var(--color-text-primary, #1f2937);
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
      color: var(--color-text-secondary, #64748b);
      font-size: 0.875rem;
    }

    input, textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--color-primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--color-primary, #3b82f6);
      color: white;
    }

    .btn-primary:hover {
      background: var(--color-primary-dark, #2563eb);
    }

    .btn-secondary {
      background: var(--color-bg-offset, #f8fafc);
      color: var(--color-text-primary, #1f2937);
      border: 1px solid var(--color-border, #e2e8f0);
    }

    .btn-secondary:hover {
      background: var(--color-border, #e2e8f0);
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();

  formData: any = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    completed: false
  };

  tagsString = '';

  ngOnInit(): void {
    if (this.task) {
      this.formData = {
        id: this.task.id,
        title: this.task.title,
        description: this.task.description || '',
        priority: this.task.priority,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : '',
        completed: this.task.completed,
        createdAt: this.task.createdAt,
        updatedAt: this.task.updatedAt
      };
      this.tagsString = this.task.tags?.join(', ') || '';
    }
  }

  onSubmit(): void {
    const taskData: any = {
      ...this.formData,
      tags: this.tagsString ? this.tagsString.split(',').map(t => t.trim()).filter(t => t) : []
    };

    if (taskData.dueDate) {
      taskData.dueDate = new Date(taskData.dueDate);
    }

    this.save.emit(taskData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
