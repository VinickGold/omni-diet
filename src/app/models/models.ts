// src/app/models/index.ts

// Modelo base para alimentos importados

  export interface Exercise {
    name: string;
    calories: number;
    date: Date;
  }

  export interface WorkoutExercise {
    name: string;
    sets: number;
    reps: number;
    load: number;
  }
  
  export interface Workout {
    name: string;
    exercises: WorkoutExercise[];
  }

  export interface ImportedFood {
    id: string;
    imageUrl: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    baseQuantity?: number; // Ex: 100 (gramas) ou 1 (unidade), se aplicável
    baseUnit?: string;     // Ex: "g", "ml", "unidade", etc.
  }

//   export interface ImportedFood {
//     id: string;
//     description: string;
//     calories: number;
//     protein: number;
//     carbs: number;
//     fat: number;
//     baseQuantity?: number;
//     baseUnit?: string;
//   }

export class WaterEntry {
  constructor(
    public amount: number,
    public time: string,
    public date: string // Add the date property
  ) {}
}

export interface ImportedExercise {
    name: string;
    durationMinutes: number;
    caloriesBurned: number;
    date: string; // Pode ser um Date, mas usamos string por simplicidade
    source: 'csv';
  }

export interface ProfileData {
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
}
export interface ImportedFood {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibers: number,
  baseQuantity?: number; // Ex: 100 (gramas) ou 1 (unidade), se aplicável
  baseUnit?: string;     // Ex: "g", "ml", "unidade", etc.
}

export class FoodEntry {
  constructor(
    public food: ImportedFood, // Referência ao alimento importado
    public quantity: number,   // Quantidade em gramas
    public unit: string        // Ex: "g", "ml"
  ) {}
}

export class Meal {
  constructor(public name: string, public time: string, public foods: FoodEntry[] = []) {}
}

export class DayPlan {
  constructor(public day: string, public meals: Meal[] = []) {}
}

// interface ImportedFood {
//   id: string;
//   description: string;
//   calories: number;
//   protein: number;
//   carbs: number;
//   fat: number;
//   baseQuantity?: number;
//   baseUnit?: string;
// }

// interface FoodEntry {
//   food: ImportedFood;  // Agora guarda o objeto ImportedFood inteiro
//   quantity: number;     // Quantidade usada no plano
// }

export interface Meal {
  name: string;
  time: string;
  foods: FoodEntry[];
}

// export interface DayPlan {
//   day: string;
//   meals: Meal[];
// }

export interface ShoppingListItem {
  description: string;
  totalQuantity: number;
  unit: string;
}
  

  
  // Você pode seguir este padrão para outros modelos, por exemplo:
  // export interface UserGoal { ... }
  // export interface MealPlan { ... }
  // export interface MacronutrientTarget { ... }