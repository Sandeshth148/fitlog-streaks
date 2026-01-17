import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.state';
import { Task } from '../models/task.model';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

export const selectTaskFilter = createSelector(
  selectTaskState,
  (state: TaskState) => state.filter
);

export const selectLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.loading
);

export const selectError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
);

export const selectSelectedTaskId = createSelector(
  selectTaskState,
  (state: TaskState) => state.selectedTaskId
);

export const selectSelectedTask = createSelector(
  selectAllTasks,
  selectSelectedTaskId,
  (tasks: Task[], selectedId: string | null) =>
    tasks.find(task => task.id === selectedId) || null
);

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTaskFilter,
  (tasks: Task[], filter) => {
    let filtered = [...tasks];

    // Filter by status
    if (filter.status === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter.status === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Filter by priority
    if (filter.priority) {
      filtered = filtered.filter(task => task.priority === filter.priority);
    }

    // Filter by search term
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filter.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return filter.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }
);

export const selectTaskStats = createSelector(
  selectAllTasks,
  (tasks: Task[]) => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length,
    overdue: tasks.filter(t => 
      t.dueDate && 
      !t.completed && 
      new Date(t.dueDate) < new Date()
    ).length
  })
);
