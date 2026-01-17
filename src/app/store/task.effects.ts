import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as TaskActions from './task.actions';
import { TaskStorageService } from '../services/task-storage.service';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() =>
        this.taskStorage.getTasks().pipe(
          map(tasks => TaskActions.loadTasksSuccess({ tasks })),
          catchError(error => of(TaskActions.loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      switchMap(({ task }) =>
        this.taskStorage.addTask(task).pipe(
          map(newTask => TaskActions.addTaskSuccess({ task: newTask })),
          catchError(error => of(TaskActions.addTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(({ task }) =>
        this.taskStorage.updateTask(task).pipe(
          map(() => TaskActions.updateTaskSuccess({ task })),
          catchError(error => of(TaskActions.updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      switchMap(({ id }) =>
        this.taskStorage.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError(error => of(TaskActions.deleteTaskFailure({ error: error.message })))
        )
      )
    )
  );

  toggleTaskCompletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.toggleTaskCompletion),
      switchMap(({ id }) =>
        this.taskStorage.toggleTaskCompletion(id).pipe(
          map(task => TaskActions.updateTaskSuccess({ task })),
          catchError(error => of(TaskActions.updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private taskStorage: TaskStorageService
  ) {}
}
