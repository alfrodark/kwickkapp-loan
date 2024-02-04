import { Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Client } from '../../models/client.model';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ClientService } from '../../services/client.service';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../services/payment.service';
import { LoanPayment } from '../../models/payment.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  @Input()
  loanId!: string | any;
  @Input()
  clientId!: string | any;

  user!: Observable<any>;
  clients!: Observable<Client[]>;
  clients$!: Observable<Client[]>;
  payments: Observable<LoanPayment[]> | any;
  totalClients$!: Observable<number>;
  userData: any;
  userService!: UserService;
  uid!: Observable<any>;

  // displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'city'];
  loans!: Observable<Loan[]> | any;
  displayedColumns: string[] = ['clientId', 'loanId', 'actions'];
  dataSource!: MatTableDataSource<Loan> | any;
  paymentId!: string | any;


  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    ) {
      this.route.paramMap.subscribe(params => {
        this.clientId = params.get('clientId');
      });
    }

  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe((user: any) => {
      this.userData = user;
      if (user) {
        this.loans = this.loanService.getLoans(this.clientId);

        this.route.paramMap.subscribe((params) => {
          this.loanId = params.get('loanId');
          this.clientId = params.get('clientId');
        });

        this.clients = this.clientService.getClients();
        this.clients$ = this.clientService.getClients();
      }else {
        // Load clients for the authenticated user
        this.clients$ = this.clientService.getClients();
      }
    });

    this.totalClients$ = this.clientService.getClients().pipe(
      // Assuming you have a custom method in your service to get the total number of clients
      map(clients => clients.length)
    );

  }

  logout(){
    this.authService.signOut().then(() => {
      alert('User logged out successfully');
      this.router.navigate(['/login']);
    }).catch(error => {
      alert(error);
    });
  }

  deleteClient(clientId: string, clientName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete ${clientName}?`);

    if (confirmDelete) {
      this.clientService.deleteClient(clientId);
    }
  }

  deleteLoan(loanId: string) {
    this.loanService.deleteLoan(loanId)
      .then(() => console.log('Loan deleted successfully'))
      .catch(error => console.error('Error deleting loan:', error));
  }

}
