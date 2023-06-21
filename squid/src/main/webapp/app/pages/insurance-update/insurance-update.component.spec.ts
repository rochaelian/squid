import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceUpdateComponent } from './insurance-update.component';

describe('InsuranceUpdateComponent', () => {
  let component: InsuranceUpdateComponent;
  let fixture: ComponentFixture<InsuranceUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceUpdateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
