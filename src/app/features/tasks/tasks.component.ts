import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EnhancedTaskTrackerComponent } from '../../components/enhanced-task-tracker/enhanced-task-tracker.component';
import { taskReducer } from '../../store/task.reducer';
import { TaskEffects } from '../../store/task.effects';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, EnhancedTaskTrackerComponent],
  providers: [
    importProvidersFrom(
      StoreModule.forRoot({ tasks: taskReducer }),
      EffectsModule.forRoot([TaskEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25 })
    )
  ],
  template: `<app-enhanced-task-tracker></app-enhanced-task-tracker>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class TasksComponent implements OnInit {
  
  ngOnInit(): void {
    console.log('✅ TasksComponent with EnhancedTaskTracker loaded successfully!');
  }
}
