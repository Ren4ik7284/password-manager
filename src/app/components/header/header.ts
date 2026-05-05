import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  showModal = false;
  isLoginMode = true;
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  private users = [
    { email: 'user@example.com', password: '12345678' }
  ];
  private currentUser: string | null = null;

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
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.password = '';
    this.confirmPassword = '';
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';

    // Проверка email на пустоту
    if (!this.email || this.email.trim() === '') {
      this.errorMessage = 'Введите email';
      return;
    }

    // Проверка email на пробелы
    if (this.email.includes(' ')) {
      this.errorMessage = 'Email не должен содержать пробелы';
      return;
    }

    // Строгая проверка формата email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Введите корректный email (пример: user@example.com)';
      return;
    }

    // Проверка пароля
    if (!this.password) {
      this.errorMessage = 'Введите пароль';
      return;
    }
    if (this.password.includes(' ')) {
      this.errorMessage = 'Пароль не должен содержать пробелы';
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage = 'Пароль должен быть не менее 8 символов';
      return;
    }

    if (this.isLoginMode) {
      // ЛОГИН
      const user = this.users.find(u => u.email === this.email && u.password === this.password);
      if (user) {
        this.currentUser = this.email;
        localStorage.setItem('user', this.email);
        this.successMessage = 'Вход выполнен!';
        setTimeout(() => {
          this.closeModal();
          window.location.reload();
        }, 1000);
      } else {
        this.errorMessage = 'Неверный email или пароль';
      }
    } else {
      // РЕГИСТРАЦИЯ
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Пароли не совпадают';
        return;
      }
      if (this.users.find(u => u.email === this.email)) {
        this.errorMessage = 'Пользователь с таким email уже существует';
        return;
      }
      this.users.push({ email: this.email, password: this.password });
      this.successMessage = 'Регистрация успешна! Теперь войдите';
      setTimeout(() => {
        this.switchMode();
        this.password = '';
        this.confirmPassword = '';
      }, 1500);
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null || localStorage.getItem('user') !== null;
  }

  getUser(): string | null {
    return this.currentUser || localStorage.getItem('user');
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
    window.location.reload();
  }
}