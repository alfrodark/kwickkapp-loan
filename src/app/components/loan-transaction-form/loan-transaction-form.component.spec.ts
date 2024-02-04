import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTransactionFormComponent } from './loan-transaction-form.component';

describe('LoanTransactionFormComponent', () => {
  let component: LoanTransactionFormComponent;
  let fixture: ComponentFixture<LoanTransactionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanTransactionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
