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
    { path: 'record-viewer', icon: 'fa-database' },
    { path: 'food-substitution', icon: 'fa-repeat' },
    { path: 'import-food', icon: 'fa-database' },

    // { path: 'tracker', icon: 'fa-person-biking' },
    // { path: 'login', icon: 'fa-repeat' }

    
  ];

  navigationItems: NavigationItem[] = [];

  constructor(private router: Router) {}



  ngOnInit(): void {
    const routeConfig = this.router.config;

    this.navigationItems = this.routePaths.map(item => {
      const route1 = routeConfig.find(r => r.path == '');
      const route = route1?.children?.find(r => r.path === item.path);
      //console.log(routeConfig);
      return {
        path: `/${item.path}`,
        icon: item.icon,
        title: route?.data?.['title'] ?? item.path,
        description: route?.data?.['description'] ?? ''
      };
    });
  }
}
