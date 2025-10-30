import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Cart } from '../../models/cart';
import { Fruit } from '../../models/fruit';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<Cart>(this.getCart());

  constructor(private authService: AuthService) {
    // Load cart from localStorage on service initialization
    this.loadCart();
    
    // Clear cart when user logs out
    this.authService.user$.subscribe(user => {
      if (!user) {
        this.clearCart();
      }
    });
  }

  // Get cart as observable
  getCart$(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  // Get current cart state
  getCart(): Cart {
    const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = this.cartItems.reduce((total, item) => total + (item.fruit.price * item.quantity), 0);
    
    return {
      items: this.cartItems,
      totalItems,
      totalAmount
    };
  }

  // Add item to cart
  addToCart(fruit: Fruit, quantity: number = 1): boolean {
    if (!this.authService.isLoggedIn()) {
      return false; // Return false to indicate cart operation failed
    }
    
    const existingItem = this.cartItems.find(item => item.fruit.id === fruit.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ fruit, quantity });
    }
    
    this.updateCart();
    return true; // Return true to indicate success
  }

  // Remove item from cart
  removeFromCart(fruitId: number): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    
    this.cartItems = this.cartItems.filter(item => item.fruit.id !== fruitId);
    this.updateCart();
    return true;
  }

  // Update item quantity
  updateQuantity(fruitId: number, quantity: number): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    
    const item = this.cartItems.find(item => item.fruit.id === fruitId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(fruitId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
    return true;
  }

  // Clear entire cart
  clearCart(): boolean {
    this.cartItems = [];
    this.updateCart();
    return true;
  }

  // Check if item is in cart
  isInCart(fruitId: number): boolean {
    return this.cartItems.some(item => item.fruit.id === fruitId);
  }

  // Get item quantity from cart
  getItemQuantity(fruitId: number): number {
    const item = this.cartItems.find(item => item.fruit.id === fruitId);
    return item ? item.quantity : 0;
  }

  // Private method to update cart and notify subscribers
  private updateCart(): void {
    this.saveCart();
    this.cartSubject.next(this.getCart());
  }

  // Save cart to localStorage
  private saveCart(): void {
    if (this.authService.isLoggedIn()) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  // Load cart from localStorage
  private loadCart(): void {
    if (this.authService.isLoggedIn()) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next(this.getCart());
      }
    }
  }
}
