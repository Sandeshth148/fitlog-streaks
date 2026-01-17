import { createAction, props } from '@ngrx/store';
import { Task, TaskFilter } from '../models/task.model';

// Load Tasks
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Task] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadTasksFailure = createAction(
  '[Task] Load Tasks Failure',
  props<{ error: string }>()
);

// Add Task
export const addTask = createAction(
  '[Task] Add Task',
  props<{ task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }>()
);
export const addTaskSuccess = createAction(
  '[Task] Add Task Success',
  props<{ task: Task }>()
);
export const addTaskFailure = createAction(
  '[Task] Add Task Failure',
  props<{ error: string }>()
);

// Update Task
export const updateTask = createAction(
  '[Task] Update Task',
  props<{ task: Task }>()
);
export const updateTaskSuccess = createAction(
  '[Task] Update Task Success',
  props<{ task: Task }>()
);
export const updateTaskFailure = createAction(
  '[Task] Update Task Failure',
  props<{ error: string }>()
);

// Delete Task
export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: string }>()
);
export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ id: string }>()
);
export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: string }>()
);

// Toggle Task Completion
export const toggleTaskCompletion = createAction(
  '[Task] Toggle Task Completion',
  props<{ id: string }>()
);

// Filter Tasks
export const setFilter = createAction(
  '[Task] Set Filter',
  props<{ filter: Partial<TaskFilter> }>()
);

// Select Task
export const selectTask = createAction(
  '[Task] Select Task',
  props<{ id: string | null }>()
);
