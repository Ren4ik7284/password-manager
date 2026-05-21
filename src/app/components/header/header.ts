import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { TokenService } from "../../services/token.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: "./header.html",
  styleUrls: ["./header.css"]
})
export class HeaderComponent {
  showModal = false;
  isLoginMode = true;
  email = "";
  password = "";
  confirmPassword = "";
  errorMessage = "";
  successMessage = "";
  currentUser: string | null = null;

  private apiUrl = "http://localhost:3000/auth";

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    const savedUser = localStorage.getItem("user_email");
    if (savedUser && this.tokenService.isAuthenticated()) {
      this.currentUser = savedUser;
    }
  }

  getUsername(): string {
    if (!this.currentUser) return "Гость";
    const atIndex = this.currentUser.indexOf("@");
    return atIndex === -1 ? this.currentUser : this.currentUser.substring(0, atIndex);
  }

  openModal() {
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.isLoginMode = true;
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    this.errorMessage = "";
    this.successMessage = "";
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = "";
    this.successMessage = "";
    this.password = "";
    this.confirmPassword = "";
  }

  refreshToken() {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) return;

    this.http.post<{ access_token: string; refresh_token: string }>(`${this.apiUrl}/refresh`, { refresh_token: refreshToken })
      .subscribe({
        next: (response) => {
          this.tokenService.setTokens(response.access_token, response.refresh_token);
        },
        error: () => this.logout()
      });
  }

  submit() {
    this.errorMessage = "";
    this.successMessage = "";

    if (!this.email || this.email.trim() === "") {
      this.errorMessage = "Введите email";
      return;
    }
    if (this.email.includes(" ")) {
      this.errorMessage = "Email не должен содержать пробелы";
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = "Введите корректный email";
      return;
    }
    if (!this.password) {
      this.errorMessage = "Введите пароль";
      return;
    }
    if (this.password.includes(" ")) {
      this.errorMessage = "Пароль не должен содержать пробелы";
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage = "Пароль должен быть не менее 8 символов";
      return;
    }
    if (!this.isLoginMode && this.password !== this.confirmPassword) {
      this.errorMessage = "Пароли не совпадают";
      return;
    }

    const endpoint = this.isLoginMode ? "/login" : "/register";
    const url = this.apiUrl + endpoint;

    this.http
      .post<{ access_token: string; refresh_token: string }>(url, { email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.tokenService.setTokens(response.access_token, response.refresh_token);
          localStorage.setItem("user_email", this.email);
          this.currentUser = this.email;
          this.successMessage = this.isLoginMode ? "Вход выполнен!" : "Регистрация успешна!";
          setTimeout(() => {
            this.closeModal();
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          console.error("Ошибка:", err);
          this.errorMessage = err.error?.message || "Ошибка сервера";
        },
      });
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  getUser(): string | null {
    return this.currentUser;
  }

  logout() {
    this.tokenService.removeTokens();
    this.currentUser = null;
    window.location.reload();
  }
}
