import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FruitService } from '../../services/fruit';
import { Fruit } from '../../../models/fruit';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  fruits: Fruit[] = []; 
  loading = false; 
  msg = '';
  searchTerm = '';
  
  constructor(private fruitService: FruitService, private router: Router) {}
  
  ngOnInit(){ 
    this.load(); 
    
    // Check for toast messages from add/edit operations
    const toastMsg = localStorage.getItem('fb_toast');
    if(toastMsg) {
      console.log('Toast message:', toastMsg);
      localStorage.removeItem('fb_toast');
      // Could show a toast notification here
    }
  }
  
  load(){ 
    this.loading = true; 
    this.fruitService.getAll().subscribe({
      next: (r: any) => {
        console.log('Loaded fruits:', r); // Debug log
        this.fruits = r || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading fruits:', error); // Debug log
        this.fruits = [];
        this.loading = false;
      }
    });
  }
  
  edit(id:number|undefined){ 
    if(id) this.router.navigate(['/edit-fruit', id]); 
  }
  
  del(id:number|undefined){ 
    if(!id || !confirm('Delete?')) return; 
    this.fruitService.delete(id).subscribe(()=>{ 
      localStorage.setItem('fb_toast','Fruit deleted'); 
      this.load(); 
    }) 
  }

  // Statistics methods
  getTotalQuantity(): number {
    return this.fruits.reduce((total, fruit) => total + (fruit.quantity || 0), 0);
  }

  getTotalValue(): number {
    return this.fruits.reduce((total, fruit) => total + ((fruit.price || 0) * (fruit.quantity || 0)), 0);
  }

  getLowStockCount(): number {
    return this.fruits.filter(fruit => (fruit.quantity || 0) <= 5).length;
  }

  // Filter methods
  getFilteredFruits(): Fruit[] {
    if (!this.searchTerm.trim()) {
      return this.fruits;
    }
    return this.fruits.filter(fruit => 
      fruit.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      fruit.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Status methods
  getQuantityClass(quantity: number): string {
    if (quantity <= 5) return 'quantity-low';
    if (quantity <= 20) return 'quantity-medium';
    return 'quantity-high';
  }

  getStatusClass(quantity: number): string {
    if (quantity <= 5) return 'status-low';
    if (quantity <= 20) return 'status-medium';
    return 'status-high';
  }

  getStatusIcon(quantity: number): string {
    if (quantity <= 5) return 'fas fa-exclamation-triangle';
    if (quantity <= 20) return 'fas fa-exclamation-circle';
    return 'fas fa-check-circle';
  }

  getStatus(quantity: number): string {
    if (quantity <= 5) return 'Low Stock';
    if (quantity <= 20) return 'Medium Stock';
    return 'In Stock';
  }

  // Image error handler
  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.svg';
  }
}
