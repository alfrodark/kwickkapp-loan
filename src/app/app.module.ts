import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import {environment} from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthService } from './auth/auth.service';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { LoanService } from './services/loan.service';
import { LoanFormComponent } from './components/loan-form/loan-form.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoanUpdateComponent } from './components/loan-update/loan-update.component';
import { ClientUpdateComponent } from './components/client-update/client-update.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { PaymentUpdateComponent } from './components/payment-update/payment-update.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { UserService } from './services/user.service';
import { ClientService } from './services/client.service';
import { PaymentService } from './services/payment.service';
import { FileUploadService } from './services/file-upload.service';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { MatSelectModule } from '@angular/material/select';
import { LoanTransactionFormComponent } from './components/loan-transaction-form/loan-transaction-form.component';
import { LoanTransactionListComponent } from './components/loan-transaction-list/loan-transaction-list.component';
import { FirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { LoanPaymentFormDialogComponent } from './components/loan-payment-form-dialog/loan-payment-form-dialog.component';
import { EditLoanPaymentDialogComponent } from './components/edit-loan-payment-dialog/edit-loan-payment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignUpComponent,
    DashboardHeaderComponent,
    LoanFormComponent,
    ClientListComponent,
    LoanListComponent,
    LoanDetailsComponent,
    ClientFormComponent,
    ClientDetailsComponent,
    PaymentListComponent,
    PaymentFormComponent,
    DashboardComponent,
    LoanUpdateComponent,
    ClientUpdateComponent,
    UserDetailsComponent,
    UserUpdateComponent,
    PaymentUpdateComponent,
    PaymentDetailsComponent,
    PaymentHistoryComponent,
    LoanTransactionFormComponent,
    LoanTransactionListComponent,
    LoanPaymentFormDialogComponent,
    EditLoanPaymentDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireModule,


  ],
  providers: [
    provideClientHydration(), AuthService, UserService, ClientService,
    LoanService, FileUploadService, provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
