import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent implements OnInit {

  userData: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.userData = user;
    });
  }

  logout(): void {
    this.authService.signOut();
  }

}
