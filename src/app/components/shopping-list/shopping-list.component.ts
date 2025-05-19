import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DayPlan, ShoppingListItem } from '../../models/models';



@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule , FormsModule , RouterModule],
  templateUrl: './shopping-list.component.html',
  providers: [DataStorageService],
})
export class ShoppingListComponent implements OnInit {
  shoppingList: ShoppingListItem[] = [];

  constructor(private dataService: DataStorageService) {}

  ngOnInit() {
    this.generateShoppingList();
  }

  

  generateShoppingList() {
    const mealPlans = this.dataService.loadData<DayPlan[]>('meal-plans') ?? [];
    const foodMap = new Map<string, ShoppingListItem>();

    mealPlans.forEach(dayPlan => {
      dayPlan.meals.forEach(meal => {
        meal.foods.forEach(foodEntry => {
          // Pega o food importado
          const food = foodEntry.food;
          if (!food) return;

          // Usa baseQuantity e baseUnit, ou defaults
          const baseQty = food.baseQuantity ?? 1;
          const unit = food.baseUnit ?? '';

          // Calcula a quantidade total proporcional à baseQuantity
          // Ex: se baseQuantity = 100g e no plano uso quantity=200, significa 2x baseQuantity
          //const quantityToAdd = (foodEntry.quantity * baseQty);
          const quantityToAdd = (foodEntry.quantity);

          // Chave para agrupar por descrição + unidade
          const key = `${food.description}-${unit}`;

          if (foodMap.has(key)) {
            foodMap.get(key)!.totalQuantity += quantityToAdd;
          } else {
            foodMap.set(key, {
              description: food.description,
              totalQuantity: quantityToAdd,
              unit: unit
            });
          }
        });
      });
    });

    // Converte para array para exibir
    this.shoppingList = Array.from(foodMap.values());
  }
}