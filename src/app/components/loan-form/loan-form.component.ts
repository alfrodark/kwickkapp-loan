import { Component, Input, OnInit } from '@angular/core';
import { Loan } from '../../models/loan.model';
import { ActivatedRoute } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoanType } from '../../models/loan-type.model';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.css'
})
export class LoanFormComponent implements OnInit {

  @Input()
  clientId!: string | any;
  loan!: Observable<Loan>| any;

  loanId!: string | any;
  newLoan: any = {};

  loanForm!: FormGroup;
  loanType!: LoanType | any;
  selectedLoanType!: string | any;

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService,
    private fb: FormBuilder
    ) {
      this.loanForm = this.fb.group({
        clientId: [this.clientId, Validators.required],
        loanAmount: ['', Validators.required],
        interestRate: ['', Validators.required],
        periods: ['', Validators.required],
        loanType: [this.selectedLoanType, Validators.required],
        date: [new Date(), Validators.required],
      });

      this.route.paramMap.subscribe(params => {
      this.clientId = params.get('clientId');
    });

  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loanForm = this.fb.group({
      clientId: [this.clientId, Validators.required], // Replace 'yourClientId' with actual user ID
      loanAmount: ['', Validators.required],
      interestRate: ['', Validators.required],
      periods: ['', Validators.required],
      loanType: [this.selectedLoanType, Validators.required],
      date: [new Date(), Validators.required],
    });
  }

  onSelectionChange(event: any) {
    this.selectedLoanType = (event.value);
    console.log('Selected value:', event.value);
    // Perform any action based on the selected value
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.value;
      this.loanService.addLoan(loanData).then(() => {
        alert('Loan successfully added.');
        this.loanForm.reset();
      });
    }
  }

  deleteLoan() {
    if (this.loanId) {
      this.loanService.deleteLoan(this.loanId)
        .then(() => console.log('Loan deleted successfully'))
        .catch(error => console.error('Error deleting loan:', error));
    }
  }

}
