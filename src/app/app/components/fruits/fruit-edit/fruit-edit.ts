import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FruitService } from '../../../services/fruit';

@Component({
  selector: 'app-fruit-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fruit-edit.html',
  styleUrls: ['./fruit-edit.css'],
})
export class FruitEdit implements OnInit {
  model:any = { name:'', price:0, quantity:0, image:'', description:'' };
  loading=false; msg='';
  constructor(private route: ActivatedRoute, private fs: FruitService, private router: Router) {}
  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){ this.loading=true; this.fs.getById(id).subscribe((f:any)=>{ this.model = f; this.loading=false; }, ()=>this.loading=false); }
  }
  save(){ if(!this.model.id) return; this.fs.update(this.model).subscribe(()=>{ localStorage.setItem('fb_toast','Saved'); this.router.navigate(['/admin']); }, ()=> this.msg='Failed to save'); }

}
