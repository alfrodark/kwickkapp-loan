import { Component, Input } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Loan } from '../../models/loan.model';
import { Observable } from 'rxjs';
import { Client } from '../../models/client.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.css'
})
export class LoanListComponent {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  @Input()
  clientId!: string | any;
  loan!: Observable<Loan>| any;

  loans!: Loan[] | any;
  displayedColumns: string[] = ['loanAmount', 'periods', 'date', 'actions'];

  user!: Observable<any>;
  clients!: Observable<Client[]>;
  clients$!: Observable<Client[]>;
  totalClients$!: Observable<number>;
  userData: any;
  userService!: UserService;
  uid!: Observable<any>;

  loanId!: string | any;

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService
    ) {
      this.route.paramMap.subscribe(params => {
        this.loanId = params.get('loanId');
      });

      this.route.paramMap.subscribe(params => {
        this.clientId = params.get('clientId');
      });


    }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.userData = user;
      if (user) {
        this.clients = this.clientService.getClients();
        this.clients$ = this.clientService.getClients();

        this.loanService.getLoans(this.clientId).subscribe(loans => {
          this.loans = loans;
        });
      }else {
        // Load clients for the authenticated user
        this.clients$ = this.clientService.getClients();
      }
    });


  }

  deleteLoan(loanId: string) {
    const confirmDelete = confirm(`Are you sure you want to delete?`);

    if (confirmDelete) {
      this.loanService.deleteLoan(loanId)
      .then(() => alert('Loan deleted successfully'))
      .catch(error => console.error('Error deleting loan:', error));
    }

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
