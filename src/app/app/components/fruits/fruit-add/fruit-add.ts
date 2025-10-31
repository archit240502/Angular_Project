import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FruitService } from '../../../services/fruit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fruit-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fruit-add.html',
  styleUrls: ['./fruit-add.css'],
})
export class FruitAdd {
  model:any = { name:'', price:0, quantity:0, image:'', description:'' };
  msg = '';
  imageError = false;
  
  constructor(private fs: FruitService, private router: Router) {}
  
  onImageChange() {
    console.log('Image URL changed to:', this.model.image);
    this.imageError = false;
  }
  
  onImageError() {
    this.imageError = true;
  }
  
  setImage(imagePath: string) {
    this.model.image = imagePath;
    this.onImageChange();
  }
  
  add() {
    // Validate required fields
    if(!this.model.name || !this.model.price || this.model.quantity < 0) {
      this.msg = 'Please fill in all required fields with valid values';
      return;
    }
    
    // Ensure proper data types
    const fruitData = {
      name: this.model.name.trim(),
      price: Number(this.model.price),
      quantity: Number(this.model.quantity),
      image: this.model.image || 'assets/images/placeholder.svg',
      description: this.model.description || ''
    };
    
    console.log('Adding fruit:', fruitData); // Debug log
    
    this.fs.add(fruitData).subscribe({
      next: (addedFruit) => {
        console.log('Fruit added successfully:', addedFruit); // Debug log
        localStorage.setItem('fb_toast','Fruit added successfully');
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        console.error('Error adding fruit:', error); // Debug log
        this.msg = 'Failed to add fruit. Please try again.';
      }
    });
  }
}
