import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-update',
  templateUrl: './loan-update.component.html',
  styleUrl: './loan-update.component.css'
})
export class LoanUpdateComponent implements OnInit  {

  loanForm!: FormGroup;
  loanId!: string;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe((params) => {
      this.loanId = params['id'];
      this.loadLoanData();
    });
  }

  initForm() {
    this.loanForm = this.fb.group({
      loanAmount: [null, Validators.required],
      interestRate: [null, Validators.required],
      periods: [null, Validators.required],
      calculatedInterestAmount: [null],
      futureValue: [null],
      monthlyPayments: [null],
    });
  }

  loadLoanData() {
    if (this.loanId) {
      this.loanService.getLoanById(this.loanId).subscribe((loan: any) => {
        this.loanForm.patchValue(loan);
      });
    }
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const updatedLoan = this.loanForm.value;
      this.loanService.updateLoan(this.loanId, updatedLoan).then(() => {
        alert('Loan updated successfully!');
        this.router.navigate(['/clients']);
      });
    }
  }
}
