// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  errorMessage: string | null = null;
  returnUrl: string = '/dashboard'; // Страница перенаправления по умолчанию

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Получение параметра returnUrl из запроса (если есть)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get formControls() { return this.loginForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        // Перенаправление после успешного входа
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }
}
