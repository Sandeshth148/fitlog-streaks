import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskFilter } from '../../models/task.model';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container" *ngIf="filter">
      <div class="filter-group">
        <label>Status:</label>
        <select [(ngModel)]="localFilter.status" (change)="onFilterChange()">
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Priority:</label>
        <select [(ngModel)]="localFilter.priority" (change)="onFilterChange()">
          <option [ngValue]="undefined">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Sort By:</label>
        <select [(ngModel)]="localFilter.sortBy" (change)="onFilterChange()">
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Order:</label>
        <select [(ngModel)]="localFilter.sortOrder" (change)="onFilterChange()">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div class="filter-group search-group">
        <label>Search:</label>
        <input 
          type="text" 
          [(ngModel)]="localFilter.searchTerm" 
          (input)="onFilterChange()"
          placeholder="Search tasks...">
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1.5rem;
      background: var(--color-bg-offset, #f8fafc);
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .search-group {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-secondary, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    select, input {
      padding: 0.75rem;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      transition: all 0.2s;
    }

    select:focus, input:focus {
      outline: none;
      border-color: var(--color-primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    @media (max-width: 768px) {
      .filter-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskFilterComponent {
  @Input() set filter(value: TaskFilter | null) {
    if (value) {
      this.localFilter = { ...value };
    }
  }
  @Output() filterChange = new EventEmitter<Partial<TaskFilter>>();

  localFilter: TaskFilter = {
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  onFilterChange(): void {
    this.filterChange.emit(this.localFilter);
  }
}
