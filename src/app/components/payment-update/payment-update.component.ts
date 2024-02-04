import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Loan } from '../../models/loan.model';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-payment-update',
  templateUrl: './payment-update.component.html',
  styleUrl: './payment-update.component.css'
})
export class PaymentUpdateComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  @Input()
  paymentId!: string | any;
  @Input()
  loanId!: string | any;
  paymentForm!: FormGroup;
  userData: any;
  currentAmount!: number | any;
  loanBalance!: number | any;
  payments!: any[];
  paymentIds!: string[];

  loanDetails: any;
  loans!: Observable<Loan>| any;
  newBalance$!: number;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      paymentDate: [new Date()],
      paymentAmount: ['', [Validators.required, Validators.min(0)]],
    });

    this.route.paramMap.subscribe(params => {
      this.loanId = params.get('loanId');
    });

    this.route.paramMap.subscribe(params => {
      this.paymentId = params.get('paymentId');
    });

  }

  ngOnInit() {
    this.authService.user$.subscribe((user: any) => {
      this.userData = user;
      if (user) {
        this.route.params.subscribe((params) => {
          this.paymentId = params['id'];
          this.loadPaymentData();
        });
        this.initForm();
        this.loadLoanDetails(this.loanId);

        this.paymentService.calculateLoanBalance(this.loanId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((balance: number) => {
          this.newBalance$ = this.loanDetails.loanAmount - balance;
        },
        (error) => {
          console.error('Error calculating loan balance:', error);
        }
      );
      }else {
      }
    });

    // console.log('PaymentId :', this.paymentId);
    // console.log('Loan Id :', this.loanId);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initForm() {
    this.paymentForm = this.fb.group({
      paymentDate: [new Date()],
      paymentAmount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  loadLoanDetails(loanId: string): void {
    this.loanService.getLoanById(loanId).subscribe((loan: any) => {
      this.loans = loan;
      this.loanDetails = loan;
      // console.log('Loan Balance:', this.newBalance$);
    });
  }

  loadPaymentData() {
    this.paymentService.getPayment(this.paymentId).subscribe((payment: any) => {
    if (payment !== undefined) {
      this.currentAmount = payment.paymentAmount;
      // console.log('Payment Amount:', this.currentAmount);
      this.paymentForm.patchValue({ paymentAmount: this.currentAmount });
      // Now you can use the 'paymentAmount' value in your component
    } else {
      console.log('Payment not found');
    }
  });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const updatedPayment = this.paymentForm.get('paymentAmount')!.value;
      // console.log('Updated Payment :', updatedPayment);
      this.paymentService.updateLoanPayment(this.paymentId, updatedPayment).then(() => {
        this.paymentService.updateLoanBalance(this.paymentId, this.newBalance$);
        alert('Payment successfully updated.');
        this.paymentForm.reset();
        // this.router.navigate(['/loan-details', this.loanId]);
      });
    }
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
