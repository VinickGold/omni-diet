import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseCsvImportComponent } from './exercice-csv-importer.component';

describe('ExercicesComponent', () => {
  let component: ExerciseCsvImportComponent;
  let fixture: ComponentFixture<ExerciseCsvImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseCsvImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseCsvImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
