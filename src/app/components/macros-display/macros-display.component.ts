import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibers?: number;
}

@Component({
  selector: 'macros-display',
  templateUrl: './macros-display.component.html',
  imports: [CommonModule],
  standalone: true
})
export class MacrosDisplayComponent {
  @Input() data!: Macros;
  @Input() showFibers: boolean = false;
  @Input() calorieGoal?: number;

  get caloriePercentage(): number | null {
    if (!this.calorieGoal || this.calorieGoal === 0) return null;
    return (this.data.calories / this.calorieGoal) * 100;
  }
}