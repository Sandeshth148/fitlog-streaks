import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tasks-container">
      <div class="tasks-header">
        <h1>✅ Tasks MFE Loaded Successfully!</h1>
        <p class="subtitle">This is a simple test component from fitlog-tasks-2</p>
      </div>
      <div class="content">
        <p>If you can see this, the MFE integration is working correctly.</p>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f9fafb;
      min-height: 100vh;
    }

    .tasks-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .tasks-header h1 {
      font-size: 2.5rem;
      color: #10b981;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #6b7280;
      font-size: 1.1rem;
    }

    .content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
    }

    .content p {
      font-size: 1.2rem;
      color: #374151;
    }
  `]
})
export class TasksComponent implements OnInit {
  
  ngOnInit(): void {
    console.log('✅ TasksComponent from fitlog-tasks-2 loaded successfully!');
  }
}
