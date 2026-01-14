import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.checkPermission();
  }

  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    // Always check actual permission, not cached value
    this.checkPermission();
    
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  async notifyTaskDue(taskTitle: string, recurrence: string): Promise<void> {
    await this.showNotification('Task Due! ⏰', {
      body: `${taskTitle} (${recurrence})`,
      tag: 'task-due',
      requireInteraction: false,
      silent: false
    });
  }

  async notifyTaskReset(taskTitle: string): Promise<void> {
    await this.showNotification('Task Reset 🔄', {
      body: `${taskTitle} has been reset and is ready again!`,
      tag: 'task-reset',
      requireInteraction: false
    });
  }

  hasPermission(): boolean {
    return this.permission === 'granted';
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }
}
