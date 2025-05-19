import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataStorageService } from '../../services/data-storage.service';
import { Workout, WorkoutExercise } from '../../models/models';



@Component({
  selector: 'app-exercices',
  templateUrl: './exercices.component.html',
  standalone: true,
  providers: [DataStorageService],
  imports: [RouterModule, FormsModule, CommonModule],
})
export class ExercicesComponent implements OnInit {

  selectedWorkoutExercises: WorkoutExercise[] = [];
  workouts: Workout[] = [];
  selectedWorkoutName = '';
  newWorkoutName = '';

  updateSelectedWorkout() {
    const workout = this.workouts.find(w => w.name === this.selectedWorkoutName);
    this.selectedWorkoutExercises = workout?.exercises || [];
  }

  

  // Lista fixa dos exercícios mais comuns
  exerciseOptions: string[] = [
    'Supino reto', 'Agachamento', 'Levantamento terra', 'Puxada na barra fixa',
    'Remada curvada', 'Desenvolvimento com halteres', 'Rosca direta',
    'Tríceps pulley', 'Leg press', 'Elevação lateral', 'Abdominal crunch',
    'Stiff', 'Cadeira extensora', 'Cadeira flexora', 'Puxada frente',
  ];

  newExerciseName = '';
  newSets: number | null = null;
  newReps: number | null = null;
  newLoad: number | null = null;

  private readonly STORAGE_KEY = 'training-log';
  private readonly SELECTED_TRAIN_KEY = 'selected-train';

  constructor(private storageService: DataStorageService) {}

  ngOnInit(): void {
    this.workouts = this.storageService.loadData<Workout[]>(this.STORAGE_KEY) ?? [];
    this.selectWorkout2(this.storageService.loadData<string>(this.SELECTED_TRAIN_KEY) ?? '');

    this.newSets = 3;
    this.newReps = 12;
    this.newLoad = 0;
  }

  ngOnDestroy(): void {
    console.log("DESTROY");
    this.storageService.saveData(this.SELECTED_TRAIN_KEY, this.selectedWorkoutName);
    this.save(); // Salva automaticamente ao sair do componente
  }

  addWorkout(): void {
    if (this.newWorkoutName && !this.workouts.find(w => w.name === this.newWorkoutName)) {
      this.workouts.push({ name: this.newWorkoutName, exercises: [] });

      this.selectWorkout2(this.newWorkoutName);
      this.newWorkoutName = '';
      this.save();

    }
  }

  selectWorkout(name: string): void {
    this.selectedWorkoutName = name;
    this.newExerciseName = '';
    this.newSets = null;
    this.newReps = null;
    this.newLoad = null;
  }

  selectWorkout2(name: string) {
    this.selectedWorkoutName = name;
    this.updateSelectedWorkout(); // atualiza a lista de exercícios
  }

  editWorkoutName() {
    const current = this.selectedWorkoutName;
    const newName = prompt('Novo nome do treino:', current);
    if (newName && current !== newName) {
      const existing = this.workouts.find(w => w.name === newName);
      if (!existing) {
        const workout = this.workouts.find(w => w.name === current);
        if (workout) {
          workout.name = newName;
          this.selectedWorkoutName = newName;
          this.save();
        }
      } else {
        alert('Já existe um treino com esse nome.');
      }
    }
  }

  deleteWorkout() {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
      this.workouts = this.workouts.filter(w => w.name !== this.selectedWorkoutName);
      this.selectedWorkoutName = '';
      this.save();
    }
  }

  addExercise(): void {
    const workout = this.workouts.find(w => w.name === this.selectedWorkoutName);
    if (workout && this.newExerciseName && this.newSets && this.newReps && this.newLoad !== null) {
      workout.exercises.push({
        name: this.newExerciseName,
        sets: this.newSets,
        reps: this.newReps,
        load: this.newLoad,
      });

      this.newExerciseName = '';
      //this.newSets = null;
      //this.newReps = null;
      //this.newLoad = null;

      this.save();
    }
  }

  deleteExercise(index: number): void {
    const workout = this.workouts.find(w => w.name === this.selectedWorkoutName);
    if (workout) {
      workout.exercises.splice(index, 1);
      this.save();
    }
  }

  save(): void {
    this.storageService.saveData(this.STORAGE_KEY, this.workouts);
  }
}
