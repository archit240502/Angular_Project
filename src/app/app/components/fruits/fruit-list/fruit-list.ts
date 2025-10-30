import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FruitService } from '../../../services/fruit';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth';
import { Fruit } from '../../../../models/fruit';

@Component({
  selector: 'app-fruit-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fruit-list.html',
  styleUrls: ['./fruit-list.css'],
})
export class FruitList implements OnInit {
  fruits: Fruit[] = []; 
  loading = false;
  
  constructor(
    private fruitService: FruitService, 
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}
  
  ngOnInit() { 
    this.load(); 
  }
  
  load() { 
    this.loading = true; 
    this.fruitService.getAll().subscribe(
      res => { 
        this.fruits = res; 
        this.loading = false; 
      }, 
      () => this.loading = false
    ); 
  }
  
  goEdit(id: number) { 
    if (this.authService.isAdmin()) {
      this.router.navigate(['/edit-fruit', id]); 
    }
  }
  
  addToCart(fruit: Fruit, event: Event) {
    event.stopPropagation();
    
    if (!this.authService.isLoggedIn()) {
      this.showLoginRequiredMessage();
      return;
    }
    
    const success = this.cartService.addToCart(fruit, 1);
    if (success) {
      this.showAddedToCartMessage(fruit.name);
    }
  }
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  isInCart(fruitId: number): boolean {
    return this.cartService.isInCart(fruitId);
  }
  
  getCartQuantity(fruitId: number): number {
    return this.cartService.getItemQuantity(fruitId);
  }
  
  private showAddedToCartMessage(fruitName: string) {
    // Simple alert for now - you could implement a toast notification later
    const message = `${fruitName} added to cart!`;
    console.log(message);
    // You could use a toast library here for better UX
  }
  
  private showLoginRequiredMessage() {
    alert('Please login or signup to add items to cart');
    this.router.navigate(['/login']);
  }
  
  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.svg';
  }
}
