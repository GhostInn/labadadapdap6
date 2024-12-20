// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5282/api/Auth';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token);
          this.authStatus.next(true);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.authStatus.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Произошла ошибка. Попробуйте позже.';
    if (error.error instanceof ErrorEvent) {
      // Клиентская или сетевая ошибка
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      // Серверная ошибка
      if (error.status === 401) {
        errorMessage = 'Неверный логин или пароль.';
      } else if (error.status === 400) {
        errorMessage = 'Некорректные данные. Проверьте введенные значения.';
      }
    }
    return throwError(errorMessage);
  }
}
