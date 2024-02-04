import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';



// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  constructor() {

  }

  // generatePaymentHistoryPDF(paymentHistory: any[]): void {
  //   const documentDefinition = this.createDocumentDefinition(paymentHistory);
  //   pdfMake.createPdf(documentDefinition).open();
  // }

  generatePaymentHistoryPDF(paymentHistory: any[]): void {
    const document = this.createDocument(paymentHistory);
    document.save('payment_history_report.pdf');
  }

  private createDocument(paymentHistory: any[]): any {
    const document = new jsPDF();

    document.text('Payment History Report', 20, 20);
    (document as any).autoTable({
      startY: 30,
      head: [['Payment Date', 'Loan Amount', 'Payment Amount', 'Loan Balance']],
      body: this.getTableBody(paymentHistory)
    });

    return document;
  }

  private getTableBody(paymentHistory: any[]): any[] {
    return paymentHistory.map(payment => [
      this.formatTimestamp(payment.paymentDate.toString()),
      payment.initialLoanAmount,
      payment.paymentAmount,
      payment.loanBalance,
    ]);
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
