import { Injectable, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, catchError, map, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { LoanPayment } from '../models/payment.model';
import { Client } from '../models/client.model';
import { Loan } from '../models/loan.model';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly loanPaymentsCollectionName = 'loanPayments';

  clientsCollection!: AngularFirestoreCollection<Client>;
  paymentsCollection: AngularFirestoreCollection<LoanPayment>;

  // clients: Observable<{ clientId?: string; userId?: string | undefined; name: string; email: string;
  //   phone?: string | undefined; address?: string | undefined; city?: string | undefined;
  //   photoUrl?: string | undefined;}[]>;

  loanPayments: Observable<{paymentId?: string; clientId: string; loanId: string;
    paymentAmount: number; loanBalance: number; paymentDate: Date;
    initialLoanAmount?: number;}[]>;

  clientId!: string;
  paymentId!: string;

  private loansCollection: AngularFirestoreCollection<Loan>;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
    ) {
    this.paymentsCollection = this.firestore.collection<LoanPayment>('loanPayments');
    this.loansCollection = this.firestore.collection<Loan>('loans');

    this.loanPayments = this.paymentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as LoanPayment;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    }

  getPaymentId(): string {
    return this.paymentId;
  }

  getTotalLoanPayments(loanId: string): Observable<number> {
    return this.firestore
      .collection('loanPayments', ref => ref.where('loanId', '==', loanId))
      .valueChanges()
      .pipe(map((payments: any[]) => {
        return payments.reduce((total, payment) => total + Number(payment.paymentAmount), 0);
      }));
  }

  getPaymentIds(): Observable<string[]> {
    // Replace 'loanPayments' with your actual collection name
    return this.firestore.collection('loanPayments').snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.id))
    );
  }

  getPaymentIdsByLoanId(loanId: string): Observable<string[]> {
    // Replace 'loanPayments' with your actual collection name
    return this.firestore.collection('loanPayments', ref => ref.where('loanId', '==', loanId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => a.payload.doc.id))
      );
  }

  getPayments(): Observable<LoanPayment[]> | any {
    return this.paymentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data() })))
    );
  }

  getPayment(paymentId: string): Observable<any> {
    return this.firestore.collection('loanPayments').doc(paymentId).valueChanges();
  }

  getPaymentHistory(loanId: string): Observable<any[]> {
    return this.firestore
      .collection<LoanPayment>('loanPayments', ref => ref.where('loanId', '==', loanId))
      .valueChanges();
  }

  getLoanPayments(loanId: string): Observable<LoanPayment[]> | any {
    if (this.authService.currentUser) {
      return this.firestore
      .collection<LoanPayment>(this.loanPaymentsCollectionName, ref =>
        ref.where('loanId', '==', loanId)
      )
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as LoanPayment;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
      }
      else {
        return Promise.reject('User not authenticated');
      }
  }

  getLoanPaymentsById(loanId: string): Observable<number[]> {
    return this.firestore
      .collection<LoanPayment>('loanPayments', ref => ref.where('loanId', '==', loanId))
      .valueChanges()
      .pipe(
        map((payments: any[]) => payments.map(payment => payment.paymentAmount))
      );
  }

  calculateLoanBalance(loanId: string): Observable<number> {
    return this.getLoanPaymentsById(loanId).pipe(
      map((paymentAmounts: number[]) => {
        // Check if paymentAmounts is empty
        if (paymentAmounts.length === 0) {
          return 0; // Return 0 if there are no payments
        }

        // Use Number() to convert potential non-numeric values to numbers
        const loanBalance = paymentAmounts.reduce((total, amount) => total + Number(amount), 0);

        return loanBalance;
      }),
      catchError(error => {
        console.error('Error calculating loan balance:', error);
        return of(0); // Provide a default value or handle the error appropriately
      })
    );
  }

  getPaymentById(clientId: string, loanId: string): Observable<any[]> {
    return this.firestore.collection<LoanPayment>('loanPayments', ref =>
      ref.where('clientId', '==', clientId).where('loanId', '==', loanId))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as LoanPayment;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  getPaymentsById(paymentId: string): Observable<LoanPayment> | any {
    return this.loanPayments.pipe(
      map(loanPayments => loanPayments.filter((payment) => paymentId === payment.paymentId))
    );
  }

  // getPaymentAmountById(paymentId: string): Observable<number | undefined> {
  //   return this.loanPayments.pipe(
  //     map(loanPayments => {
  //       const filteredPayments = loanPayments.filter(payment => paymentId === paymentId);
  //       return filteredPayments.length > 0 ? filteredPayments[0].paymentAmount : undefined;
  //     })
  //   );
  // }

  getPaymentsByLoanId(paymentId: string, loanId: string): Observable<number | undefined> {
    return this.loanPayments.pipe(
      map(loanPayments => {
        const filteredPayments = loanPayments.filter(payment => paymentId === payment.paymentId && loanId === payment.loanId);
        return filteredPayments.length > 0 ? filteredPayments[0].paymentAmount : undefined;
      })
    );
  }

  getLoanPaymentById(paymentId: string): Observable<LoanPayment> | any {
    if (this.authService.currentUser) {
      return this.firestore
      .collection<LoanPayment>('loanPayments', ref => ref.where('paymentId', '==', paymentId))
      .valueChanges();
    }
    else {
      return Promise.reject('User not authenticated');
    }
  }

  addPayment(payment: LoanPayment): Promise<void> | any{
    if (this.authService.currentUser) {
      return this.paymentsCollection.add(payment)
      .then(() => alert('Payment added successfully'))
      .catch(error => alert(error));
    }
    else {
      return Promise.reject('User not authenticated');
    }
  }

  addLoanPayment(payment: LoanPayment) {
    return this.firestore
      .collection('loanPayments')
      .add(payment)
      .then(async () => {
        alert('Payment added successfully');
        // Update loan balance after adding payment
        const loanId = payment.loanId;
        const loanDocRef = this.loansCollection.doc(loanId).ref;

        try {
          const loanDoc = await loanDocRef.get();

          if (loanDoc.exists) {
            const loanData = loanDoc.data() as any;
            const updatedBalance = loanData.loanBalance - payment.paymentAmount;

            // Update the loan document with the new balance
            await loanDocRef.update({ loanBalance: updatedBalance });
          }
          else{

          }
        } catch (error) {
          console.error('Error updating loan balance:', error);
        }
      });
  }

  updateLoanPayment(paymentId: string, newAmount: number): Promise<void> {
    // Ensure only authenticated users can update payments
    if (this.authService.currentUser) {
      return this.firestore
      .collection('loanPayments')
      .doc(paymentId)
      .update({ paymentAmount: newAmount });
    } else {
      return Promise.reject('User not authenticated');
    }
  }

  updateLoanBalance(paymentId: string, newBalance: number): Promise<void> {
    // Ensure only authenticated users can update payments
    if (this.authService.currentUser) {
      return this.firestore
      .collection('loanPayments')
      .doc(paymentId)
      .update({ loanBalance: newBalance });
    } else {
      return Promise.reject('User not authenticated');
    }
  }

   editPayment(paymentId: string, data: any): Promise<void> {
    return this.paymentsCollection.doc(paymentId).update(data);
  }

  deletePayment(id: string): Promise<void> {
    if (this.authService.currentUser) {
      const paymentRef = this.paymentsCollection.doc(id);
      return paymentRef.delete();
    } else {
      return Promise.reject('User not authenticated');
    }

  }

  deleteLoanPayment(paymentId: string): Promise<void> {
    if (this.authService.currentUser) {
      return this.paymentsCollection.doc(paymentId).delete();
    } else {
      return Promise.reject('User not authenticated');
    }

  }

  generatePaymentId(): string {
    // You can implement your own logic for generating payment IDs
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `PMT-${timestamp}-${random}`;
  }
}
