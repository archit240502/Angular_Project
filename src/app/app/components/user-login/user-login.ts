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
  username = ''; 
  password = ''; 
  error = '';
  loginType: 'customer' | 'admin' = 'customer';

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router: Router
  ) {}

  setLoginType(type: 'customer' | 'admin') {
    this.loginType = type;
    this.error = ''; // Clear any previous errors
  }

  login() {
    this.error = '';
    if (!this.username || !this.password) { 
      this.error = 'Enter credentials'; 
      return; 
    }

    if (this.loginType === 'admin') {
      // Admin login logic
      this.userService.adminLogin(this.username.trim(), this.password).subscribe(user => {
        if (user) {
          this.authService.setUser(user);
          localStorage.setItem('fb_toast', 'Admin logged in successfully');
          this.router.navigate(['/admin']);
        } else {
          this.error = 'Invalid admin credentials';
        }
      }, () => this.error = 'Admin login failed');
    } else {
      // Customer login logic
      this.userService.login(this.username.trim(), this.password).subscribe(user => {
        if (user && user.role !== 'admin') {
          this.authService.setUser(user);
          localStorage.setItem('fb_toast', 'Logged in successfully');
          this.router.navigate(['/home']);
        } else if (user && user.role === 'admin') {
          this.error = 'Please use Admin login for admin accounts';
        } else {
          this.error = 'Invalid username or password';
        }
      }, () => this.error = 'Login failed');
    }
  }
}
