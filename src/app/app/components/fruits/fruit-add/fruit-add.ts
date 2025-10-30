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
  model:any = { name:'', price:0, quantity:0, image:'assets/images/placeholder.svg', description:'' };
  msg = '';
  constructor(private fs: FruitService, private router: Router) {}
  add() {
    this.fs.add(this.model).subscribe(()=>{ localStorage.setItem('fb_toast','Fruit added'); this.router.navigate(['/admin']); }, ()=> this.msg='Failed');
  }
}
