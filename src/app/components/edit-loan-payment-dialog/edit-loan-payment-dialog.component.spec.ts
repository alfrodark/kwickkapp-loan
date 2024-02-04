import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanPaymentDialogComponent } from './edit-loan-payment-dialog.component';

describe('EditLoanPaymentDialogComponent', () => {
  let component: EditLoanPaymentDialogComponent;
  let fixture: ComponentFixture<EditLoanPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLoanPaymentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLoanPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
