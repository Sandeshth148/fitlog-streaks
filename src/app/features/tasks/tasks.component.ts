import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnhancedTaskTrackerComponent } from '../../components/enhanced-task-tracker/enhanced-task-tracker.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, EnhancedTaskTrackerComponent],
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
