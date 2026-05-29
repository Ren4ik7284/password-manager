import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private apiUrl = "http://localhost:3000/auth";
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem("access_token");
    if (token) {
      this.isLoggedInSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem("access_token", response.accessToken);
        localStorage.setItem("refresh_token", response.refreshToken);
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(response.user.email);
      }),
      catchError((error) => {
        let errorMessage = "Ошибка входа";
        if (error.status === 401) {
          errorMessage = error.error?.message || "Неверный email или пароль";
        } else if (error.status === 429) {
          errorMessage = error.error?.message || "Слишком много попыток. Подождите 20 минут";
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(email: string, password: string, name?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, name }).pipe(
      tap((response: any) => {
        localStorage.setItem("access_token", response.accessToken);
        localStorage.setItem("refresh_token", response.refreshToken);
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(response.user.email);
      }),
      catchError((error) => {
        let errorMessage = "Ошибка регистрации";
        if (error.status === 400) {
          errorMessage = error.error?.message || "Проверьте правильность данных";
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(["/"]);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("access_token") !== null;
  }

  getUser(): string | null {
    return this.currentUserSubject.value;
  }

  getAuthStatus(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
}
