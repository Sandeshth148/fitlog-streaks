/// <reference lib="webworker" />

interface Task {
  id: string;
  title: string;
  completed: boolean;
  recurrence: 'none' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate?: Date;
  archived: boolean;
}

addEventListener('message', ({ data }) => {
  if (data.type === 'CHECK_TASKS') {
    const tasks: Task[] = data.tasks;
    const now = new Date();
    const tasksToReset: string[] = [];

    tasks.forEach(task => {
      if (task.recurrence === 'none' || task.archived) return;
      
      if (task.completed && task.nextDueDate) {
        const nextDue = new Date(task.nextDueDate);
        if (now >= nextDue) {
          tasksToReset.push(task.id);
        }
      }
    });

    if (tasksToReset.length > 0) {
      postMessage({ type: 'RESET_TASKS', taskIds: tasksToReset });
    }
  }
});
