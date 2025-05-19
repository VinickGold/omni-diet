import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DayPlan, FoodEntry, ImportedFood, Meal, ProfileData } from '../../models/models';
import { FoodSearchComponent } from '../food-search-bar/food-search-bar.component';

@Component({
  selector: 'app-meal-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule , ReactiveFormsModule],
  templateUrl: './meal-plan.component.html',
  providers: [DataStorageService],
})
export class MealPlanComponent implements OnInit {

  Math = Math;
  importedFoods: ImportedFood[] = [];
  profileData: ProfileData | null = null;
  selectedDay: string = 'Monday'; // Default to Monday
  mealPlans: DayPlan[] = [];
  newMealName: string = '';
  newMealTime: string = new Date().toISOString().substring(11, 16); // Default to current time
  newFoodDescription: string = '';
  newFoodQuantity: number | null = null;
  newFoodUnit: string = 'g'; // Default to grams
  selectedMealIndex: number | null = null;

  predefinedMeals: Meal[] = [
    new Meal('Café', '08:00'),
    new Meal('Lanche Manhã', '10:00'),
    new Meal('Almoço', '12:00'),
    new Meal('Lanche Tarde', '15:00'),
    new Meal('Ceia', '18:00'),
    new Meal('Janta', '21:00'),
  ];

  constructor(private dataService: DataStorageService) {}

  foodSearchText: string = '';
filteredFoods: ImportedFood[] = [];
selectedFood: ImportedFood | null = null;

abrirCopia = false;
diasSemana = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
diasSelecionados: { [key: string]: boolean } = {};

copiarPlanoParaDias() {
  
  const planoOrigem = this.getSelectedDayPlan();

  if (!planoOrigem) return;

  for (const dia of this.diasSemana) {
    if (this.diasSelecionados[dia] && dia !== planoOrigem.day) {
      const index = this.mealPlans.findIndex(p => p.day === dia);
      const novoPlano: DayPlan = {
        day: dia,
        meals: JSON.parse(JSON.stringify(planoOrigem.meals)), // deep copy
      };
      if (index !== -1) {
        this.mealPlans[index] = novoPlano;
      } else {
        this.mealPlans.push(novoPlano);
      }
    }
  }

  // this.saveMealPlans();

  console.log(this.mealPlans);
  this.abrirCopia = false;
  this.diasSelecionados = {}; // limpa seleção
}

onFoodSearchChange() {
  
  const query = this.foodSearchText.toLowerCase();
  console.log(query);

  this.filteredFoods = (query.length >= 3) ? this.importedFoods.filter(f =>
    f.description.toLowerCase().includes(query)
  ): [];
}

selectFood(food: any) {
  this.selectedFood = food;
  this.foodSearchText = food.description;
  this.filteredFoods = [];
}

profileGoals = { calories: 2000, protein: 130, carbs: 250, fat: 70 }; // exemplo

  ngOnInit() {
    this.loadMealPlans();
    this.loadImportedFoods();
    this.loadProfileData();
  }

  loadImportedFoods() {
    const foods = this.dataService.loadData<ImportedFood[]>('importedFoods');
    this.importedFoods = foods ?? [];
  }
  
  loadProfileData() {
    const profile = this.dataService.loadData<ProfileData>('profileData');
    this.profileData = profile ?? null;
  }

  calculateMealNutrition(meal: Meal) {
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
    for (const food of meal.foods) {
      const matched = this.importedFoods.find(f => f.description.toLowerCase() === food.food.description.toLowerCase());
      if (matched) {
        const factor = food.quantity / 100;
        total.calories += matched.calories * factor;
        total.protein += matched.protein * factor;
        total.carbs += matched.carbs * factor;
        total.fat += matched.fat * factor;
      }
    }
  
    return total;
  }

  calculateDayNutrition(dayPlan: DayPlan) {
    const total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
    for (const meal of dayPlan.meals) {
      const mealTotal = this.calculateMealNutrition(meal);
      total.calories += mealTotal.calories;
      total.protein += mealTotal.protein;
      total.carbs += mealTotal.carbs;
      total.fat += mealTotal.fat;
    }
  
    return total;
  }

  criarRefeicao(meal: Meal): void {
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

  addMeal() {
    const selectedDayPlan = this.getSelectedDayPlan();
  
    if (this.newMealName && this.newMealTime) {
      // Verifica se já existe uma refeição no mesmo horário com o mesmo nome
      const exists = selectedDayPlan.meals.some(
        (m) =>
          m.time === this.newMealTime &&
          m.name.toLowerCase() === this.newMealName.toLowerCase()
      );
  
      if (exists) {
        alert(`Já existe uma refeição chamada "${this.newMealName}" às ${this.newMealTime}.`);
        return;
      }
  
      // Adiciona a nova refeição
      selectedDayPlan.meals.push(new Meal(this.newMealName, this.newMealTime));
      selectedDayPlan.meals.sort((a, b) => a.time.localeCompare(b.time));
      this.saveMealPlans();
  
      // Limpa os campos
      this.newMealName = '';
      this.newMealTime = new Date().toISOString().substring(11, 16); // Reset para hora atual
    }
  }

  addFoodToMeal() {
    if (this.selectedMealIndex !== null && this.selectedFood && this.newFoodQuantity) {
      const entry = new FoodEntry(
        this.selectedFood,
        this.newFoodQuantity,
        this.newFoodUnit
      );
  
      const selectedDayPlan = this.getSelectedDayPlan();
      selectedDayPlan.meals[this.selectedMealIndex].foods.push(entry);
      this.saveMealPlans();
  
      // Limpar campos
      this.selectedFood = null;
      this.foodSearchText = '';
      this.newFoodQuantity = null;
      this.newFoodUnit = 'g';
    }
  }

  deleteMeal(index: number) {
    const selectedDayPlan = this.getSelectedDayPlan();
    selectedDayPlan.meals.splice(index, 1);
    this.saveMealPlans();
  }

  deleteFood(mealIndex: number, foodIndex: number) {
    const selectedDayPlan = this.getSelectedDayPlan();
    selectedDayPlan.meals[mealIndex].foods.splice(foodIndex, 1);
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

  loadMealPlans() {
    const data = this.dataService.loadData<DayPlan[]>('meal-plans');
    this.mealPlans = data ?? [];
  }

  getMealCalories(meal: Meal): number {
    return meal.foods.reduce((sum, f) =>
      sum + (f.food.calories * f.quantity / (f.food.baseQuantity ?? 100)), 0);
  }
  
  getMealProtein(meal: Meal): number {
    return meal.foods.reduce((sum, f) =>
      sum + (f.food.protein * f.quantity / (f.food.baseQuantity ?? 100)), 0);
  }
  
  getMealFat(meal: Meal): number {
    return meal.foods.reduce((sum, f) =>
      sum + (f.food.fat * f.quantity / (f.food.baseQuantity ?? 100)), 0);
  }
  
  getMealCarbs(meal: Meal): number {
    return meal.foods.reduce((sum, f) =>
      sum + (f.food.carbs * f.quantity / (f.food.baseQuantity ?? 100)), 0);
  }
}
