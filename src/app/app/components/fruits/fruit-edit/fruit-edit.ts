import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FruitService } from '../../../services/fruit';

@Component({
  selector: 'app-fruit-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './fruit-edit.html',
  styleUrls: ['./fruit-edit.css'],
})
export class FruitEdit implements OnInit {
  model:any = { id: null, name:'', price:0, quantity:0, image:'assets/images/placeholder.svg', description:'' };
  loading=false; 
  msg='';
  imageError = false;
  
  constructor(private route: ActivatedRoute, private fs: FruitService, private router: Router) {}
  
  ngOnInit(){
    this.loadFruit();
  }
  
  loadFruit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Edit Fruit ID:', id); // Debug log
    
    if(id){ 
      this.loading = true; 
      this.msg = ''; // Clear any previous error messages
      
      // First check if the server is accessible
      this.fs.healthCheck().subscribe({
        next: () => {
          console.log('Server is accessible'); // Debug log
          // Server is accessible, now try to load the fruit
          this.loadFruitData(id);
        },
        error: (error) => {
          console.error('Server health check failed:', error); // Debug log
          this.msg = 'Cannot connect to the JSON server. Please ensure the server is running on port 3000. Run: npx json-server --watch db.json --port 3000';
          this.loading = false;
        }
      });
    } else {
      this.msg = 'No fruit ID provided in the URL';
      this.loading = false;
    }
  }

  private loadFruitData(id: string) {
    // Use the ID as string since JSON server uses string IDs
    this.fs.getById(id).subscribe({
      next: (f: any) => {
        console.log('Loaded fruit data:', f); // Debug log
        if(f && f.id) {
          // Ensure all fields are properly mapped
          this.model = {
            id: f.id,
            name: f.name || '',
            price: Number(f.price) || 0,
            quantity: Number(f.quantity) || 0,
            image: f.image || 'assets/images/placeholder.svg',
            description: f.description || ''
          };
          this.imageError = false; // Reset image error state
          console.log('Model updated:', this.model); // Debug log
        } else {
          this.msg = 'Fruit not found or invalid data received';
          console.error('Invalid fruit data:', f);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading fruit:', error); // Debug log
        this.msg = `Failed to load fruit with ID "${id}". Error: ${error.status || 'Unknown'} - ${error.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }
  
  onImageChange() {
    console.log('Image loaded successfully:', this.model.image);
    this.imageError = false;
  }
  
  onImageError() {
    console.log('Image failed to load:', this.model.image);
    this.imageError = true;
  }
  
  // Quantity status methods
  getQuantityStatusClass(quantity: number): string {
    if (quantity <= 5) return 'status-critical';
    if (quantity <= 20) return 'status-warning';
    return 'status-good';
  }

  getQuantityStatusIcon(quantity: number): string {
    if (quantity <= 5) return 'fas fa-exclamation-triangle';
    if (quantity <= 20) return 'fas fa-exclamation-circle';
    return 'fas fa-check-circle';
  }

  getQuantityStatusText(quantity: number): string {
    if (quantity <= 5) return 'Critical - Restock needed';
    if (quantity <= 20) return 'Low stock - Consider restocking';
    return 'Good stock level';
  }

  // Stock status methods
  getStockStatusClass(quantity: number): string {
    if (quantity <= 5) return 'text-danger';
    if (quantity <= 20) return 'text-warning';
    return 'text-success';
  }

  getStockStatusText(quantity: number): string {
    if (quantity <= 5) return 'Critical Stock';
    if (quantity <= 20) return 'Low Stock';
    return 'In Stock';
  }

  // Utility methods
  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalValue(): number {
    return (this.model.price || 0) * (this.model.quantity || 0);
  }
  
  save() { 
    if(!this.model.id) {
      this.msg = 'Cannot save: No fruit ID found';
      return;
    }
    
    // Validate required fields
    if(!this.model.name || !this.model.price || this.model.quantity < 0) {
      this.msg = 'Please fill in all required fields with valid values';
      return;
    }
    
    console.log('Saving fruit:', this.model); // Debug log
    
    this.fs.update(this.model).subscribe({
      next: (updatedFruit) => {
        console.log('Fruit updated successfully:', updatedFruit); // Debug log
        localStorage.setItem('fb_toast','Fruit updated successfully');
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        console.error('Error updating fruit:', error); // Debug log
        this.msg = 'Failed to save changes. Please try again.';
      }
    });
  }

}
