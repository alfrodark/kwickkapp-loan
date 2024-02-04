import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../services/payment.service';
import { LoanPayment } from '../../models/payment.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css'
})
export class PaymentHistoryComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  // @Input()
  // clientId!: string | any;
  @Input()
  loanId!: string | any;
  paymentId!: string | any;
  payment!: LoanPayment[] | any;
  userData: any;
  paymentHistory!: LoanPayment[] | any;

  displayedColumns: string[] = ['paymentId', 'paymentAmount', 'loanBalance', 'date'];
  dataSource!: MatTableDataSource<LoanPayment>;

  constructor(
    private paymentService: PaymentService,
    private pdfService: PdfService,
    private authService: AuthService,
    private route: ActivatedRoute,
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
          this.loadPaymentHistory();
      });
      }
    });

    console.log('loanId :', this.loanId);
    console.log('paymentId :', this.paymentId);

  }

  loadPaymentHistory(): void {
    this.paymentService.getLoanPayments(this.loanId).subscribe((history: any[]) => {
      this.paymentHistory = history;
    });
  }

  generatePDF(): void {
    this.pdfService.generatePaymentHistoryPDF(this.paymentHistory);
  }

  deletePayment(paymentId: string) {
    const confirmDelete = confirm(`Are you sure you want to delete?`);

    if (confirmDelete) {
      this.paymentService.deleteLoanPayment(paymentId)
      .then(() => alert('Payment deleted successfully'))
      .catch(error => console.error('Error deleting payment:', error));

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
