import { Component, OnInit } from '@angular/core';
import { PlanHistoryService } from '../../services/plan-history.service';
import { DailyPlanSnapshot, DayPlan, ImportedFood, Meal, ProfileData } from '../../models/models';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStorageService } from '../../services/data-storage.service';
import { MealEditComponent } from '../meal-edit/meal-edit.component';
import { IndexedDbWrapperService } from '../../services/indexed-db.service';

@Component({
  selector: 'record-meal-editor',
  standalone: true,
  imports: [CommonModule, MealEditComponent],
  templateUrl: './record-meal-editor.component.html',
  providers: [DataStorageService]
})
export class RecordMealEditorComponent implements OnInit {
  meal!: Meal;
  profileData!: any; // opcional, se usar no componente
  selectedDay: string = '';
  importedFoods: ImportedFood[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService,
    private planRecordService: PlanHistoryService,
    private dbservice: IndexedDbWrapperService
  ) {}

  async ngOnInit(): Promise<void> {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? history.state;

    this.importedFoods = await this.dbservice.getAll<ImportedFood>('foods') || [];

    this.meal = state?.meal;
    this.selectedDay = state?.date;
    console.log('Paremeters' , this.meal , this.selectedDay);

    if (!this.meal || !this.selectedDay) {
      console.warn('Dados incompletos recebidos. Redirecionando...');
      this.router.navigate(['/meal-plan'], { replaceUrl: true });
      return;
    }

    // Use os dados normalmente
    console.log('Editing meal for:', this.selectedDay);
  }

  confirmar() {
    // Adiciona ao recordatório (chamar um service ou emitir evento)
    this.addMealToExecution(this.meal);

    // Volta para a rota de planejamento
    this.router.navigate(['/meal-plan'] , { replaceUrl: true });
  }

  addMealToExecution(meal: Meal) 
  {
    let day = this.selectedDay; // this.getDateForWeekday(this.selectedDay);

    console.log('day' , day);
    const snapshot = this.planRecordService.getPlan(day);
    if (!snapshot) {
      console.warn(`Nenhum plano disponível para ${day}`);
      return;
    }

    const executed = snapshot.executed ?? new DayPlan(day, []);
    const alreadyExists = executed.meals.some(m => m.name === meal.name);

    if (alreadyExists) {
      console.log(`A refeição "${meal.name}" já está registrada na execução.`);
      return;
    }

    // Clonar a refeição antes de adicionar
    const clonedMeal = JSON.parse(JSON.stringify(meal));
    executed.meals.push(clonedMeal);

    this.planRecordService.saveExecutedPlan(day, executed)
    // this.planRecordService.saveExecutedPortion(this.today, executed);
    console.log(`Refeição "${meal.name}" adicionada à execução.`);
  }

  onDateChange(newDate: any) {
    console.log(newDate);
    this.selectedDay = newDate.target.value;
    console.log('Data selecionada alterada para:', this.selectedDay);
  }

  mealChanged(meal: Meal)
  {
    this.meal = {...meal};
  }
}