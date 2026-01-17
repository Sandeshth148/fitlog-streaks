import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { taskReducer } from './store/task.reducer';
import { TaskEffects } from './store/task.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ tasks: taskReducer }),
    provideEffects([TaskEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
