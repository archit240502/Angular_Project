import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FruitList } from '../fruits/fruit-list/fruit-list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FruitList, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {

}
