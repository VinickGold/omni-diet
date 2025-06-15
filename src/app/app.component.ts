import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { filter, map } from 'rxjs';
import { FoodSyncService } from './services/food-sync.service';
import { PlanHistoryService } from './services/plan-history.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router, 
    private route: ActivatedRoute , 
    private syncService: FoodSyncService,
    private planRecordService: PlanHistoryService,
    
  ) 
  {
    
  }

  async ngOnInit() {
    
    // Sincronização dos dados alimentares
    await this.syncService.syncIfNeeded();

    // Persistencia do planejamneto no histórico
    this.planRecordService.freezeMissingPlansIfNeeded();

    // Fix tamanho da tla android/ios
    this.setRealViewportHeight();
    window.addEventListener('resize', this.setRealViewportHeight);
    
  }



  setRealViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
    
}
