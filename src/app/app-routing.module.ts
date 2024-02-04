import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanFormComponent } from './components/loan-form/loan-form.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoanUpdateComponent } from './components/loan-update/loan-update.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { ClientUpdateComponent } from './components/client-update/client-update.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { PaymentUpdateComponent } from './components/payment-update/payment-update.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { LoanTransactionListComponent } from './components/loan-transaction-list/loan-transaction-list.component';
import { LoanTransactionFormComponent } from './components/loan-transaction-form/loan-transaction-form.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, },
  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'clients/:clientId/loans', component: LoanListComponent },
  { path: 'loans/new', component: LoanFormComponent },
  { path: 'update-loans/:id', component: LoanUpdateComponent },
  { path: 'loan-details/:id', component: LoanDetailsComponent },
  { path: 'loan-transactions', component: LoanTransactionFormComponent },
  { path: 'loan-transactions/:id', component: LoanTransactionListComponent },
  { path: 'user-details', component: UserDetailsComponent },
  { path: 'update-user', component: UserUpdateComponent },
  { path: 'dashboard-header', component: DashboardHeaderComponent },
  { path: 'clients/add', component: ClientFormComponent },
  { path: 'clients/edit/:clientId', component: ClientFormComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'client-details/:clientId', component: ClientDetailsComponent },
  { path: "client-update/:clientId", component: ClientUpdateComponent },
  { path: 'payments', component: PaymentListComponent },
  { path: 'payment-form', component: PaymentFormComponent },
  { path: 'payment-details/:loanId/:id', component: PaymentDetailsComponent },
  { path: 'payments-history', component: PaymentHistoryComponent },
  { path: 'update-payments/:loanId/:id', component: PaymentUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
