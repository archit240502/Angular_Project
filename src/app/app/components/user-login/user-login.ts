import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.css'],
})
export class UserLogin {
  username = ''; password = ''; error = '';
  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';
    if (!this.username || !this.password) { this.error = 'Enter credentials'; return; }
    this.userService.login(this.username.trim(), this.password).subscribe(user => {
      if (user) {
        this.authService.setUser(user);
        localStorage.setItem('fb_toast', 'Logged in successfully');
        if (user.role === 'admin') this.router.navigate(['/admin']); else this.router.navigate(['/home']);
      } else this.error = 'Invalid username or password';
    }, () => this.error = 'Login failed');
  }
}
