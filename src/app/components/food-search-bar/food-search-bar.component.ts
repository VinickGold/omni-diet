import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImportedFood } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'food-search',
  templateUrl: './food-search-bar.component.html',
  imports: [FormsModule , CommonModule]
})
export class FoodSearchComponent {
  @Input() placeholder: string = 'Buscar alimento...';
  @Input() searchTerm: string = '';
  @Input() allFoods: ImportedFood[] = [];

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() foodSelected = new EventEmitter<ImportedFood>();

  onInputChange(value: string) {
    this.searchTerm = value;
    this.searchTermChange.emit(this.searchTerm);
  }

  filteredFoods(): ImportedFood[] {
    const term = this.searchTerm.toLowerCase();

    if(term.length < 3) return [];
    return this.allFoods
      .filter(f => f.description.toLowerCase().includes(term))
      .slice(0, 10);
  }

  

  selectFood(food: any) {
    this.foodSelected.emit(food);
    this.searchTerm = '';
    //this.filteredFoods = [];
  }
}