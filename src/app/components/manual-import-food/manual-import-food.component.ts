import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportedFood } from '../../models/models';
//import { v4 as uuidv4 } from 'uuid';



@Component({
  selector: 'app-manual-imported-food-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manual-import-food.component.html'
})
export class ManualImportedFoodFormComponent {
  @Output() add = new EventEmitter<ImportedFood>();

  food: Omit<ImportedFood, 'id'> = {
    description: '',
    imageUrl: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fibers: 0,
    baseQuantity: undefined,
    baseUnit: ''
  };

  submitForm() {
    const newFood: ImportedFood = {
      id: Math.random().toString(36).substring(2, 9),
      ...this.food
    };

    this.add.emit(newFood);
    this.resetForm();
  }

  private resetForm() {
    this.food = {
      description: '',
      imageUrl: '',
      calories: 0,
      protein: 0,
      fibers: 0,
      carbs: 0,
      fat: 0,
      baseQuantity: undefined,
      baseUnit: ''
    };
  }
}