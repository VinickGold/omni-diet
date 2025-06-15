import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DailyPlanSnapshot, Meal } from '../../models/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'metrics-panel',
  standalone: true,
  templateUrl: './record-metrics.component.html',
  imports: [CommonModule, FormsModule]
})
export class MetricsPanelComponent implements OnChanges , OnInit {
  @Input() history: DailyPlanSnapshot[] = [];

  totalPlannedCalories = 0;
  totalExecutedCalories = 0;
  calorieBalance = 0;
  totalProtein = 0;
  totalCarbs = 0;
  totalFat = 0;
  totalFibers = 0;
  daysWithExecutedPlan = 0;
  daysWithinCalorieRange = 0;

  selectedRange: 'today'  | 'yesterday' | '7days' | '30days' | 'custom' = 'today';
  customStartDate: string = '';
  customEndDate: string = '';

  ngOnInit(): void {
    console.log('TESTE')
    this.onDateRangeChange();
  }

  ngOnChanges(): void {
    this.calculateMetrics();
  }

  onDateRangeChange() {
    const today = new Date();
    let startDate: Date;
    let endDate = today;

    switch (this.selectedRange) {
      case 'today':
        startDate = endDate;
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(today);
        endDate.setDate(today.getDate() - 1);
        break;
      case '7days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        break;
      case '30days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
        break;
      case 'custom':
        return; // Só calcula via change nos inputs
    }

    this.customStartDate = this.formatDate(startDate);
    this.customEndDate = this.formatDate(endDate);
    this.calculateMetrics();
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-CA'); //.toISOString().split('T')[0];

  }

  public calculateMetrics(): void {
    this.resetMetrics();
    const tolerance = 150;

    const filtered = this.history.filter(snapshot => {
      const date = new Date(snapshot.date);
      const start = new Date(this.customStartDate);
      const end = new Date(this.customEndDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });

    for (const snapshot of filtered) {
      const plannedCalories = this.calculateCalories(snapshot.planned?.meals || []);
      const executedCalories = this.calculateCalories(snapshot.executed?.meals || []);

      this.totalPlannedCalories += plannedCalories;
      this.totalExecutedCalories += executedCalories;

      if (snapshot.executed?.meals?.length) {
        this.daysWithExecutedPlan++;

        if (Math.abs(plannedCalories - executedCalories) <= tolerance) {
          this.daysWithinCalorieRange++;
        }

        const nutrients = this.calculateNutrients(snapshot.executed.meals);
        this.totalProtein += nutrients.protein;
        this.totalCarbs += nutrients.carbs;
        this.totalFat += nutrients.fat;
        this.totalFibers += nutrients.fibers;
      }
    }

    this.calorieBalance = this.totalExecutedCalories - this.totalPlannedCalories;
  }

  private resetMetrics(): void {
    this.totalPlannedCalories = 0;
    this.totalExecutedCalories = 0;
    this.calorieBalance = 0;
    this.totalProtein = 0;
    this.totalCarbs = 0;
    this.totalFat = 0;
    this.totalFibers = 0;
    this.daysWithExecutedPlan = 0;
    this.daysWithinCalorieRange = 0;
  }

  private calculateCalories(meals: Meal[]): number {
    return meals.reduce((total, meal) =>
      total + meal.foods.reduce((sum, entry) =>
        sum + ((entry.food?.calories || 0) * (entry.quantity || 0) / 100), 0), 0);
  }

  private calculateNutrients(meals: Meal[]) {
    let protein = 0, carbs = 0, fat = 0, fibers = 0;

    meals.forEach(meal => {
      meal.foods.forEach(entry => {
        const factor = entry.quantity / 100;
        protein += (entry.food?.protein || 0) * factor;
        carbs   += (entry.food?.carbs || 0) * factor;
        fat     += (entry.food?.fat || 0) * factor;
        fibers  += (entry.food?.fibers || 0) * factor;
      });
    });

    return { protein, carbs, fat, fibers };
  }
}
