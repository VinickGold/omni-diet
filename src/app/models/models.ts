
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
  id: string,
  sexo: string,
  idade: number,
  peso: number,
  altura: number,
  nivelAtividade: string,
  objetivo: string,
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  fiberGoal: number;
  waterGoal: number;
}

export interface HomeMeasure {
  name: string;         // Ex: "colher de sopa", "xícara", "unidade"
  factor: number; // Quantos gramas ou ml essa quantidade representa
}

export interface ImportedFood {
  id: string;
  description: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibers: number;
  baseQuantity?: number;
  baseUnit?: string;
  micros?: Record<string, number>; // JSON de micronutrientes
  updatedAt?: string; // Para sync incremental

  homeMeasures?: HomeMeasure[];
}

export interface DailyPlanSnapshot  
{
  date: string;
  planned: DayPlan;
  executed?: DayPlan;
};


export class FoodEntry {
  constructor(
    public quantity: number,   // Quantidade em gramas
    public unit: string,        // Ex: "g", "ml"
    public food?: ImportedFood, // Referência ao alimento importado
  ) {}
}

export class Meal {
  constructor(public name: string, public time: string, public foods: FoodEntry[] = []) {}
}

export class DayPlan {
  constructor(public day: string, public meals: Meal[] = []) {}
}

export interface Meal {
  name: string;
  time: string;
  foods: FoodEntry[];
}

export interface ShoppingListItem {
  description: string;
  totalQuantity: number;
  unit: string;
}