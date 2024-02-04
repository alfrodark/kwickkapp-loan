import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanPayment } from '../../models/payment.model';

@Component({
  selector: 'app-edit-loan-payment-dialog',
  templateUrl: './edit-loan-payment-dialog.component.html',
  styleUrl: './edit-loan-payment-dialog.component.css'
})
export class EditLoanPaymentDialogComponent {

  loanPaymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditLoanPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { payment: LoanPayment }
  ) {
    this.loanPaymentForm = this.fb.group({
      paymentAmount: [data.payment.paymentAmount, [Validators.required, Validators.min(0)]],
      paymentDate: [data.payment.paymentDate, [Validators.required]],
      // Add other form controls as needed
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.loanPaymentForm.valid) {
      const updatedLoanPayment: Partial<LoanPayment> = {
        paymentAmount: this.loanPaymentForm.value.paymentAmount,
        paymentDate: this.loanPaymentForm.value.paymentDate,
        // Add other properties as needed
      };

      this.dialogRef.close(updatedLoanPayment);
    }
  }
}
