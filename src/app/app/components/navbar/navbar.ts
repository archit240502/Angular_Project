import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { Cart } from '../../../models/cart';
import { User } from '../../../models/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null = null;
  cart: Cart = { items: [], totalItems: 0, totalAmount: 0 };
  private cartSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  constructor(
    private router: Router, 
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCart$().subscribe(cart => {
      this.cart = cart;
    });
    
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
  
  logout() { 
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}
