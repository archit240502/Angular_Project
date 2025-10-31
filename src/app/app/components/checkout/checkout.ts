import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { Cart } from '../../../models/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class CheckoutComponent implements OnInit {
  cart: Cart = { items: [], totalItems: 0, totalAmount: 0 };
  currentStep = 1;
  totalSteps = 3;

  // User Information
  userInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  // Delivery Information
  deliveryInfo = {
    address: '',
    city: '',
    pincode: '',
    landmark: '',
    deliveryTime: 'standard'
  };

  // Payment Information
  paymentInfo = {
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  };

  isProcessing = false;
  orderSuccess = false;
  orderId = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get cart data
    this.cartService.getCart$().subscribe(cart => {
      this.cart = cart;
      if (cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    // Pre-fill user info if available
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userInfo.email = user.username + '@example.com';
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.userInfo.firstName && this.userInfo.lastName && 
               this.userInfo.email && this.userInfo.phone);
      case 2:
        return !!(this.deliveryInfo.address && this.deliveryInfo.city && 
               this.deliveryInfo.pincode);
      case 3:
        if (this.paymentInfo.method === 'card') {
          return !!(this.paymentInfo.cardNumber && this.paymentInfo.expiryDate && 
                 this.paymentInfo.cvv && this.paymentInfo.cardName);
        }
        return true;
      default:
        return false;
    }
  }

  placeOrder(): void {
    this.isProcessing = true;
    
    // Simulate order processing
    setTimeout(() => {
      this.orderId = 'ORD' + Date.now();
      this.orderSuccess = true;
      this.isProcessing = false;
      
      // Show success toast notification
      this.toastService.showSuccess(
        '🎉 Order Placed Successfully!',
        `Your order ${this.orderId} has been confirmed and will be delivered by ${this.getEstimatedDelivery()}.`,
        8000
      );
      
      // Clear cart
      this.cartService.clearCart();
      
      // Store order success message for other components
      localStorage.setItem('fb_toast', `Order ${this.orderId} placed successfully!`);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  continueShopping(): void {
    this.router.navigate(['/fruits']);
  }

  getEstimatedDelivery(): string {
    const today = new Date();
    const deliveryDate = new Date(today);
    
    if (this.deliveryInfo.deliveryTime === 'express') {
      deliveryDate.setDate(today.getDate() + 1);
    } else {
      deliveryDate.setDate(today.getDate() + 3);
    }
    
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDeliveryCharge(): number {
    if (this.deliveryInfo.deliveryTime === 'express') {
      return 99;
    }
    return this.cart.totalAmount > 500 ? 0 : 49;
  }

  getTotalWithDelivery(): number {
    return this.cart.totalAmount + this.getDeliveryCharge();
  }
}
