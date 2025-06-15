import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal22Component } from '../app-modal/app-modal.component';
import { MacrosDisplayComponent } from '../macros-display/macros-display.component';
import { FoodEntry, ImportedFood, Meal } from '../../models/models';
import { REALTIME_CHANNEL_STATES } from '@supabase/supabase-js';
import { NutritionCalculatorService } from '../../services/nutition-calculator.service';

@Component({
  selector: 'meal-edit',
  templateUrl: './meal-edit.component.html',
  imports: [CommonModule, FormsModule, MacrosDisplayComponent , Modal22Component],
  providers: [NutritionCalculatorService],
  standalone: true,
})
export class MealEditComponent {

  @ViewChild('editMealModal') editMealModal: any;
  editingMeal: any = null;
  selectedMealIndexForEdit: number = -1;

  @ViewChild('editFoodModal') editFoodModal: any;
  editingFood: FoodEntry = { quantity: 0 , unit: '' };
  editingMealIndex: number = -1;
  editingFoodIndex: number = -1;

  @ViewChild('addFoodModal') addFoodModal!: Modal22Component;
  newFoodDescription: string = '';
  newFoodQuantity: number | null = null;
  newFoodUnit: string = 'g'; // Default to grams
  foodSearchText: string = '';
  filteredFoods: ImportedFood[] = [];
  selectedFood: ImportedFood | null = null;
  //selectedMealIndex: number | null = null;

  @Input() meal!: Meal;
  @Input() mealIndex!: number;
  @Input() showRecordBtn: boolean = false;
  @Input() profileData: any;
  @Input() foodList!: ImportedFood[];

  @Output() editMeal = new EventEmitter<number>();
  
  @Output() addMealToExecution = new EventEmitter<any>();
  @Output() editFood = new EventEmitter<{ mealIndex: number; foodIndex: number }>();
  @Output() deleteFood = new EventEmitter<{ mealIndex: number; foodIndex: number }>();
  @Output() addFood = new EventEmitter<number>();

  @Output() deleteMeal = new EventEmitter<number>();
  @Output() mealChanged = new EventEmitter<Meal>();

  constructor(private macrosService : NutritionCalculatorService){}

  calculateMealNutrition(meal: Meal) {

    return this.macrosService.sumMeal(meal);
    // let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
    // for (const food of meal.foods) {
    //   const matched = food.food; // this.importedFoods.find(f => f.description.toLowerCase() === food.food.description.toLowerCase());
    //   if (matched) {
    //     const factor = food.quantity / 100;
    //     total.calories += matched.calories * factor;
    //     total.protein += matched.protein * factor;
    //     total.carbs += matched.carbs * factor;
    //     total.fat += matched.fat * factor;
    //   }
    // }
  
    // return total;
  }

  openAddFoodModal()
  {
    //selectedMealIndex = $event; 
    this.addFoodModal.open();
  }

  openEditMealModal() 
  {
    this.editingMeal = { ...this.meal };
    this.editMealModal.open();
  }

  saveEditedMeal() 
  {
    this.editMealModal.close();
    this.meal = { ...this.editingMeal }
    this.editingMeal = null;
    this.mealChanged.emit(this.meal);
  }

  deleteEditingFood() 
  {
    this.meal.foods.splice(this.editingFoodIndex, 1);
    this.editFoodModal.close();
    this.mealChanged.emit(this.meal);
  }

  saveEditedFood() 
  {
    this.meal.foods[this.editingFoodIndex] = {...this.editingFood};
    this.editFoodModal.close();
    this.mealChanged.emit(this.meal);
  }

  openEditFoodModal(foodIndex: number) 
  {
    this.editingFoodIndex = foodIndex;
    const foodClone = {...this.meal.foods[foodIndex]};
    this.editingFood = foodClone;
    this.editFoodModal.open();
  }

  selectFood(food: ImportedFood) {
    this.selectedFood = food;
    this.foodSearchText = food.description;
    this.filteredFoods = [];
  }

  onFoodSearchChange() {
    const query = this.foodSearchText.toLowerCase();
    this.filteredFoods = (query.length >= 3) ? this.foodList.filter(f => f.description.toLowerCase().includes(query)): [];
  }

  addFoodToMeal() {
    if (this.selectedFood && this.newFoodQuantity) 
    {
      const entry = new FoodEntry(
        this.newFoodQuantity,
        this.newFoodUnit,
        this.selectedFood
      );
  
      this.meal.foods.push(entry);
  
      // Limpar campos
      this.selectedFood = null;
      this.foodSearchText = '';
      this.newFoodQuantity = null;
      this.newFoodUnit = 'g';


      this.addFoodModal.close();
      this.mealChanged.emit(this.meal);
      
    }
  }
}