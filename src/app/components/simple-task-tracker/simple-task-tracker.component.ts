import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  recurrence?: 'none' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastCompleted?: Date;
  completionCount?: number;
  archived?: boolean;
  nextDueDate?: Date;
}

@Component({
  selector: 'app-simple-task-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-tracker">
      <header class="task-header">
        <h1>✅ Task Tracker</h1>
        <p class="subtitle">Manage your tasks efficiently</p>
      </header>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ tasks.length }}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ completedTasks.length }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <div class="stat-value">{{ activeTasks.length }}</div>
            <div class="stat-label">Active</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <div class="stat-value">{{ highPriorityTasks.length }}</div>
            <div class="stat-label">High Priority</div>
          </div>
        </div>
      </div>

      <!-- Add Task Button -->
      <div class="task-actions">
        <button class="btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? '✕ Cancel' : '+ Add Task' }}
        </button>
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

      <!-- Filter -->
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
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="applyFilter()"
          placeholder="Search tasks...">
      </div>

      <!-- Task List -->
      <div class="task-list">
        <div *ngIf="filteredTasks.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>

        <div 
          *ngFor="let task of filteredTasks" 
          class="task-item"
          [class.completed]="task.completed"
          [class.high-priority]="task.priority === 'high'">
          
          <div class="task-checkbox">
            <input 
              type="checkbox" 
              [checked]="task.completed"
              (change)="toggleComplete(task.id)">
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
            </div>
          </div>

          <div class="task-actions-btns">
            <button 
              class="btn-icon" 
              (click)="editTask(task)"
              title="Edit task">
              ✏️
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
    </div>
  `,
  styles: [`
    .task-tracker {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .task-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .task-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #1f2937;
    }

    .subtitle {
      color: #64748b;
      font-size: 1.1rem;
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
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #3b82f6;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      text-transform: uppercase;
    }

    .task-actions {
      display: flex;
      justify-content: center;
      margin: 2rem 0;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .task-form {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
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
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-secondary {
      background: #f8fafc;
      color: #1f2937;
      border: 1px solid #e2e8f0;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
    }

    .filter-container {
      display: grid;
      grid-template-columns: auto auto 1fr;
      gap: 1rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #64748b;
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

    .task-checkbox input {
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
      color: #1f2937;
    }

    .task-description {
      margin: 0 0 0.75rem 0;
      color: #64748b;
    }

    .task-meta {
      display: flex;
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
      color: #64748b;
    }

    .task-actions-btns {
      display: flex;
      gap: 0.5rem;
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

    .btn-delete:hover {
      background: #fee2e2;
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
    }
  `]
})
export class SimpleTaskTrackerComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showAddForm = false;
  editingTask: Task | null = null;
  
  formData = {
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  };

  filterStatus = 'all';
  filterPriority = '';
  searchTerm = '';

  ngOnInit() {
    this.loadTasks();
    this.applyFilter();
  }

  get completedTasks() {
    return this.tasks.filter(t => t.completed);
  }

  get activeTasks() {
    return this.tasks.filter(t => !t.completed);
  }

  get highPriorityTasks() {
    return this.tasks.filter(t => t.priority === 'high' && !t.completed);
  }

  loadTasks() {
    const stored = localStorage.getItem('fitlog-tasks');
    if (stored) {
      this.tasks = JSON.parse(stored);
    }
  }

  saveTasks() {
    localStorage.setItem('fitlog-tasks', JSON.stringify(this.tasks));
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
          dueDate: this.formData.dueDate ? new Date(this.formData.dueDate) : undefined
        };
      }
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: this.formData.title,
        description: this.formData.description,
        completed: false,
        priority: this.formData.priority,
        dueDate: this.formData.dueDate ? new Date(this.formData.dueDate) : undefined,
        createdAt: new Date()
      };
      this.tasks.unshift(newTask);
    }

    this.saveTasks();
    this.applyFilter();
    this.cancelForm();
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.formData = {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
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
    if (task) {
      task.completed = !task.completed;
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
      dueDate: ''
    };
  }

  applyFilter() {
    let filtered = [...this.tasks];

    if (this.filterStatus === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (this.filterStatus === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    if (this.filterPriority) {
      filtered = filtered.filter(t => t.priority === this.filterPriority);
    }

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search)
      );
    }

    this.filteredTasks = filtered;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
