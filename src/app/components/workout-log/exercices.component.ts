import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataStorageService } from '../../services/data-storage.service';
import { Exercise, Workout, WorkoutExercise } from '../../models/models';
import { Modal22Component } from '../app-modal/app-modal.component';
import { JsonLoaderService } from '../../services/json-loader.service';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { BootstrapNgSelectDirective } from '../../directives/ngselect-bootstrap.directive';

@Component({
  selector: 'app-exercices',
  templateUrl: './exercices.component.html',
  standalone: true,
  providers: [DataStorageService],
  imports: [RouterModule, FormsModule, CommonModule , Modal22Component , HttpClientModule , NgSelectModule , BootstrapNgSelectDirective ],
})
export class ExercicesComponent implements OnInit {

  filteredExerciseOptions: string[] = [];
  selectedMuscleGroup = '';
  submitted = false;

  @ViewChild('addModal') addModal!: Modal22Component;
  @ViewChild('createWorkoutModal') createWorkoutModal!: Modal22Component;
  @ViewChild('editModal') editModal!: Modal22Component;
  editableExercise: WorkoutExercise = {name: '' , load: 0 , reps: 0 , sets: 0 };
  editableExerciseIndex: number = -1;

  selectedWorkoutExercises: WorkoutExercise[] = [];
  workouts: Workout[] = [];
  selectedWorkoutName = '';
  newWorkoutName = '';




  exerciseOptions: string[] = []; // your full list
  filteredOptions: string[] = []; // current list after filter
  newExerciseName = '';

  updateSelectedWorkout() {
    const workout = this.workouts.find(w => w.name === this.selectedWorkoutName);
    this.selectedWorkoutExercises = workout?.exercises || [];
  }

  // newExerciseName = '';
  newSets: number | null = null;
  newReps: number | null = null;
  newLoad: number | null = null;

  private readonly STORAGE_KEY = 'training-log';
  private readonly SELECTED_TRAIN_KEY = 'selected-train';

  constructor(private storageService: DataStorageService , private jsonloader: JsonLoaderService) {}

  async ngOnInit() {

    this.jsonloader.setJsonPath('data/gym-exercices.json');
    this.exerciseOptions = await this.jsonloader.load<any>();
    this.filteredExerciseOptions = <string[]>Object.values(this.exerciseOptions).flat();

    this.exerciseOptions = this.filteredExerciseOptions; // your flattened list
    this.filteredOptions = [...this.exerciseOptions]; // initially show all

    this.workouts = this.storageService.loadData<Workout[]>(this.STORAGE_KEY) ?? [];

    const stored = this.storageService.loadData<string>(this.SELECTED_TRAIN_KEY);
    const fallback = this.workouts.length > 0 ? this.workouts[0].name : '';
    this.selectWorkout2(stored ?? fallback);

    this.newSets = 3;
    this.newReps = 12;
    this.newLoad = 0;
  }
  
  searchTerm = '';


  onCloseSelect() {
    //console.log('close');
    this.filteredOptions = [...this.filteredExerciseOptions];
    //console.log(this.filteredOptions);
  }
  // Filter options as user types
  onSearch(term: any): void {
    console.log(term);
    this.searchTerm = term.term;
    // if(term.term.length < 3)
    // {
    //   this.filteredOptions = [];
    //   this.showAddItem = false; 
    //   return;
    // }

    

    this.filteredOptions = this.exerciseOptions
      .filter(opt => opt.toLowerCase().includes(term.term.toLowerCase()))
      //.slice(0, 5); // limit to 5 results
    
      //this.showAddItem = this.filteredOptions.length === 0;
  }

  addCustomItem = (term: string) => {
    return this.showAddItem ? term : null;
  };

  showAddItem = true;


  addExercise(form: any): void {
    this.submitted = true;

    if (form.invalid) {
      // Formulário inválido, sai para mostrar erros
      return;
    }

    const workout = this.workouts.find(w => w.name === this.selectedWorkoutName);
    if (workout) {
      workout.exercises.push({
        name: this.newExerciseName,
        sets: this.newSets!,
        reps: this.newReps!,
        load: this.newLoad!,
      });

      form.resetForm({
        //muscleGroup: this.selectedMuscleGroup,
        sets: this.newSets,
        reps: this.newReps,
        load: this.newLoad
      });

      //this.newExerciseName = '';
      //this.selectedMuscleGroup = '';
      //this.filteredExerciseOptions = [];
      this.submitted = false;

      
      
      this.save();
      this.addModal.close();
    }
  }

  ngOnDestroy(): void {
    console.log("DESTROY");
    
    this.save(); // Salva automaticamente ao sair do componente
  }

  onWorkoutChange(selected: string) {
    console.log('Workout selecionado:', selected);
    this.updateSelectedWorkout();
    // Aqui você pode fazer outras ações como carregar os exercícios do treino, etc.
  }

  addWorkout(): void {
    if (this.newWorkoutName && !this.workouts.find(w => w.name === this.newWorkoutName)) {
      this.workouts.push({ name: this.newWorkoutName, exercises: [] });

      this.selectWorkout2(this.newWorkoutName);
      this.newWorkoutName = '';

      this.save();
      this.createWorkoutModal.close();
    }
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
      // Remove the selected workout
      this.workouts = this.workouts.filter(w => w.name !== this.selectedWorkoutName);

      // Select the last remaining workout, if any
      this.selectedWorkoutName = this.workouts.length
        ? this.workouts[this.workouts.length - 1].name
        : '';

      this.selectWorkout2(this.selectedWorkoutName);

      this.save();
    }
  }

  deleteExercise(index: number): void {
    const workout = this.workouts.find(w => w.name === this.selectedWorkoutName);
    if (workout) {
      workout.exercises.splice(index, 1);
      this.save();
    }

    if(this.editableExercise)
    {
      this.editModal.close();
    }
  }

  save(): void {
    this.storageService.saveData(this.SELECTED_TRAIN_KEY, this.selectedWorkoutName);
    this.storageService.saveData(this.STORAGE_KEY, this.workouts);
  }

  openEditModal(exercise: any, index: number) {
    // Clone o exercício para edição local
    this.editableExercise = { ...exercise };
    this.editableExerciseIndex = index;
    this.editModal.open();
  }

  updateExercise(form: NgForm) {
    if (form.valid && this.editableExerciseIndex > -1) {
      // Atualiza os dados do exercício original
      this.selectedWorkoutExercises[this.editableExerciseIndex] = { ...this.editableExercise };
      this.editModal.close();
    }
  }
}
