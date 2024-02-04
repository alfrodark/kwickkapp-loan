import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPaymentFormDialogComponent } from './loan-payment-form-dialog.component';

describe('LoanPaymentFormDialogComponent', () => {
  let component: LoanPaymentFormDialogComponent;
  let fixture: ComponentFixture<LoanPaymentFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanPaymentFormDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanPaymentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
