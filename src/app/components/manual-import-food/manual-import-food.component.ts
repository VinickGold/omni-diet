import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ImportedFood } from '../../models/models';
import { v4 as uuidv4 } from 'uuid';
import { Modal22Component } from '../app-modal/app-modal.component';
import { FoodConsistencyIndicatorComponent } from '../food-consistency-indicator/food-consistency-indicator.component';

@Component({
  selector: 'app-manual-imported-food-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Modal22Component, FoodConsistencyIndicatorComponent],
  templateUrl: './manual-import-food.component.html'
})
export class ManualImportedFoodFormComponent implements OnInit {

  @ViewChild('modal') public modal!: Modal22Component;
  @Output() add = new EventEmitter<ImportedFood>();
  foodToEdit?: ImportedFood;
  form!: FormGroup;
  tabIndex = 1;
  defaultFormValues: any;

  normalized = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fibers: 0,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      description: ['', Validators.required],
      imageUrl: [''],
      calories: [0, Validators.required],
      protein: [0, Validators.required],
      carbs: [0, Validators.required],
      fat: [0, Validators.required],
      fibers: [0],
      baseQuantity: [100],
      baseUnit: ['g'],
      homemadeMeasures: this.fb.array([])
    });

    this.defaultFormValues = structuredClone(this.form.getRawValue());

    this.form.valueChanges.subscribe(() => this.calculateNormalizedValues());
    this.calculateNormalizedValues(); // inicial
  }

  get homemadeMeasures(): FormArray {
    return this.form.get('homemadeMeasures') as FormArray;
  }

  addHomemadeMeasure(): void {
    this.homemadeMeasures.push(
      this.fb.group({
        name: ['', Validators.required],
        factor: [0, Validators.required]
      })
    );
  }

  removeHomemadeMeasure(index: number): void {
    this.homemadeMeasures.removeAt(index);
  }

  private calculateNormalizedValues(): void {
    const { calories, protein, carbs, fat, fibers, baseQuantity } = this.form.value;
    const factor = 100 / (baseQuantity || 100);

    this.normalized = {
      calories: +(calories * factor).toFixed(2),
      protein: +(protein * factor).toFixed(2),
      carbs: +(carbs * factor).toFixed(2),
      fat: +(fat * factor).toFixed(2),
      fibers: +(fibers * factor).toFixed(2)
    };
  }

  submitForm(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;

    const newFood: ImportedFood = {
      id: this.foodToEdit?.id || uuidv4(),
      updatedAt: new Date().toISOString(),
      ...formValue,
      calories: this.normalized.calories,
      protein: this.normalized.protein,
      carbs: this.normalized.carbs,
      fat: this.normalized.fat,
      baseQuantity: 100
    };

    this.add.emit(newFood);
    this.form.reset(this.defaultFormValues);
    this.homemadeMeasures.clear();
    this.modal.close();
    this.foodToEdit = undefined;
  }

  openForEdit(food: ImportedFood) {
    this.foodToEdit = food;
    this.form.patchValue(food);

    this.homemadeMeasures.clear();
    if (food.homeMeasures?.length) {
      food.homeMeasures.forEach(m =>
        this.homemadeMeasures.push(this.fb.group({
          name: [m.name, Validators.required],
          factor: [m.factor, Validators.required]
        }))
      );
    }

    this.modal.open();
  }
}
