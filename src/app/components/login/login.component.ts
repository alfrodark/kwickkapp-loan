import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup | any;
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password);
    this.router.navigate(['/dashboard']);

  }


}
