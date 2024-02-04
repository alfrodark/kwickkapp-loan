import { Component, Input, OnInit } from '@angular/core';
import { LoanTransaction } from '../../models/loan-transaction.model';
import { LoanTransactionService } from '../../services/loan-transaction.service';

@Component({
  selector: 'app-loan-transaction-list',
  templateUrl: './loan-transaction-list.component.html',
  styleUrl: './loan-transaction-list.component.css'
})
export class LoanTransactionListComponent implements OnInit {

  @Input()
  loanId!: string;
  transactions!: LoanTransaction[] | any;

  constructor(
    private transactionService: LoanTransactionService
    ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getLoanTransactions(this.loanId).subscribe((transactions) => {
      this.transactions = transactions;
    });
  }

  onDelete(transactionId: string) {
    this.transactionService.deleteLoanTransaction(transactionId).then(() => {
      // Optional: Add success message or update the transaction list
    });
  }

}
