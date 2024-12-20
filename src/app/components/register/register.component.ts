// src/app/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void { }

  get formControls() { return this.registerForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      return;
    }

    const registerData: RegisterRequest = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.successMessage = 'Регистрация прошла успешно!';
        this.registerForm.reset();
        this.isSubmitted = false;
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }
}
