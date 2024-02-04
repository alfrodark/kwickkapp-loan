import { Component, Input, OnInit } from '@angular/core';
import { Loan } from '../../models/loan.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { PaymentService } from '../../services/payment.service';
import { LoanPayment } from '../../models/payment.model';
import { User } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.css'
})
export class LoanDetailsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  @Input()
  clientId!: string | any;
  loans!: Observable<Loan>| any;
  loan: Loan[] | any = [];
  payments: LoanPayment[] | any;
  totalLoanPayments: Observable<number>| any;

  loanId!: string | any;
  loanDetails: any;
  loanBalance!: Observable<number>| any;
  userData: any;
  clients!: Observable<Client[]> | any;
  clients$!: Observable<Client[]>;
  user!: Observable<User> | any;
  payment$!: Observable<LoanPayment>| any;

  selectedLoan: Loan | null = null;
  remainingBalance: number | null = null;
  newBalance$!: number;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private loanService: LoanService,
    private paymentService: PaymentService,
    private clientService: ClientService
    ) {
      this.route.paramMap.subscribe(params => {
        this.loanId = params.get('loanId');
      });
      // this.route.paramMap.subscribe(params => {
      //   this.clientId = params.get('clientId');
      // });


  }

  ngOnInit(): void {
    this.auth.user.subscribe(userData => {
      this.user = userData;
      this.route.params.subscribe((params) => {
        this.loanId = params['id'];
      });
      this.loadLoanDetails(this.loanId);
      this.loadTotalLoanPayments();

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

  });

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
      // console.log(this.clientId!);
      // console.log(this.loanId!);
    });
  }

  loadPayments(): void {
    this.loanService.getPaymentsForLoan(this.loanId).subscribe(payments => {
      this.payments = payments;
      // this.calculateLoanBalance();
    });
  }

  loadTotalLoanPayments(): void {
    this.paymentService.getTotalLoanPayments(this.loanId).subscribe((totalPayments) => {
      this.totalLoanPayments = totalPayments;
    });
  }

  // calculateLoanBalance(): void {
  //   const initialLoanAmount = this.loanDetails.loanAmount;
  //   this.loanBalance = this.paymentService.calculateLoanBalance(this.loanId);
  // }

  updateLoan() {
    // Implement update functionality as needed
    // For example, navigate to an edit form
  }

  deleteLoan(loanId: string) {
    const confirmDelete = confirm(`Are you sure you want to delete?`);

    if (confirmDelete) {
      this.loanService.deleteLoan(loanId)
      .then(() => alert('Loan deleted successfully'))
      .catch(error => console.error('Error deleting loan:', error));
    }

  }

  navigateToPaymentForm(): void {
    // Navigate to the payment form with the loanId as a parameter
    this.router.navigate(['/payment-form', { loanId: this.loanId, clientId: this.clientId }]);
  }

  navigateToPaymentList(): void {
    // Navigate to the payment form with the loanId as a parameter
    this.router.navigate(['/payments', { loanId: this.loanId, clientId: this.clientId }]);
  }

  navigateToPaymentHistory(): void {
    // Navigate to the payment form with the loanId as a parameter
    this.router.navigate(['/payments-history', { loanId: this.loanId }]);
  }

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
