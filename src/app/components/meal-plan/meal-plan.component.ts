import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class MealPlanComponent implements OnInit, OnDestroy {

  @ViewChild('copyPlanModal') copyModal!: Modal22Component;

  Math = Math;
  importedFoods: ImportedFood[] = [];
  profileData: ProfileData | null = null;

  selectedDate: Date = new Date();

  abrirCopia = false;
  diasSelecionados: { [key: string]: boolean } = {};
  dayOffsets = [0, 1, 2, 3, 4, 5, 6];

  predefinedMeals: Meal[] = [
    new Meal('Café', '08:00'),
    new Meal('Lanche Manhã', '10:00'),
    new Meal('Almoço', '12:00'),
    new Meal('Lanche Tarde', '15:00'),
    new Meal('Ceia', '18:00'),
    new Meal('Janta', '21:00'),
  ];

  mealPlans: DayPlan[] = [];

  constructor(
    private router: Router,
    private dataService: DataStorageService,
    private dbservice: IndexedDbWrapperService,
    private planRecordService: PlanHistoryService,
    private nutritionCalculator: NutritionCalculatorService
  ) {}

  async ngOnInit(): Promise<void> {
    this.mealPlans = this.dataService.loadData<DayPlan[]>('meal-plans') ?? [];

    this.importedFoods = await this.dbservice.getAll<ImportedFood>('foods') || [];
    this.profileData = this.dataService.loadData<ProfileData>('profileData') ?? null;
  }

  getDayName(offset: number, format: 'short' | 'long' = 'short'): string {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    const result = new Intl.DateTimeFormat('pt-BR', {
      weekday: format === 'short' ? 'short' : 'long',
    }).format(date);

    return format == 'short' ? (result.charAt(0).toUpperCase() + result.slice(1)).replace('.', '') : result; 
  }

  ngOnDestroy(): void {
    this.saveMealPlans();
  }

  getDayNameFromDate(date: Date, locale: string = 'en-US'): string {
    return new Intl.DateTimeFormat(locale, { weekday: 'long' })
      .format(date)
      .replace(/^\w/, c => c.toUpperCase());
  }

  getDateByOffset(offset: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  }

  setDateByOffset(offset: number) {
    this.selectedDate = this.getDateByOffset(offset);
  }

  getSelectedDayPlan(): DayPlan {
    const dayName = this.getDayNameFromDate(this.selectedDate, 'en-US');
    let dayPlan = this.mealPlans.find(p => p.day === dayName);
    if (!dayPlan) {
      dayPlan = new DayPlan(dayName);
      this.mealPlans.push(dayPlan);
    }
    return dayPlan;
  }

  createMeal(meal: Meal): void {
    const selectedDayPlan = this.getSelectedDayPlan();

    const existingNames = selectedDayPlan.meals.map(m => m.name);

    const mealName = this.generateUniqueMealName(meal.name, existingNames);

    selectedDayPlan.meals.push(new Meal(mealName, meal.time));
    selectedDayPlan.meals.sort((a, b) => a.time.localeCompare(b.time));

    this.saveMealPlans();
  }

  generateUniqueMealName(baseName: string, existingNames: string[]): string {
    baseName = baseName.trim();
    const nameRegex = new RegExp(`^${baseName}(?: (\\d+))?$`, 'i');

    const matchedNumbers = existingNames
      .map(name => {
        const match = name.match(nameRegex);
        if (match) {
          return match[1] ? parseInt(match[1], 10) : 1;
        }
        return null;
      })
      .filter((n): n is number => n !== null);

    const nextNumber = matchedNumbers.length > 0 ? Math.max(...matchedNumbers) + 1 : 1;

    return nextNumber === 1 ? baseName : `${baseName} ${nextNumber}`;
  }

  deleteMeal(index: number) {
    const selectedDayPlan = this.getSelectedDayPlan();
    selectedDayPlan.meals.splice(index, 1);
    this.saveMealPlans();
  }

  mealChanged(index: number , meal: Meal) {
    const selectedDayPlan = this.getSelectedDayPlan();
    selectedDayPlan.meals[index] = { ...meal };
    selectedDayPlan.meals.sort((a, b) => a.time.localeCompare(b.time));
  }

  copiarPlanoParaDias() {
    const planoOrigem = this.getSelectedDayPlan();
    if (!planoOrigem) return;

    for (const offset of this.dayOffsets) {
      const date = this.getDateByOffset(offset);
      const dayName = this.getDayNameFromDate(date, 'en-US');

      if (this.diasSelecionados[dayName] && dayName !== planoOrigem.day) {
        const index = this.mealPlans.findIndex(p => p.day === dayName);
        const novoPlano: DayPlan = {
          day: dayName,
          meals: structuredClone(planoOrigem.meals)
        };
        if (index !== -1) {
          this.mealPlans[index] = novoPlano;
        } else {
          this.mealPlans.push(novoPlano);
        }
      }
    }

    this.copyModal.close();
    this.diasSelecionados = {};
  }

  calculateMealNutrition(meal: Meal) {
    return this.nutritionCalculator.sumMeal(meal);
  }

  calculateDayNutrition(dayPlan: DayPlan) {
    return this.nutritionCalculator.sumMeals(dayPlan.meals);
  }

  copyMealToRecord(meal: Meal) {
    const dayLabel = this.getDayNameFromDate(this.selectedDate, 'en-US');
    this.router.navigate(['/record-meal-editor'], {
      state: {
        meal: structuredClone(meal),
        date : this.selectedDate.toLocaleDateString('en-CA')
      }
    });
  }

  saveMealPlans() {
    this.dataService.saveData('meal-plans', this.mealPlans);
  }
}



