import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {CommonModule} from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ImportedFood } from '../../models/models';
import { FoodSearchComponent } from '../food-search-bar/food-search-bar.component';

@Component({
  selector: 'food-substitution',
  templateUrl: './food-substitution.component.html',
  standalone: true,
  imports: [RouterModule, FormsModule , CommonModule , FoodSearchComponent ],
  providers: [DataStorageService],
})
export class FoodSubstitutionComponent implements OnInit {

  importedFoods: ImportedFood[] = [];
  selectedFoods: { food: ImportedFood, quantity: number }[] = [];
  suggestions: any[] = [];

  tolerance = 0.15;

  constructor(private service: DataStorageService) {}

  ngOnInit(): void {
    this.importedFoods = this.service.loadData<ImportedFood[]>('importedFoods') ?? [];
  }

  onFoodSelected(food: any) {
  // onFoodSelected(food: ImportedFood) {
    if (!this.selectedFoods.find(f => f.food.id === food.id)) {
      this.selectedFoods.push({ food, quantity: food.baseQuantity || 100 });
      this.recalculateSuggestions();
    }
  }

  aaa(originalFood : any)
  {
    return this.suggestions.filter(s => s.original.id === originalFood.food.id)
  }

  removeFood(id: string) {
    this.selectedFoods = this.selectedFoods.filter(f => f.food.id !== id);
    this.recalculateSuggestions();
  }

  updateQuantity(id: string, newQuantity: number) {
    const item = this.selectedFoods.find(f => f.food.id === id);
    if (item) {
      item.quantity = newQuantity;
      this.recalculateSuggestions();
    }
  }

  recalculateSuggestions() {
    this.suggestions = [];

    for (const { food: original, quantity } of this.selectedFoods) {
      const candidates = this.importedFoods.filter(f => f.id !== original.id);
      const matches = candidates.filter(candidate =>
        this.isProportional(original, candidate, this.tolerance)
      );

      for (const candidate of matches.slice(0, 10)) {
        const caloriesPerGram = candidate.calories / (candidate.baseQuantity || 100);
        const originalCalories = original.calories * (quantity / (original.baseQuantity || 100));
        const adjustedQuantity = originalCalories / caloriesPerGram;

        const factor = adjustedQuantity / (candidate.baseQuantity || 100);

        this.suggestions.push({
          original,
          substitute: candidate,
          adjustedQuantity,
          macroDifferences: {
            protein: +(candidate.protein * factor - original.protein * (quantity / (original.baseQuantity || 100))).toFixed(2),
            carbs: +(candidate.carbs * factor - original.carbs * (quantity / (original.baseQuantity || 100))).toFixed(2),
            fat: +(candidate.fat * factor - original.fat * (quantity / (original.baseQuantity || 100))).toFixed(2),
          }
        });
      }
    }
  }






  getSuggestionsFor(original: ImportedFood) {
    return this.suggestions.filter(s => s.original.id === original.id);
  }



  // toggleSelection(food: ImportedFood, event: Event) {
  //   const checked = (event.target as HTMLInputElement).checked;
  //   if (checked) {
  //     this.selectedFoods.push(food);
  //   } else {
  //     this.selectedFoods = this.selectedFoods.filter(f => f !== food);
  //   }
  // }

  // suggestSubstitutions() {
  //   this.suggestions = [];
  
  //   for (const original of this.selectedFoods) {
  //     const candidates = this.importedFoods.filter(f => f.id !== original.id);
  
  //     const matches = candidates.filter(candidate =>
  //       this.isProportional(original, candidate, this.tolerance)
  //     );
  
  //     for (const candidate of matches.slice(0, 10)) {
  //       const adjustedQuantity = this.getAdjustedQuantity(original, candidate);
  
  //       const factor = adjustedQuantity / (candidate.baseQuantity || 100);
  
  //       this.suggestions.push({
  //         original,
  //         substitute: candidate,
  //         adjustedQuantity,
  //         macroDifferences: {
  //           protein: +(candidate.protein * factor - original.protein).toFixed(2),
  //           carbs: +(candidate.carbs * factor - original.carbs).toFixed(2),
  //           fat: +(candidate.fat * factor - original.fat).toFixed(2),
  //         }
  //       });
  //     }
  //   }
  // }

  private getMacroRatio(food: ImportedFood): { p: number; c: number; f: number } {
    const total = food.protein + food.carbs + food.fat;
  
    if (total === 0) {
      return { p: 0, c: 0, f: 0 }; // Ou talvez null e tratar na isProportional
    }
  
    return {
      p: food.protein / total,
      c: food.carbs / total,
      f: food.fat / total
    };
  }

  private isProportional(a: ImportedFood, b: ImportedFood, tolerance: number): boolean {
    const ra = this.getMacroRatio(a);
    const rb = this.getMacroRatio(b);
  
    // Validação básica
    if (
      [ra.p, ra.c, ra.f, rb.p, rb.c, rb.f].some(v => isNaN(v) || !isFinite(v))
    ) {
      console.log(`[isProportional] Razão inválida para alimentos: ${a.description} ou ${b.description}`);
      return false;
    }
  
    const diffP = Math.abs(ra.p - rb.p);
    const diffC = Math.abs(ra.c - rb.c);
    const diffF = Math.abs(ra.f - rb.f);
  
    const isValid =
      diffP <= tolerance &&
      diffC <= tolerance &&
      diffF <= tolerance;
  
    if (!isValid) {
      console.log(`[isProportional] Falha para '${a.description}' vs '${b.description}': ` +
        `Diff P: ${diffP.toFixed(3)}, C: ${diffC.toFixed(3)}, F: ${diffF.toFixed(3)} (tolerance: ${tolerance})`);
      console.log(`  Ratios A: p=${ra.p.toFixed(3)}, c=${ra.c.toFixed(3)}, f=${ra.f.toFixed(3)}`);
      console.log(`  Ratios B: p=${rb.p.toFixed(3)}, c=${rb.c.toFixed(3)}, f=${rb.f.toFixed(3)}`);
    }
  
    return isValid;
  }

  private getAdjustedQuantity(original: ImportedFood, substitute: ImportedFood): number {
    // Ajusta quantidade para equivaler em calorias
    const ratio = original.calories / substitute.calories;
    return (substitute.baseQuantity || 100) * ratio;
  }
}
