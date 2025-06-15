import { Component, OnInit } from '@angular/core';
import { PlanHistoryService } from '../../services/plan-history.service';
import { DailyPlanSnapshot, DayPlan, ImportedFood, Meal } from '../../models/models';
import { CommonModule } from '@angular/common';
import { MealEditComponent } from '../meal-edit/meal-edit.component';
import { IndexedDbWrapperService } from '../../services/indexed-db.service';
import { MetricsPanelComponent } from '../record-metrics/record-metrics.component';

@Component({
  selector: 'record-viewer',
  standalone: true,
  templateUrl: './record-viewer.component.html',
  imports: [CommonModule, MealEditComponent, MetricsPanelComponent]
})
export class RecordViewerComponent implements OnInit {
  allHistory: DailyPlanSnapshot[] = [];
  currentSnapshot?: DailyPlanSnapshot;
  importedFoods: ImportedFood[] = [];
  selectedDate: string = '';
  activeTab: 'records' | 'metrics' = 'records';

  constructor(
    private historyService: PlanHistoryService,
    private dbservice: IndexedDbWrapperService
  ) {}

  async ngOnInit(): Promise<void> {
    this.allHistory = this.historyService.getAllHistory().reverse(); // Most recent first
    this.importedFoods = await this.dbservice.getAll<ImportedFood>('foods') || [];

    //const today = new Date().toISOString().split('T')[0];
    const today =  new Date().toLocaleDateString('en-CA');
    this.selectedDate = today;
    this.setCurrentSnapshot(today);
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value !== this.selectedDate) {
      this.setCurrentSnapshot(value);
    }
  }

  setCurrentSnapshot(date: string): void {
    let snapshot = this.allHistory.find(h => h.date === date);

    // Se não houver snapshot, cria um vazio para exibir "Nenhum dado registrado"
    if (!snapshot) {
      snapshot = {
        date,
        planned: new DayPlan(date , []),
        executed: undefined
      };
    }

    this.currentSnapshot = snapshot;
    this.selectedDate = date;
  }

  deleteMeal(index: number) {
    if (this.currentSnapshot && this.currentSnapshot.executed) {
      this.currentSnapshot.executed.meals.splice(index, 1);
      this.historyService.saveExecutedPlan(this.selectedDate, this.currentSnapshot.executed);
    }
  }

  mealChanged(index: number, meal: Meal) {
    if (this.currentSnapshot && this.currentSnapshot.executed) {
      this.currentSnapshot.executed.meals[index] = { ...meal };
      this.currentSnapshot.executed.meals.sort((a, b) => a.time.localeCompare(b.time));
      this.historyService.saveExecutedPlan(this.selectedDate, this.currentSnapshot.executed);
    }
  }
}
