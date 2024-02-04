import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanPayment } from '../../models/payment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../auth/auth.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Loan } from '../../models/loan.model';
import { MatDialog } from '@angular/material/dialog';
import { LoanPaymentFormDialogComponent } from '../loan-payment-form-dialog/loan-payment-form-dialog.component';
import { EditLoanPaymentDialogComponent } from '../edit-loan-payment-dialog/edit-loan-payment-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../../models/user.model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  @Input()
  loanId!: string | any;
  @Input()
  clientId!: string | any;
  user!: Observable<User> | any;
  paymentId: string | any;
  loanPaymentForm!: FormGroup;

  loanAmount$!: Observable<Loan[]> | any;
  paymentDate!: Date;
  paymentAmount!: number;
  loanDetails: any;
  loanBalance!: Observable<number[]> | any;
  calculatedLoanBalance!: number;
  selectedLoan: Loan | any = null;
  remainingBalance: number | any = null;
  newBalance$!: number;

  userData: any;
  loans!: Observable<Loan[]> | any;
  newBalance!: Observable<number[]> | any;
  newLoanPayment!: number;
  loan: Loan[] | any = [];
  private unsubscribe$ = new Subject<void>();


  displayedColumns: string[] = ['paymentAmount', 'paymentDate', 'actions'];
  dataSource: LoanPayment[] = [];

  payment: LoanPayment = {
    paymentId: '', clientId: '', loanId: '',
    paymentAmount: 0, loanBalance: 0, paymentDate: new Date(), initialLoanAmount: 0,
    paymentNumber: 0
  };

  payments: Observable<{paymentId?: string; clientId: string; loanId: string;
    paymentAmount: number; loanBalance: number; initialLoanAmount: number; paymentDate: Date;}> | any;


  newPayment: LoanPayment = {
    paymentDate: new Date(), paymentAmount: this.newLoanPayment,
    clientId: '',
    loanId: '',
    loanBalance: this.newBalance,
    initialLoanAmount: 0,
    paymentNumber: 0
  };

  constructor(
    private dialog: MatDialog,
    private loanService: LoanService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    ) {

      this.route.paramMap.subscribe(params => {
        this.clientId = params.get('clientId');
      });
      this.route.paramMap.subscribe(params => {
        this.loanId = params.get('loanId');
      });


  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.userData = user;
      if (user) {
        this.route.params.subscribe((params) => {
          this.loanId = params['id'];
        });
        this.loadLoanDetails(this.loanId);

        this.paymentService.calculateLoanBalance(this.loanId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (balance: number) => {
            this.newBalance$ = this.loanDetails.loanAmount - balance;
          },
          (error) => {
            console.error('Error calculating loan balance:', error);
          }
        );

        this.loadLoanBalance();
        this.loadLoanPayments();

        this.createForm();
      }else {

      }
    });


    this.loadLoans();

    this.loanPaymentForm = this.fb.group({
      paymentDate: ['', Validators.required],
      paymentAmount: ['', Validators.required],
      loanBalance: ['', Validators.required],
    });

    // console.log('Loan ID:', this.loanId);
    // console.log('Client ID:', this.clientId);
    // console.log('Loan Balance:', );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadLoanDetails(loanId: string): void {
    this.loanService.getLoanById(loanId).subscribe((loan: any) => {
      this.loans = loan;
      this.loanDetails = loan;
      this.loadPayments();
      this.clientId = loan.clientId;
      this.loanId = loan.loanId;

    });
  }

  loadPayments(): void {
    this.loanService.getPaymentsForLoan(this.loanId).subscribe(payments => {
      this.payments = payments;
      // this.calculateLoanBalance();
    });
  }

  loadLoanBalance(): void {
    this.loanService.getLoanById(this.loanId).subscribe((loan: any) => {
      this.loanBalance = loan.loanBalance;
      this.loanPaymentForm.patchValue({ loanBalance: this.loanBalance });
    });
  }

  loadLoans(): void {
    if (this.userData) {
      this.loanService.getLoans(this.clientId).subscribe((loans) => {
        this.loan = loans;
      });
    }
  }

  loadLoanPayments(): void {
    this.paymentService.getPaymentById(this.clientId, this.loanId).subscribe((payments: any) => {
        this.payments = payments;
        // Implement your balance calculation logic here
        // You can use this.payments array to calculate the balance
      });
  }

  createForm(): void {
    this.loanPaymentForm = this.fb.group({
      paymentDate: ['', Validators.required],
      paymentAmount: ['', Validators.required],
      loanBalance: ['', Validators.required],
    });
  }

  addLoanPaymentDialog(): void {
    const dialogRef = this.dialog.open(LoanPaymentFormDialogComponent, {
      width: '400px',
      data: {
        loanId: this.loanId,
        clientId: this.clientId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.addLoanPayment(result);
      }
    });
  }

  editLoanPaymentDialog(payment: LoanPayment): void {
    const dialogRef = this.dialog.open(EditLoanPaymentDialogComponent, {
      width: '400px',
      data: { payment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.updateLoanPayment(payment.paymentId!, result);
      }
    });
  }

  // addPayment(): void {
  //   if (this.selectedLoan) {
  //     const paymentNumber = this.selectedLoan.payments?.length || 0;
  //     const payment: LoanPayment = {
  //       paymentNumber: paymentNumber + 1,
  //       paymentAmount: this.loanPaymentForm.value.paymentAmount,
  //       paymentDate: new Date(),
  //       clientId: this.clientId,
  //       loanId: this.loanId,
  //       paymentId: this.paymentService.generatePaymentId(),
  //       loanBalance: this.newBalance$,
  //       initialLoanAmount: 0
  //     };

  //     this.loanService.addPayment(this.selectedLoan.id!, payment).then(() => {

  //     });
  //   }
  // }

  updatePayment(payment: LoanPayment): void {
    if (this.selectedLoan) {
      this.loanService.updatePayment(this.selectedLoan.id!, payment).then(() => {

      });
    }
  }

  deletePayment(paymentNumber: number): void {
    if (this.selectedLoan) {
      this.loanService.deletePayment(this.selectedLoan.id!, paymentNumber).then(() => {
      });
    }
  }

  onSubmit(): void {

    if (this.loanPaymentForm.valid) {

      const paymentAmount = this.loanPaymentForm.get('paymentAmount')!.value;

    // Perform calculations and update loan balance
    const newBalance = this.newBalance$;
    this.loanService.updateLoanBalance(this.loanId, newBalance);
      const newLoanPayment: LoanPayment = {
        paymentId: this.paymentService.generatePaymentId(),
        loanId: this.loanId,
        clientId: this.clientId,
        paymentAmount: paymentAmount,
        paymentDate: new Date(),
        initialLoanAmount: this.loanDetails.loanAmount,
        loanBalance: this.newBalance$ - paymentAmount,
        paymentNumber: 0,
      };

      // this.addPayment();
      this.paymentService.addLoanPayment(newLoanPayment);
      // console.log(this.paymentAmount);
      this.loanPaymentForm.reset();
    }

  }

  // updatePayment(loanId: string, paymentAmount: number) {
  //   this.loanService
  //     .calculateLoanBalance(loanId, paymentAmount)
  //     .subscribe((newBalance) => {
  //       this.loanService.updateLoanBalance(loanId, newBalance)
  //         .then(() => {
  //           console.log(this.newBalance);
  //           console.log('Loan balance updated successfully');
  //           // Additional logic or navigation here
  //         })
  //         .catch((error) => {
  //           console.error('Error updating loan balance:', error);
  //         });
  //     });
  // }


  formatTimestamp(timestampString: string): string {
    const regex = /Timestamp\(seconds=(\d+), nanoseconds=(\d+)\)/;
    const match = timestampString.match(regex);

    if (match && match.length === 3) {
      const seconds = parseInt(match[1], 10);
      const nanoseconds = parseInt(match[2], 10);
      const milliseconds = seconds * 1000 + nanoseconds / 1e6;

      const date = new Date(milliseconds);
      // Customize the format as needed
      const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

      return formattedDate;
    } else {
      return 'Invalid timestamp format';
    }
  }
}
