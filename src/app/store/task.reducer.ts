import { createReducer, on } from '@ngrx/store';
import { TaskState, initialState } from './task.state';
import * as TaskActions from './task.actions';

export const taskReducer = createReducer(
  initialState,
  
  // Load Tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
    error: null
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add Task
  on(TaskActions.addTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    loading: false,
    error: null
  })),
  on(TaskActions.addTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Task
  on(TaskActions.updateTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    loading: false,
    error: null
  })),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Task
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    loading: false,
    error: null,
    selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId
  })),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Toggle Task Completion
  on(TaskActions.toggleTaskCompletion, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    )
  })),
  
  // Filter Tasks
  on(TaskActions.setFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter }
  })),
  
  // Select Task
  on(TaskActions.selectTask, (state, { id }) => ({
    ...state,
    selectedTaskId: id
  }))
);
