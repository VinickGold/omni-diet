import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTrackerComponent } from './exercice-tracker.component';

describe('ExercicesComponent', () => {
  let component: ExerciseTrackerComponent;
  let fixture: ComponentFixture<ExerciseTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
