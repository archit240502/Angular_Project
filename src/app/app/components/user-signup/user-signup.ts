import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-signup.html',
  styleUrls: ['./user-signup.css'],
})
export class UserSignup {
  username = ''; password = ''; msg = ''; err = '';
  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router: Router
  ) {}
  signup() {
    this.err = ''; this.msg = '';
    if (!this.username || !this.password) { this.err = 'Fill details'; return; }
    this.userService.signup({ username: this.username.trim(), password: this.password, role: 'user' }).subscribe(u => {
      // Auto-login the user after successful signup
      this.authService.setUser(u);
      this.msg = 'Account created successfully! Redirecting...';
      localStorage.setItem('fb_toast','Account created and logged in');
      setTimeout(()=> this.router.navigate(['/home']),800);
    }, ()=> this.err = 'Signup failed');
  }
}
