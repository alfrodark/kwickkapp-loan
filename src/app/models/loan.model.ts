import { LoanPayment } from "./payment.model";

export interface Loan {
  loanId?: string;
  clientId: string;
  loanAmount: number;
  interestRate: number;
  periods: number;
  loanType: string;
  calculatedInterestAmount?: number;
  interestPayments?: number;
  futureValue?: number;
  monthlyPayments?: number;
  loanBalance?: number;
  paymentNumber: number;
  payments?: LoanPayment[];
  date: string;
  // Add other properties as needed
}
