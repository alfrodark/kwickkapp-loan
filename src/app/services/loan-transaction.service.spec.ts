import { TestBed } from '@angular/core/testing';

import { LoanTransactionService } from './loan-transaction.service';

describe('LoanTransactionService', () => {
  let service: LoanTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
