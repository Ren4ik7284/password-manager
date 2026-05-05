import { Component, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-auth-modal",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./auth-modal.html",
  styleUrls: ["./auth-modal.css"]
})
export class AuthModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<{email: string, isNew: boolean}>();
  
  isLoginMode = true;
  email = "";
  password = "";
  confirmPassword = "";
  errorMessage = "";
  successMessage = "";

  constructor(private authService: AuthService) {
    console.log("AuthModalComponent created");
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = "";
    this.successMessage = "";
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
  }

  onSubmit() {
    console.log("onSubmit called", { email: this.email, password: this.password, isLoginMode: this.isLoginMode });
    
    this.errorMessage = "";
    
    if (!this.email || this.email.trim() === "") {
      this.errorMessage = "Введите email";
      console.log("Email is empty");
      return;
    }
    
    if (!this.password || this.password === "") {
      this.errorMessage = "Введите пароль";
      console.log("Password is empty");
      return;
    }
    
    if (this.password.length < 4) {
      this.errorMessage = "Пароль должен быть не менее 4 символов";
      console.log("Password too short");
      return;
    }
    
    if (this.isLoginMode) {
      console.log("Trying to login");
      if (this.authService.login(this.email, this.password)) {
        console.log("Login success");
        this.successMessage = "Вход выполнен успешно!";
        setTimeout(() => {
          this.loginSuccess.emit({ email: this.email, isNew: false });
          this.close.emit();
        }, 1000);
      } else {
        console.log("Login failed");
        this.errorMessage = "Неверный email или пароль";
      }
    } else {
      console.log("Trying to register");
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Пароли не совпадают";
        return;
      }
      
      if (this.authService.register(this.email, this.password)) {
        console.log("Register success");
        this.successMessage = "Регистрация прошла успешно!";
        setTimeout(() => {
          this.loginSuccess.emit({ email: this.email, isNew: true });
          this.close.emit();
        }, 1500);
      } else {
        console.log("Register failed - user exists");
        this.errorMessage = "Пользователь с таким email уже существует";
      }
    }
  }

  closeModal() {
    console.log("Close modal");
    this.close.emit();
  }
}
