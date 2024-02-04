import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Loan } from '../models/loan.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { LoanPayment } from '../models/payment.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/compat/app'

const app = initializeApp(environment.firebaseConfig);
const firestore = getFirestore(app);


@Injectable({
  providedIn: 'root'
})
export class LoanService {

    private loansCollection: AngularFirestoreCollection<Loan>;
    private paymentsCollection: AngularFirestoreCollection<any>;
    private loanId!: string;

    constructor(
      private firestore: AngularFirestore,
      private storage: AngularFireStorage,
      private authService: AuthService,
      private auth: AngularFireAuth
      ) {
      this.loansCollection = this.firestore.collection('loans');
      this.paymentsCollection = this.firestore.collection('loanPayments');
    }

    setLoanId(loanId: string): void {
      this.loanId = loanId;
    }

    getLoans(clientId: string) {
      return this.firestore.collection('loans', (ref) =>
        ref.where('clientId', '==', clientId)
      ).valueChanges({ idField: 'loanId' });
    }

    getLoanById(loanId: string): Observable<Loan> | any {
      return this.loansCollection.doc(loanId).valueChanges({ idField: 'loanId' });
    }

    calculateLoanBalance(initialLoanAmount: number, payments: any[]): number {
      let totalPayments = 0;

      for (const payment of payments) {
        totalPayments += payment.amount;
      }

      return initialLoanAmount - totalPayments;
    }

    getPaymentsForLoan(loanId: string): Observable<any[]> {
      return this.firestore
        .collection('loanPayments', ref => ref.where('loanId', '==', loanId))
        .valueChanges();
    }

    addLoan(loan: Loan): Promise<void> | any {
      // Ensure only authenticated users can add loans
      if (this.authService.currentUser) {
        loan.calculatedInterestAmount = this.calculateInterest(loan);
        loan.futureValue = this.calculateFutureValue(loan);
        loan.monthlyPayments = this.calculateMonthlyPayments(loan);
        loan.interestPayments = this.calculateInterestPayments(loan);
        loan.loanBalance = this.calculateInitialLoanBalance(loan);

        return this.loansCollection.add(loan);
      } else {
        return Promise.reject('User not authenticated');
      }
    }

    updateLoan(loanId: string, loan: Loan): Promise<void> {
      // Ensure only authenticated users can update loans
      if (this.authService.currentUser) {
        loan.calculatedInterestAmount = this.calculateInterest(loan);
        loan.futureValue = this.calculateFutureValue(loan);
        loan.monthlyPayments = this.calculateMonthlyPayments(loan);
        loan.interestPayments = this.calculateInterestPayments(loan);

        return this.loansCollection.doc(loanId).update(loan);
      } else {
        return Promise.reject('User not authenticated');
      }
    }

    deleteLoan(loanId: string): Promise<void> {
      // Ensure only authenticated users can delete loans
      if (this.authService.currentUser) {
        return this.loansCollection.doc(loanId).delete();
      } else {
        return Promise.reject('User not authenticated');
      }
    }

    private calculateInterest(loan: Loan): number {
      // Implement your interest calculation logic here
      // For example: (loan.loanAmount * loan.interestRate * loan.periods) / 100
      return (loan.loanAmount * loan.interestRate * loan.periods) / 100;
    }

    private calculateFutureValue(loan: Loan): number {
      // Implement your future value calculation logic here
      // Compound Interest Formula: FV = P * (1 + r/n)^(nt)
      const principal = loan.loanAmount;
      const rate = loan.interestRate / 100;
      const periods = loan.periods;

      return principal * Math.pow(1 + rate / periods, periods);
    }

