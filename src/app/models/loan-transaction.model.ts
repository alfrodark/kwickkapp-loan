export interface LoanTransaction {
  transactionId?: string;
  loanId: string;
  amount: number;
  date: Date;
  type: 'payment' | 'disbursement';
}
