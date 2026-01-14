import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task, TaskFilter } from '../../models/task.model';
import * as TaskActions from '../../store/task.actions';
import * as TaskSelectors from '../../store/task.selectors';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskStatsComponent } from '../task-stats/task-stats.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-task-tracker',
  standalone: true,
  imports: [
    CommonModule,
    TaskListComponent,
    TaskFormComponent,
    TaskStatsComponent,
    TaskFilterComponent
  ],
  template: `
    <div class="task-tracker">
      <header class="task-header">
        <h1>✅ Task Tracker</h1>
        <p class="subtitle">Manage your tasks efficiently</p>
      </header>

      <app-task-stats [stats]="stats$ | async"></app-task-stats>

      <div class="task-actions">
        <button class="btn-primary" (click)="showAddForm = !showAddForm">
          {{ showAddForm ? '✕ Cancel' : '+ Add Task' }}
        </button>
      </div>

      <app-task-form
        *ngIf="showAddForm"
        [task]="selectedTask$ | async"
        (save)="onSaveTask($event)"
        (cancel)="onCancelForm()">
      </app-task-form>

      <app-task-filter
        [filter]="filter$ | async"
        (filterChange)="onFilterChange($event)">
      </app-task-filter>

      <app-task-list
        [tasks]="filteredTasks$ | async"
        [loading]="loading$ | async"
        (toggleComplete)="onToggleComplete($event)"
        (edit)="onEditTask($event)"
        (delete)="onDeleteTask($event)">
      </app-task-list>
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
      color: var(--color-text-primary, #1f2937);
    }

    .subtitle {
      color: var(--color-text-secondary, #64748b);
      font-size: 1.1rem;
      margin: 0;
    }

    .task-actions {
      display: flex;
      justify-content: center;
      margin: 2rem 0;
    }

    .btn-primary {
      background: var(--color-primary, #3b82f6);
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
      background: var(--color-primary-dark, #2563eb);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    @media (max-width: 768px) {
      .task-tracker {
        padding: 1rem;
      }

      .task-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class TaskTrackerComponent implements OnInit {
  tasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;
  filter$: Observable<TaskFilter>;
  loading$: Observable<boolean>;
  selectedTask$: Observable<Task | null>;
  stats$: Observable<any>;
  showAddForm = false;

  constructor(private store: Store) {
    this.tasks$ = this.store.select(TaskSelectors.selectAllTasks);
    this.filteredTasks$ = this.store.select(TaskSelectors.selectFilteredTasks);
    this.filter$ = this.store.select(TaskSelectors.selectTaskFilter);
    this.loading$ = this.store.select(TaskSelectors.selectLoading);
    this.selectedTask$ = this.store.select(TaskSelectors.selectSelectedTask);
    this.stats$ = this.store.select(TaskSelectors.selectTaskStats);
  }

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
  }

  onSaveTask(task: Partial<Task>): void {
    if (task.id) {
      this.store.dispatch(TaskActions.updateTask({ task: task as Task }));
    } else {
      this.store.dispatch(TaskActions.addTask({ 
        task: task as Omit<Task, 'id' | 'createdAt' | 'updatedAt'> 
      }));
    }
    this.showAddForm = false;
    this.store.dispatch(TaskActions.selectTask({ id: null }));
  }

  onCancelForm(): void {
    this.showAddForm = false;
    this.store.dispatch(TaskActions.selectTask({ id: null }));
  }

  onToggleComplete(id: string): void {
    this.store.dispatch(TaskActions.toggleTaskCompletion({ id }));
  }

  onEditTask(task: Task): void {
    this.store.dispatch(TaskActions.selectTask({ id: task.id }));
    this.showAddForm = true;
  }

  onDeleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TaskActions.deleteTask({ id }));
    }
  }

  onFilterChange(filter: Partial<TaskFilter>): void {
    this.store.dispatch(TaskActions.setFilter({ filter }));
  }
}
