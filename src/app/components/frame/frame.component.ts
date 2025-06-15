import { Component } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { FoodSyncService } from '../../services/food-sync.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet],
  templateUrl: './frame.component.html'
})
export class MainLayoutComponent {
  //pageTitle = 'Your App';

  title = 'omni-diet';
    pageTitle: any;
    pageDescription: any;
  
    navigate(route: string){
      this.router.navigate([route]);
    }
  
    constructor(private router: Router, private route: ActivatedRoute, 
      // private syncService: FoodSyncService
    ) {
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          map(() => {
            let child = this.route.firstChild;
            while (child?.firstChild) {
              child = child.firstChild;
            }
            return child?.snapshot.data;
          })
        )
        .subscribe(data => {
          this.pageTitle = data?.['title'] || 'Title';
          this.pageDescription = data?.['description'] || 'Description';
        });
    }
}