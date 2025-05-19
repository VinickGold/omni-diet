import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataStorageService } from '../../services/data-storage.service';
import { Exercise } from '../../models/models';
import { ExerciseCsvImportComponent } from '../exercice-csv-importer/exercice-csv-importer.component';

@Component({
  selector: 'app-exercise-tracker',
  standalone: true,
  imports: [FormsModule , CommonModule , ExerciseCsvImportComponent],
  templateUrl: './exercice-tracker.component.html'
})
export class ExerciseTrackerComponent {

  caloriesBurned: number | null = null;
  exercisesList: string[] = [
    'Caminhada', 'Corrida', 'Bicicleta', 'Supino', 'Agachamento',
    'Puxada', 'Remada', 'Desenvolvimento', 'Abdominal', 'Avanço'
  ];

  selectedExercise: Exercise = { name: '', calories: 0 , date: new Date() };
  savedExercises: Exercise[] = [];

  private readonly STORAGE_KEY = 'exercises';

  constructor(private storage: DataStorageService) {}

  ngOnInit(): void {
    this.savedExercises = this.storage.loadData<Exercise[]>(this.STORAGE_KEY) || [];
  }

  addExercise(): void {
    if (!this.selectedExercise.name || this.selectedExercise.calories <= 0){
      console.log(this.selectedExercise)
      return;
    } 

    this.savedExercises.push({ ...this.selectedExercise });
    this.storage.saveData(this.STORAGE_KEY, this.savedExercises);
    this.selectedExercise = { name: '', calories: 0 , date: new Date() };
  }

  deleteExercise(index: number): void {
    this.savedExercises.splice(index, 1);
    this.storage.saveData(this.STORAGE_KEY, this.savedExercises);
  }

  getTotalCalories(): number {
    return this.savedExercises.reduce((total, ex) => total + ex.calories, 0);
  }

  onImport(imported: Exercise[]): void {
    // Mescla e salva os novos exercícios
    console.log('teste');
    this.savedExercises.push(...imported);
    this.storage.saveData(this.STORAGE_KEY, this.savedExercises);
  }
}
