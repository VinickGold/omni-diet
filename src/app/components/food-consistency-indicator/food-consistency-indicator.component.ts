import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ImportedFood {
  protein: number;
  carbs: number;
  fat: number;
  fibers: number;
  calories: number;
}

@Component({
  selector: 'food-macros-indicator',
  templateUrl: './food-consistency-indicator.component.html',
  imports: [CommonModule , FormsModule],
  standalone: true
})
export class FoodConsistencyIndicatorComponent {
  @Input() food!: ImportedFood;
  @Input() tolerance: number = 10;

  isConsistent(): boolean 
  {

    return this.isCaloriesConsistent(this.food)
  }

  isCaloriesConsistent(food: ImportedFood, tolerance: number = 10): boolean 
  {

    const estimatedCalories = (food.protein * 4) + ((food.carbs - food.fibers) * 4) + (food.fat * 9) + (food.fibers * 2);

    //console.log('Calorias estimadas: ' , estimatedCalories);

    const totalTolerance = tolerance;

    const diff = Math.abs(estimatedCalories - food.calories);
    const percentDiff = (diff / (food.calories || 1)) * 100;

    return percentDiff <= totalTolerance;
  }
}