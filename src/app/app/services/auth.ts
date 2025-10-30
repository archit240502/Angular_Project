import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public user$ = this.userSubject.asObservable();

  constructor() {
    // Listen for storage changes to update user state
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  private handleStorageChange(event: StorageEvent) {
    if (event.key === 'fb_user') {
      const user = event.newValue ? JSON.parse(event.newValue) : null;
      this.userSubject.next(user);
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('fb_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  setUser(user: User): void {
    localStorage.setItem('fb_user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('fb_user');
    this.userSubject.next(null);
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}
