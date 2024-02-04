import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanTransactionService } from '../../services/loan-transaction.service';
import { LoanPayment } from '../../models/payment.model';
import { Loan } from '../../models/loan.model';
import { LoanService } from '../../services/loan.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loan-transaction-form',
  templateUrl: './loan-transaction-form.component.html',
  styleUrl: './loan-transaction-form.component.css'
})
export class LoanTransactionFormComponent implements OnInit {

  @Input()
  loanId!: string | any;
  @Input()
  clientId!: string | any;
  transactionForm!: FormGroup;

  userData: any;
  user!: Observable<User> | any;

  userId: string | any = null;
  loans: Loan[] | any = [];
  selectedLoan: Loan | any = null;
  remainingBalance: number | any = null;
  paymentAmount!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loanService: LoanService,
    private auth: AngularFireAuth
    ) {
      this.route.paramMap.subscribe(params => {
        this.clientId = params.get('clientId');
      });

      this.route.paramMap.subscribe(params => {
        this.loanId = params.get('loanId');
      });
    }

  ngOnInit() {
    this.auth.user.subscribe(userData => {
      this.user = userData;
      this.loadLoans();
  });

  this.route.params.subscribe(params => {
    this.clientId = params['clientId'];
    console.log(this.clientId!);
   });

  }

  loadLoans(): void {
    if (this.userId) {
      this.loanService.getLoans(this.clientId).subscribe((loans) => {
        this.loans = loans;
      });
    }
  }



  addPayment(paymentAmount: number): void {
    if (this.selectedLoan) {
      const paymentNumber = this.selectedLoan.payments?.length || 0;
      const payment: LoanPayment = {
        paymentNumber: paymentNumber + 1,
        paymentAmount: paymentAmount,
        paymentDate: new Date(),
        clientId: '',
        loanId: '',
        loanBalance: 0,
        initialLoanAmount: 0
      };

      this.loanService.addPayment(this.selectedLoan.id!, payment).then(() => {
      });
    }
  }

  deletePayment(paymentNumber: number): void {
    if (this.selectedLoan) {
      this.loanService.deletePayment(this.selectedLoan.id!, paymentNumber).then(() => {
      });
    }
  }

}
