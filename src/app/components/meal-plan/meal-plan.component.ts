import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DayPlan, ImportedFood, Meal, ProfileData } from '../../models/models';
import { ProgressBarCardComponent } from '../progress-bar-card/progress-bar-card.component';
import { Modal22Component } from '../app-modal/app-modal.component';
import { IndexedDbWrapperService } from '../../services/indexed-db.service';
import { PlanHistoryService } from '../../services/plan-history.service';
import { MealEditComponent } from '../meal-edit/meal-edit.component';
import { NutritionCalculatorService } from '../../services/nutition-calculator.service';

@Component({
  selector: 'app-meal-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule , ReactiveFormsModule, ProgressBarCardComponent, Modal22Component , MealEditComponent],
  templateUrl: './meal-plan.component.html',
  providers: [DataStorageService , NutritionCalculatorService],
})
export class MealPlanComponent implements OnInit {

  @ViewChild('copyPlanModal') copyModal!: Modal22Component;

  Math = Math;
  importedFoods: ImportedFood[] = [];
  profileData: ProfileData | null = null;
  selectedDay: string = 'Sunday'; // Default to Monday
  mealPlans: DayPlan[] = [];

  abrirCopia = false;
  diasSelecionados: { [key: string]: boolean } = {};
  dayIndexes = [1, 2, 3, 4, 5, 6, 7];
  
  predefinedMeals: Meal[] = [
    new Meal('Café', '08:00'),
    new Meal('Lanche Manhã', '10:00'),
    new Meal('Almoço', '12:00'),
    new Meal('Lanche Tarde', '15:00'),
    new Meal('Ceia', '18:00'),
    new Meal('Janta', '21:00'),
  ];
  selectedDate: any;

  constructor(
    private router: Router,
    private dataService: DataStorageService,
    private dbservice: IndexedDbWrapperService,
    private planRecordService: PlanHistoryService,
    private nutritionCalculator: NutritionCalculatorService
  ) {}

  async ngOnInit(): Promise<void> {
    const data = this.dataService.loadData<DayPlan[]>('meal-plans');
    this.mealPlans = data ?? [];
    console.log('Plano de refeição carregado:', this.mealPlans);

    var x = this.planRecordService.getAllHistory();
    console.log('RECORDATÒRIO' , x);

    this.importedFoods = await this.dbservice.getAll<ImportedFood>('foods') || [];
    
    const profile = this.dataService.loadData<ProfileData>('profileData');
    this.profileData = profile ?? null;
    const todayIndex = new Date().getDay() + 1; // 1 (Domingo) até 7 (Sábado)
    this.selectedDay = this.getDayNameByIndex(todayIndex, 'en-US');

  }

  setDate(index: number)
  {
    console.log('setDate:' , index);
    this.selectedDay = this.getDayNameByIndex(index , 'en-US');
    this.selectedDate = this.getDateByDayName(this.selectedDay);
  }

  getDateByDayName(dayName: string): Date {
    const today = new Date();
    const todayIndex = today.getDay(); // 0 (domingo) até 6 (sábado)
    const targetIndex = this.getDayIndexFromName(dayName); // 0 até 6
    const diff = targetIndex - todayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate;
  }

  getDayIndexFromName(dayName: string): number {
    const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
    for (let i = 0; i < 7; i++) {
      const date = new Date(2021, 5, 6 + i); // base Sunday
      const name = formatter.format(date);
      if (name.toLowerCase() === dayName.toLowerCase()) {
        return date.getDay(); // 0 até 6
      }
    }
    throw new Error('Invalid day name');
  }

  getDayNameByIndex(dayIndex: number, locale: string = 'en-US', format: 'long' | 'short' | 'narrow' = 'long'): string {
    const baseDate = new Date(Date.UTC(2021, 5, 6)); // Sunday
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayIndex);
    const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
    var x = formatter.format(date);
    return x.charAt(0).toUpperCase() + x.slice(1); 
  }

  copiarPlanoParaDias() {
    
    const planoOrigem = this.getSelectedDayPlan();
    if (!planoOrigem) return;

    for (const index of this.dayIndexes) 
    {
      let dia = this.getDayNameByIndex(index);

      if (this.diasSelecionados[dia] && dia !== planoOrigem.day) 
      {
        const index = this.mealPlans.findIndex(p => p.day === dia);
        const novoPlano: DayPlan = {
          day: dia,
          meals: JSON.parse(JSON.stringify(planoOrigem.meals))
        };
        if (index !== -1) {
          this.mealPlans[index] = novoPlano;
        } else {
          this.mealPlans.push(novoPlano);
        }
      }
    }

    this.copyModal.close();
    this.diasSelecionados = {}; // limpa seleção
  }

  calculateMealNutrition(meal: Meal) {
    return this.nutritionCalculator.sumMeal(meal);
  }

  calculateDayNutrition(dayPlan: DayPlan) {
    return this.nutritionCalculator.sumMeals(dayPlan.meals)
  }

  createMeal(meal: Meal): void {
    const selectedDayPlan = this.getSelectedDayPlan();
  
    // Verifica se já existe uma refeição no mesmo horário com o mesmo nome
    const exists = selectedDayPlan.meals.some(
      (m) => m.time === meal.time && m.name.toLowerCase() === meal.name.toLowerCase()
    );
  
    if (exists) {
      alert(`Já existe uma refeição chamada "${meal.name}" às ${meal.time}.`);
      return;
    }
  
    // Adiciona a nova refeição
    selectedDayPlan.meals.push(new Meal(meal.name, meal.time));
    selectedDayPlan.meals.sort((a, b) => a.time.localeCompare(b.time));
    this.saveMealPlans();
  }

  deleteMeal(index: number) 
  {
    const selectedDayPlan = this.getSelectedDayPlan();
    selectedDayPlan.meals.splice(index, 1);
    this.saveMealPlans();
  }

  public getSelectedDayPlan(): DayPlan {
    let dayPlan = this.mealPlans.find((plan) => plan.day === this.selectedDay);
    if (!dayPlan) {
      dayPlan = new DayPlan(this.selectedDay);
      this.mealPlans.push(dayPlan);
    }
    return dayPlan;
  }

  saveMealPlans() {
    this.dataService.saveData('meal-plans', this.mealPlans);
  }

  ngOnDestroy(): void {
    this.saveMealPlans();
  }

  mealChanged(index: number , meal: Meal)
  {
    let selectedDayPlan = this.getSelectedDayPlan();
    selectedDayPlan.meals[index] = { ...meal };
    selectedDayPlan.meals.sort((a, b) => a.time.localeCompare(b.time));
  }

  copyMealToRecord(meal: Meal) {
    console.log('hmmm' , this.selectedDay);
    const mealCopy = structuredClone(meal);

    this.router.navigate(['/record-meal-editor'], {
      state: {
        meal: structuredClone(meal),
        dayLabel: this.selectedDay
      }
    });
  }
}
