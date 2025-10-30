import { Routes } from '@angular/router';
import { Home } from './app/components/home/home';
import { UserLogin } from './app/components/user-login/user-login';
import { UserSignup } from './app/components/user-signup/user-signup';
import { FruitList } from './app/components/fruits/fruit-list/fruit-list';
import { AdminDashboard } from './app/components/admin-dashboard/admin-dashboard';
import { FruitAdd } from './app/components/fruits/fruit-add/fruit-add';
import { FruitEdit } from './app/components/fruits/fruit-edit/fruit-edit';
import { CartComponent } from './app/components/cart/cart';
import { AuthGuard } from './app/services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserLogin },
  { path: 'signup', component: UserSignup },
  { path: 'home', component: Home },
  { path: 'fruits', component: FruitList },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboard },
  { path: 'add-fruit', component: FruitAdd },
  { path: 'edit-fruit/:id', component: FruitEdit, },
  { path: '**', redirectTo: '/login' }
];
