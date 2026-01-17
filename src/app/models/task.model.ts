export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  recurrence: 'none' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastCompleted?: Date;
  completionCount: number;
  archived: boolean;
  nextDueDate?: Date;
}

export interface TaskFilter {
  status: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  searchTerm?: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}
