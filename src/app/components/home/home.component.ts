import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AuthService } from '../../services/authentication.service';

interface NavigationItem {
  path: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterModule , CommonModule],
  providers: [AuthService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Apenas os paths que você quer no menu
  routePaths = [
    { path: 'profile', icon: 'fa-user' },
    { path: 'meal-plan', icon: 'fa-utensils' },
    { path: 'shopping-list', icon: 'fa-shopping-basket' },
    { path: 'water-intake', icon: 'fa-tint' },
    { path: 'exercices', icon: 'fa-dumbbell' },
    { path: 'tracker', icon: 'fa-person-biking' },
    { path: 'import-food', icon: 'fa-database' },
    { path: 'food-substitution', icon: 'fa-repeat' },
    // { path: 'login', icon: 'fa-repeat' }

    
  ];

  navigationItems: NavigationItem[] = [];

  constructor(private router: Router , private auth: AuthService) {}

  logout()
  {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    const routeConfig = this.router.config;

    this.navigationItems = this.routePaths.map(item => {
      const route = routeConfig.find(r => r.path === item.path);

      return {
        path: `/${item.path}`,
        icon: item.icon,
        title: route?.data?.['title'] ?? item.path,
        description: route?.data?.['description'] ?? ''
      };
    });
  }
}
