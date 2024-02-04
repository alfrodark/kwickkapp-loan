import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { LoanPayment } from '../../models/payment.model';
import { AuthService } from '../../auth/auth.service';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  @Input()
  loanId!: string | any;
  paymentId!: string | any;
  clientId!: string | any;

  payments: LoanPayment[] | any;
  loanPayments: LoanPayment[] | any;
  newData: LoanPayment[] | any;
  userData: any;
  loans!: Observable<Loan[]> | any;
  loanDetails: Observable<Loan[]> | any;
  clients!: Observable<Client[]>;
  clients$!: Observable<Client[]>;

  loanAmount!: number;
  loanBalance!: number;
  selectedLoan: Loan | any = null;
  remainingBalance: Observable<number[]> | any;

  private unsubscribe$ = new Subject<void>();
  newBalance$!: Observable<number[]> | any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private clientService: ClientService,
    private loanService: LoanService,
    private paymentService: PaymentService
    ) {

      this.route.paramMap.subscribe(params => {
        this.paymentId = params.get('paymentId');
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
          this.paymentId = params['id'];
      });
        this.loanService.getLoanDetails(this.loanId).subscribe((loanDetails) => {
          this.loanDetails = loanDetails;
        });

        this.paymentService.getLoanPayments(this.loanId).subscribe((payments: any) => {
          this.payments = payments;

        });

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

        this.loadLoans();
        this.loadPayments();

      } else {

      }
    });

    // console.log('LoanId:', this.loanId);
    // console.log('ClientId:', this.clientId);
    // console.log('PaymentId:', this.paymentId);

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadLoans(): void {
    this.loanService.getLoanById(this.loanId).subscribe((loans: any) => {
      this.loans = loans;
      this.loanDetails = loans;

    });
  }

  loadPayments(): void {
    this.paymentService.getPaymentIdsByLoanId(this.loanId).subscribe((payment: any) => {
      this.remainingBalance = payment.loanBalance;
      console.log('Loan Balance:', this.newBalance$);
      this.loanService.updateLoanBalance(this.loanId, this.newBalance$);
    });
  }

  navigateToPaymentDetails(): void {
    const dataToSend = 'Hello from source component';
    this.router.navigate(['/destination', dataToSend]);
  }

  deletePayment(paymentId: string) {
    const confirmDelete = confirm(`Are you sure you want to delete?`);

    if (confirmDelete) {
      this.paymentService.deletePayment(paymentId)
      .then(() => alert('Payment deleted successfully'))
      .catch(error => console.error('Error deleting payment:', error));
      this.loanService.updateLoanBalance(this.loanId, this.newBalance$);
    }

  }

  navigateToPaymentHDetails(): void {
    // Navigate to the payment form with the loanId as a parameter
    this.router.navigate(['/payment-details', { loanId: this.loanId, paymentId: this.paymentId } ]);
  }

  navigateToPaymentUpdate(): void {
    // Navigate to the payment form with the loanId as a parameter
    this.router.navigate(['/update-payments', { loanId: this.loanId }]);
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
