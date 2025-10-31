import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toasts.asObservable();

  showSuccess(title: string, message: string, duration: number = 5000): void {
    this.showToast('success', title, message, duration);
  }

  showError(title: string, message: string, duration: number = 5000): void {
    this.showToast('error', title, message, duration);
  }

  showWarning(title: string, message: string, duration: number = 5000): void {
    this.showToast('warning', title, message, duration);
  }

  showInfo(title: string, message: string, duration: number = 5000): void {
    this.showToast('info', title, message, duration);
  }

  private showToast(type: ToastMessage['type'], title: string, message: string, duration: number): void {
    console.log('ToastService.showToast called:', type, title, message);
    const id = Date.now().toString();
    const toast: ToastMessage = { id, type, title, message, duration };
    
    const currentToasts = this.toasts.value;
    console.log('Current toasts before adding:', currentToasts);
    this.toasts.next([...currentToasts, toast]);
    console.log('Toast added, new list:', [...currentToasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
  }

  removeToast(id: string): void {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter(toast => toast.id !== id));
  }

  clearAll(): void {
    this.toasts.next([]);
  }
}
