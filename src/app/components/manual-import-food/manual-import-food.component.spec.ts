import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFoodComponent} from './import-food.component';

describe('WaterIntakeComponent', () => {
  let component: ImportFoodComponent;
  let fixture: ComponentFixture<ImportFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
