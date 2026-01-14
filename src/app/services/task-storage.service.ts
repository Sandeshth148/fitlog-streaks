import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskStorageService {
  private dbName = 'fitlog-tasks-db';
  private storeName = 'tasks';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
          objectStore.createIndex('completed', 'completed', { unique: false });
          objectStore.createIndex('priority', 'priority', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
          objectStore.createIndex('dueDate', 'dueDate', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }

  getTasks(): Observable<Task[]> {
    return from(
      this.ensureDB().then(db => {
        return new Promise<Task[]>((resolve, reject) => {
          const transaction = db.transaction([this.storeName], 'readonly');
          const objectStore = transaction.objectStore(this.storeName);
          const request = objectStore.getAll();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    return from(
      this.ensureDB().then(db => {
        return new Promise<Task>((resolve, reject) => {
          const task: Task = {
            ...taskData,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const transaction = db.transaction([this.storeName], 'readwrite');
          const objectStore = transaction.objectStore(this.storeName);
          const request = objectStore.add(task);

          request.onsuccess = () => resolve(task);
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  updateTask(task: Task): Observable<void> {
    return from(
      this.ensureDB().then(db => {
        return new Promise<void>((resolve, reject) => {
          const updatedTask = { ...task, updatedAt: new Date() };
          const transaction = db.transaction([this.storeName], 'readwrite');
          const objectStore = transaction.objectStore(this.storeName);
          const request = objectStore.put(updatedTask);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return from(
      this.ensureDB().then(db => {
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction([this.storeName], 'readwrite');
          const objectStore = transaction.objectStore(this.storeName);
          const request = objectStore.delete(id);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  toggleTaskCompletion(id: string): Observable<Task> {
    return from(
      this.ensureDB().then(db => {
        return new Promise<Task>((resolve, reject) => {
          const transaction = db.transaction([this.storeName], 'readwrite');
          const objectStore = transaction.objectStore(this.storeName);
          const getRequest = objectStore.get(id);

          getRequest.onsuccess = () => {
            const task = getRequest.result as Task;
            if (task) {
              task.completed = !task.completed;
              task.updatedAt = new Date();
              const putRequest = objectStore.put(task);
              putRequest.onsuccess = () => resolve(task);
              putRequest.onerror = () => reject(putRequest.error);
            } else {
              reject(new Error('Task not found'));
            }
          };
          getRequest.onerror = () => reject(getRequest.error);
        });
      })
    );
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
