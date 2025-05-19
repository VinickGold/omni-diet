import { Component } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OpenFoodFactsService } from '../../services/food-import.service';
import { HttpClientModule } from '@angular/common/http';
import { ManualImportedFoodFormComponent } from '../manual-import-food/manual-import-food.component'; // ajuste o path
import { ImportedFood } from '../../models/models';



@Component({
  selector: 'import-food',
  templateUrl: './import-food.component.html',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule, ManualImportedFoodFormComponent],
  providers: [DataStorageService, OpenFoodFactsService],
})
export class ImportFoodComponent {

  showManualForm = false;
  loading = false;
  query = '';
  products: ImportedFood[] = [];
  importedFoods: ImportedFood[] = [];

  constructor(
    private openFoodFacts: OpenFoodFactsService,
    private storage: DataStorageService
  ) {
    this.loadImportedFoods();
  }

  isCaloriesConsistent(food: ImportedFood, tolerance: number = 10): boolean {
    const estimatedCalories = (food.protein * 4) + (food.carbs * 4) + (food.fat * 9);
  
    // Cálculo da diferença percentual
    const diff = Math.abs(estimatedCalories - food.calories);
    const percentDiff = (diff / (food.calories || 1)) * 100;
  
    return percentDiff <= tolerance;
  }

  search() {
    if (!this.query.trim()) return;

    this.loading = true;
    this.products = [];

    this.openFoodFacts.searchFood(this.query).subscribe({
      next: (res: any) => {

        console.log(res);

        this.products = (res.products || [])
        .filter((p: any) =>
          //p.image_front_url &&
          p.nutriments &&
          (p.nutriments['energy-kcal_100g'] || p.nutriments.energy_100g)
        )
        .map((x: any) => this.productToImportedFood(x));

        // this.products = (res.products || []).filter((p: any) =>
        //   //p.image_front_url &&
        //   p.nutriments &&
        //   (p.nutriments['energy-kcal_100g'] || p.nutriments.energy_100g)
        // );
      },
      error: (err) => {
        console.error('Erro ao buscar alimentos:', err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  productToImportedFood(product: any): ImportedFood
  {
    const id = product.code ? product.code.toString() : Math.random().toString(36).substring(2, 9);

    // Converter para ImportedFood
    const foodToSave: ImportedFood = {
      id,
      imageUrl: product.image_front_url ?? '',
      description: product.product_name || 'Unnamed product',
      calories: product.nutriments['energy-kcal_100g'] || product.nutriments.energy_100g || 0,
      protein: product.nutriments.proteins_100g || 0,
      fat: product.nutriments.fat_100g || 0,
      fibers: 0,
      carbs: product.nutriments.carbohydrates_100g || 0,
      baseQuantity: 100,  // Padrão 100g porque os valores são para 100g
      baseUnit: 'g'
    };

    return foodToSave;
  }

  importFood(foodToSave: ImportedFood) {
    // // Usar product.code como id se existir, senão gerar um id simples
    // const id = product.code ? product.code.toString() : Math.random().toString(36).substring(2, 9);

    // // Converter para ImportedFood
    // const foodToSave: ImportedFood = {
    //   id,
    //   description: product.product_name || 'Unnamed product',
    //   calories: product.nutriments['energy-kcal_100g'] || product.nutriments.energy_100g || 0,
    //   protein: product.nutriments.proteins_100g || 0,
    //   fat: product.nutriments.fat_100g || 0,
    //   carbs: product.nutriments.carbohydrates_100g || 0,
    //   baseQuantity: 100,  // Padrão 100g porque os valores são para 100g
    //   baseUnit: 'g'
    // };

    //var foodToSave =  this.productToImportedFood(product);

    // Evitar duplicatas por id
    const exists = this.importedFoods.find(f => f.id === foodToSave.id);
    if (!exists) {
      this.importedFoods.push(foodToSave);
      this.storage.saveData('importedFoods', this.importedFoods);
    } else {
      console.warn('Alimento já importado:', foodToSave.description);
    }
  }

  removeFood(id: string) {
    this.importedFoods = this.importedFoods.filter(f => f.id !== id);
    this.storage.saveData('importedFoods', this.importedFoods);
  }
  handleManualAdd(food: ImportedFood) {
    this.importedFoods.push(food);
    this.storage.saveData('importedFoods', this.importedFoods);
    this.showManualForm = false;
  }

  loadImportedFoods() {
    this.importedFoods = this.storage.loadData('importedFoods') || [];
  }
}