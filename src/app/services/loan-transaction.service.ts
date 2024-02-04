import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoanTransaction } from '../models/loan-transaction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanTransactionService {

  constructor(
    private firestore: AngularFirestore
    ) {}

  getLoanTransactions(loanId: string): Observable<LoanTransaction[]> {
    return this.firestore
      .collection<LoanTransaction>('loanTransactions', (ref) =>
        ref.where('loanId', '==', loanId).orderBy('date', 'desc')
      )
      .valueChanges({ idField: 'transactionId' });
  }

  addLoanTransaction(transaction: LoanTransaction) {
    return this.firestore.collection('loanTransactions').add(transaction);
  }

  updateLoanTransaction(transactionId: string, transaction: LoanTransaction) {
    return this.firestore.collection('loanTransactions').doc(transactionId).update(transaction);
  }

  deleteLoanTransaction(transactionId: string) {
    return this.firestore.collection('loanTransactions').doc(transactionId).delete();
  }

}
