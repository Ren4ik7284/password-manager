import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-auth-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./auth-modal.component.html",
  styleUrls: ["./auth-modal.component.css"]
})
export class AuthModalComponent {
  isLoginMode = true;
  authForm: FormGroup;
  errorMessage = "";
  successMessage = "";
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.authForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      name: [""]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = "";
    this.successMessage = "";
    this.showPassword = false;
    if (!this.isLoginMode) {
      this.authForm.get("name")?.setValidators([Validators.required]);
    } else {
      this.authForm.get("name")?.clearValidators();
    }
    this.authForm.get("name")?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { email, password, name } = this.authForm.value;
    this.errorMessage = "";
    this.successMessage = "";

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: () => {
          this.successMessage = "Вход выполнен успешно";
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    } else {
      const passwordValue = this.authForm.get("password")?.value;
      const hasUpperCase = /[A-Z]/.test(passwordValue);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

      if (passwordValue.length < 8) {
        this.errorMessage = "Пароль должен содержать минимум 8 символов";
        return;
      }
      if (!hasUpperCase) {
        this.errorMessage = "Пароль должен содержать хотя бы одну заглавную букву";
        return;
      }
      if (!hasSpecialChar) {
        this.errorMessage = "Пароль должен содержать хотя бы один спецсимвол";
        return;
      }

      this.authService.register(email, password, name).subscribe({
        next: () => {
          this.successMessage = "Регистрация выполнена успешно";
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }
}
