import { Component, Inject, Input } from '@angular/core';
import { LoanPayment } from '../../models/payment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Loan } from '../../models/loan.model';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-payment-form-dialog',
  templateUrl: './loan-payment-form-dialog.component.html',
  styleUrl: './loan-payment-form-dialog.component.css'
})
export class LoanPaymentFormDialogComponent {

  @Input()
  loanId!: string;
  @Input()
  clientId!: string;
  loanPaymentForm!: FormGroup;
  selectedLoan: Loan | any = null;
  remainingBalance: number | any = null;
  paymentAmount!: number;

  displayedColumns: string[] = ['paymentId', 'paymentAmount', 'paymentDate', 'actions'];
  dataSource: LoanPayment[] = [];

  paymentCollection: AngularFirestoreCollection<LoanPayment>;

  payment: LoanPayment = {
    paymentId: '', clientId: '', loanId: '',
    paymentAmount: 0, loanBalance: 0, paymentDate: new Date(), initialLoanAmount: 0,
    paymentNumber: 0
  };

  payments: Observable<{paymentId?: string; clientId: string; loanId: string;
    paymentAmount: number; loanBalance: number; initialLoanAmount: number; paymentDate: Date;}> | any;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private loanService: LoanService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<LoanPaymentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { loanId: string, clientId: string }
  ) {

    this.paymentCollection = this.firestore.collection<LoanPayment>('loanPayments');
    this.payments = this.paymentCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as LoanPayment;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );


    console.log(this.clientId);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
