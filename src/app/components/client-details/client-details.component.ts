import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/client.model';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Loan } from '../../models/loan.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})
export class ClientDetailsComponent implements OnInit {

  timestampString = 'Timestamp(seconds=1702402741, nanoseconds=78000000)';

  clientId!: string | any;
  client$: Observable<Client>| any;
  client!: Observable<Client>| any;
  userId!: string | any;
  displayedColumns: string[] = ['Name', 'Email', 'Phone', 'City'];
  dataSource: Client[] = [];

  loans!: Loan[] | any;
  loanId: string | any;
  loan$!: Observable<Loan>| any;
  clientData$!: Observable<any> | any;
  loanData!: any[];
  userData: any;
  user!: Observable<User> | any;
  clients!: Observable<Client[]>;
  clients$!: Observable<Client[]>;

  documentData$!: Observable<any> | any;
  documentId!: string;
  currentDocument: string | any;
  documents$!: Observable<any[]> | any;
  currentIndex!: number;


  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private clientService: ClientService,
    private authService: AuthService,
    private auth: AngularFireAuth,
    private userService: UserService,
    private loanService: LoanService
    ) {

      this.route.paramMap.subscribe(params => {
        this.loanId = params.get('loanId');
      });

      this.route.paramMap.subscribe(params => {
        this.clientId = params.get('clientId');
      });

    }

  ngOnInit(): void {
    this.auth.user.subscribe(userData => {
      this.user = userData;
      // this.loadLoanForm();
      this.getLoans();
  });

  this.clientId! = this.route.snapshot.paramMap.get('clientId');
  this.client$ = this.clientService.getClient(this.clientId);
  this.getClientDetails();

  this.route.params.subscribe(params => {
  this.clientId = params['clientId'];
  // console.log(this.clientId!);
 });

 this.loan$ = this.firestore.collection('loans', ref => ref.orderBy('timestamp')).valueChanges();

    // console.log(this.loanId);
    // console.log(this.clientId);
  }

  getLoans(){
    this.loanService.getLoans(this.clientId).subscribe((loan) => {
      this.loan$ = loan;
    });
  }

  getClientDetails() {
    this.clientService.getClientById(this.clientId).subscribe((client) => {
      this.client$ = client;
    });
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

  goBack() {
    // this.router.navigate(['/dashboard']);
    window.history.back();
  }


}
