import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OpenFoodFactsService } from '../../services/food-import.service';
import { HttpClientModule } from '@angular/common/http';
import { ManualImportedFoodFormComponent } from '../manual-import-food/manual-import-food.component'; // ajuste o path
import { ImportedFood } from '../../models/models';
import { IndexedDbWrapperService } from '../../services/indexed-db.service';
import { FoodSyncService } from '../../services/food-sync.service';
import { v4 as uuidv4 } from 'uuid';
import { FoodConsistencyIndicatorComponent } from '../food-consistency-indicator/food-consistency-indicator.component';
import { MacrosDisplayComponent } from '../macros-display/macros-display.component';

@Component({
  selector: 'import-food',
  templateUrl: './import-food.component.html',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule, ManualImportedFoodFormComponent , FoodConsistencyIndicatorComponent , MacrosDisplayComponent],
  providers: [DataStorageService, OpenFoodFactsService],
})
export class ImportFoodComponent implements OnInit {

  showManualForm = false;
  loading = false;
  query = '';
  products: ImportedFood[] = [];
  importedFoods: ImportedFood[] = [];

  constructor(
    private openFoodFacts: OpenFoodFactsService,
    private storage: DataStorageService,
    private dbservice: IndexedDbWrapperService,
    private syncService: FoodSyncService
  ) {
    
  }

  async Sync(){
    this.syncService.sync();
  }

  async ngOnInit(): Promise<void> 
  {
    this.importedFoods = await this.dbservice.getAll<ImportedFood>('foods') || [];
    console.log(this.importedFoods);
    // this.importedFoods = this.storage.loadData('importedFoods') || [];
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
    const id = uuidv4();

    console.log(product);

    // Converter para ImportedFood
    const foodToSave: ImportedFood = {
      id,
      imageUrl: product.image_front_url ?? '',
      description: product.product_name || 'Unnamed product',
      calories: product.nutriments['energy-kcal_100g'] || product.nutriments.energy_100g || 0,
      protein: product.nutriments.proteins_100g || 0,
      fat: product.nutriments.fat_100g || 0,
      fibers: product.nutriments.fiber_100g,
      carbs: product.nutriments.carbohydrates_100g || 0,
      baseQuantity: 100,  // Padrão 100g porque os valores são para 100g
      baseUnit: 'g'
    };

    return foodToSave;
  }

  importFood(foodToSave: ImportedFood) {
    // Evitar duplicatas por id
    const exists = this.importedFoods.find(f => f.id === foodToSave.id);
    if (!exists) {
      this.importedFoods.push(foodToSave);

      foodToSave.updatedAt = new Date().toISOString();
      this.dbservice.add<ImportedFood>('foods' , foodToSave);
      //this.storage.saveData('importedFoods', this.importedFoods);
    } else {
      console.warn('Alimento já importado:', foodToSave.description);
    }
  }

  updateFood(updatedFood: ImportedFood) 
  {
    const index = this.importedFoods.findIndex(f => f.id === updatedFood.id);
    if (index !== -1) {
      updatedFood.updatedAt = new Date().toISOString();
      this.importedFoods[index] = updatedFood;
      this.dbservice.update<ImportedFood>('foods', updatedFood);
    } else {
      console.warn('Alimento para editar não encontrado:', updatedFood.description);
    }
  }

  async removeFood(id: string) {
    this.importedFoods = this.importedFoods.filter(f => f.id !== id);
    this.storage.saveData('importedFoods', this.importedFoods);
    await this.dbservice.delete('foods' , id);
  }

  async handleManualAdd(food: ImportedFood) {
    console.log('Adicionando Alimento:' , food);
    this.importedFoods.push(food);
    this.storage.saveData('importedFoods', this.importedFoods);
    await this.dbservice.add('foods', food);
     this.showManualForm = false;
  }

  print(e:any){ console.log(e);}
}