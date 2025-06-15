import { Injectable } from '@angular/core';
import { FoodEntry, Meal } from '../models/models';


export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

@Injectable({
  providedIn: 'root'
})
export class NutritionCalculatorService {

  constructor() {}

  /** Soma os nutrientes de uma lista de alimentos */
  sumNutrition(foods: FoodEntry[]): NutritionTotals {
    return foods.reduce((acc, item) => {
      if (item.food) {
        const factor = item.quantity / 100;
        acc.calories += item.food.calories * factor;
        acc.protein += item.food.protein * factor;
        acc.carbs += item.food.carbs * factor;
        acc.fat += item.food.fat * factor;
      }
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  /** Soma os nutrientes de uma refeição */
  sumMeal(meal: Meal): NutritionTotals {
    return this.sumNutrition(meal.foods);
  }

  /** Soma os nutrientes de um array de refeições (um dia inteiro, por exemplo) */
  sumMeals(meals: Meal[]): NutritionTotals {
    return meals.reduce((acc, meal) => {
      const mealTotal = this.sumMeal(meal);
      acc.calories += mealTotal.calories;
      acc.protein += mealTotal.protein;
      acc.carbs += mealTotal.carbs;
      acc.fat += mealTotal.fat;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }
}
