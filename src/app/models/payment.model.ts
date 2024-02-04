export interface LoanPayment {
  paymentId?: string;
  clientId: string;
  loanId: string;
  paymentAmount: number;
  loanBalance: number;
  paymentNumber: number;
  paymentDate: Date;
  initialLoanAmount: number;
  // Add other properties as needed
}
