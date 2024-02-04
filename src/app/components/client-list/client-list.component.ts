import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {

  clients$!: Observable<Client[]>;
  displayedColumns: string[] = ['clientName', 'phone', 'actions'];
  clients: Client[] = [];
  searchInput: string = '';
  searchTerms = new Subject<string>();


  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Check if the user is authenticated
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.clients$ = this.clientService.getClients();
      } else {
        // Load clients for the authenticated user
        this.clients$ = this.clientService.getClients();
      }
    });
  }

  searchClients() {
    this.searchTerms.next(this.searchInput);
  }

  // Logout the user
  logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  onSearchInput() {
    this.searchTerms.next(this.searchInput);
  }

  // Navigate to the client details page
  viewClientDetails(clientId: any) {
    this.router.navigate(['/client-details', clientId]);
  }

  deleteClient(clientId: string, clientName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete ${clientName}?`);

    if (confirmDelete) {
      this.clientService.deleteClient(clientId);
    }
  }

}
