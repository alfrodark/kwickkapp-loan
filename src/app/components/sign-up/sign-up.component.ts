import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit  {

  signUpForm!: FormGroup | any;
  errorMessage!: string;
  user: User = {uid: '', email: '', password: '', name: '', phone: '', city: '' };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private userService: UserService,
    ) {}

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  async signUp(): Promise<void> {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const confirmPassword = this.signUpForm.get('confirmPassword').value;
    const name = this.signUpForm.get('name').value;
    const phone = this.signUpForm.get('phone').value;
    const city = this.signUpForm.get('city').value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
      try {
        await this.authService.signUp(email, password, name, phone, city);
        alert("You have successfully signed up.");
        this.router.navigate(['/login']);
      } catch (error) {
        // Handle sign-up error, e.g., display an error message
        alert('Sign-up error:'+(error));
      }
    }
  }


}
