import { Task, TaskFilter } from '../models/task.model';

export interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
}

export const initialState: TaskState = {
  tasks: [],
  filter: {
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  loading: false,
  error: null,
  selectedTaskId: null
};