    private calculateMonthlyPayments(loan: Loan): number {
      // Monthly Payments Formula: P * (r/n) / (1 - (1 + r/n)^(-nt))
      const principal = loan.loanAmount;
      const rate = loan.interestRate / 100;
      const periods = loan.periods;

      const monthlyRate = rate / periods;
      const totalPayments = periods;

      return principal * (monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    }

    private calculateInterestPayments(loan: Loan): number {
      // Calculate interest payments based on the loan amount, interest rate, and periods
    return loan.calculatedInterestAmount! / loan.periods;
    }

    private calculateInitialLoanBalance(loan: Loan): number {
      // Calculate interest payments based on the loan amount, interest rate, and periods
      return loan.loanAmount;
    }

    getLoanDetails(loanId: string): Observable<any> {
      return this.firestore.doc(`loans/${loanId}`).valueChanges();
    }

    getPayments(loanId: string): Observable<any[]>{
      return this.firestore.collection(`loans/${loanId}/payments`).valueChanges();
    }

    getLoanAmount(loanId: string): Observable<number> {
      return this.firestore
        .collection('loans')
        .doc(loanId)
        .valueChanges()
        .pipe(map((loan: any) => loan.loanAmount));
    }

     async addPayment(loanId: string, payment: LoanPayment): Promise<void> {
       const db = firebase.firestore();
       const loanRef = db.collection('loans').doc(loanId);

       try {
         const doc = await loanRef.get();

         if (doc.exists) {
           const currentPayments = doc.data()?.['payments'] || [];
           const updatedPayments = [...currentPayments, payment];

           await loanRef.update({ payments: updatedPayments });

           console.log('Payment added successfully');
         } else {
           console.log('Loan document does not exist');
         }
       } catch (error) {
         console.error('Error adding payment:', error);
         throw error;
       }
     }

    updatePayment(loanId: string, payment: LoanPayment): Promise<void> {
      const loanDocRef = this.firestore.collection('loans').doc(loanId);

      // Remove the existing payment with the same paymentNumber
      return loanDocRef.update({
          payments: firebase.firestore.FieldValue.arrayRemove({ paymentNumber: payment.paymentNumber })
      })
      .then(() => {
          // Add the new payment
          return loanDocRef.update({
              payments: firebase.firestore.FieldValue.arrayUnion(payment)
          });
      });
  }

    editPayment(loanId: string, paymentId: string, payment: any) {
      return this.firestore.doc(`loans/${loanId}/payments/${paymentId}`).update(payment);
    }

    // deletePayment(loanId: string, paymentId: string) {
    //   return this.firestore.doc(`loans/${loanId}/payments/${paymentId}`).delete();
    // }

    async deletePayment(loanId: string, paymentNumber: number): Promise<void> {
      const db = firebase.firestore();
      const loanRef = db.collection('loans').doc(loanId);

      try {
        const doc = await loanRef.get();

        if (doc.exists) {
          const currentPayments = doc.data()?.['payments'] || [];
          const updatedPayments = currentPayments.filter(
            (payment: any) => payment.paymentNumber !== paymentNumber
          );

          await loanRef.update({ payments: updatedPayments });

          console.log('Payment deleted successfully');
        } else {
          console.log('Loan document does not exist');
        }
      } catch (error) {
        console.error('Error deleting payment:', error);
        throw error;
      }
    }


    // calculateLoanBalance(principal: number, annualInterestRate: number,
    //   numberOfPayments: number, paymentNumber: number): number {

    //   const monthlyInterestRate = annualInterestRate / 12 / 100;
    //   const numberOfMonths = numberOfPayments;

    //   const monthlyPayment =
    //     (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths));

    //   const remainingBalance =
    //     principal * Math.pow(1 + monthlyInterestRate, paymentNumber) -
    //     (monthlyPayment * (Math.pow(1 + monthlyInterestRate, paymentNumber) - 1)) / monthlyInterestRate;

    //   return remainingBalance;
    // }


    updateLoanBalance(loanId: string, newBalance: number): Promise<void> {
      return this.firestore
        .collection('loans')
        .doc(loanId)
        .update({ loanBalance: newBalance });
    }

    // async updateLoanBalance(loanId: string, payments: number[]) {
    //   try {
    //     const loanDocRef = this.firestore.collection('loans').doc(loanId).ref;
    //     const loanDoc = await loanDocRef.get();

    //     if (loanDoc.exists) {
    //       const loan = loanDoc.data() as Loan;
    //       const totalPayments = payments.reduce((acc, payment) => acc + payment, 0);
    //       const newBalance = loan.loanAmount - totalPayments;

    //       await loanDocRef.update({ loanBalance: newBalance });
    //       return true;
    //     } else {
    //       console.error('Loan document does not exist.');
    //       return false;
    //     }
    //   } catch (error) {
    //     console.error('Error updating loan balance:', error);
    //     return false;
    //   }
    // }

  }
