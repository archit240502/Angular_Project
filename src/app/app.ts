import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './app/components/navbar/navbar';
import { Footer } from './app/shared/footer/footer';
import { ToastContainerComponent } from './app/components/toast/toast';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, Footer, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fruit-basket');
  showNavbarAndFooter = signal(true);

  constructor(private router: Router) {
    // Subscribe to router events to track current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide navbar and footer on login and signup pages
        const hideOnRoutes = ['/login', '/signup'];
        const shouldHide = hideOnRoutes.includes(event.urlAfterRedirects);
        this.showNavbarAndFooter.set(!shouldHide);
      });
  }
}
