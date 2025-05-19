import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSubstitutionComponent } from './food-substitution.component';

describe('ProfileComponent', () => {
  let component: FoodSubstitutionComponent;
  let fixture: ComponentFixture<FoodSubstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodSubstitutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodSubstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
