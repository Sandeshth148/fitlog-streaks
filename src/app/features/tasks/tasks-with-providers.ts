import { importProvidersFrom } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TasksComponent } from './tasks.component';
import { taskReducer } from '../../store/task.reducer';
import { TaskEffects } from '../../store/task.effects';

export const TasksComponentWithProviders = TasksComponent;

export const tasksProviders = [
  provideStore({ tasks: taskReducer }),
  provideEffects([TaskEffects]),
  provideStoreDevtools({ maxAge: 25 })
];
