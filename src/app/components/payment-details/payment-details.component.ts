import { Component, Input, OnInit } from '@angular/core';
import { LoanPayment } from '../../models/payment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../auth/auth.service';
import { ClientService } from '../../services/client.service';
import { Observable } from 'rxjs';
import { Loan } from '../../models/loan.model';
import { Client } from '../../models/client.model';
import { User } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  @Input()
  paymentId!: string | any;
  @Input()
  loanId!: string | any;
  payment!: Observable<LoanPayment[]> | any;

  @Input() clientId!: string | any;
  payments!: Observable<LoanPayment[]> | any;;
  loans!: Observable<Loan[]> | any;
  userData: any;
  user!: Observable<User> | any;
  clients!: Observable<Client[]>;
  clients$!: Observable<Client[]>;


  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private auth: AngularFireAuth,
    private router: Router,
    ){
      this.route.paramMap.subscribe(params => {
        this.loanId = params.get('loanId');
      });

      this.route.paramMap.subscribe(params => {
        this.paymentId = params.get('paymentId');
      });
  }

  ngOnInit(): void {
  this.auth.user.subscribe(userData =>  {
    this.user = userData;
      if (userData) {
        this.route.params.subscribe((params) => {
          this.paymentId = params['id'];
          this.loadLoanPaymentDetails();
      });

      }
    });

    // console.log('Payment Id :', this.paymentId);
    // console.log('Loan Id :', this.loanId);
  }

  loadLoanPaymentDetails(): void {
    this.paymentService.getPayment(this.paymentId).subscribe((payments: any) => {
      this.payments = payments;
    });
  }

  onUpdate() {
    this.router.navigate(['/payments/edit', this.paymentId]);
  }

  onDelete() {
    this.paymentService.deleteLoanPayment(this.paymentId)
      .then(() => alert('Payment deleted successfully'))
      .catch(error => console.error('Error deleting payment:', error));
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
