import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./header.html",
  styleUrls: ["./header.css"]
})
export class HeaderComponent implements OnInit {
  showModal = false;
  isLoginMode = true;
  email = "";
  password = "";
  confirmPassword = "";
  errorMessage = "";
  successMessage = "";
  isDarkTheme = false;
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      this.isDarkTheme = true;
      document.body.classList.add("dark");
    }
    this.checkAdminStatus();
  }

  checkAdminStatus() {
    const email = this.authService.getUser();
    this.isAdmin = email === "bebragnom89@gmail.com";
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  isAuthenticated(): boolean {
    const auth = this.authService.isAuthenticated();
    if (auth) {
      this.checkAdminStatus();
    }
    return auth;
  }

  getUsername(): string {
    return this.authService.getUser() || "User";
  }

  openModal() {
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = "";
    this.successMessage = "";
  }

  submit() {
    if (this.isLoginMode) {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.successMessage = "Вход выполнен!";
          this.checkAdminStatus();
          setTimeout(() => this.closeModal(), 1000);
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    } else {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Пароли не совпадают";
        return;
      }
      this.authService.register(this.email, this.password, "").subscribe({
        next: () => {
          this.successMessage = "Регистрация успешна!";
          setTimeout(() => this.closeModal(), 1000);
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.isAdmin = false;
  }

  private resetForm() {
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    this.errorMessage = "";
    this.successMessage = "";
  }
}
