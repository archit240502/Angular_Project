import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FruitService } from '../../services/fruit';
import { Fruit } from '../../../models/fruit';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  fruits: Fruit[] = []; loading = false; msg = '';
  constructor(private fruitService: FruitService, private router: Router) {}
  ngOnInit(){ this.load(); }
  load(){ this.loading = true; this.fruitService.getAll().subscribe((r:any)=>{ this.fruits = r; this.loading=false; }, ()=>this.loading=false); }
  edit(id:number|undefined){ if(id) this.router.navigate(['/edit-fruit', id]); }
  del(id:number|undefined){ if(!id || !confirm('Delete?')) return; this.fruitService.delete(id).subscribe(()=>{ localStorage.setItem('fb_toast','Fruit deleted'); this.load(); }) }
}
