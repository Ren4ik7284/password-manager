import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  private currentUser: string | null = null;

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser = savedUser;
    }
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

  async submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || this.email.trim() === '') {
      this.errorMessage = 'Введите email';
      return;
    }
    if (this.email.includes(' ')) {
      this.errorMessage = 'Email не должен содержать пробелы';
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Введите корректный email';
      return;
    }
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
    if (!this.isLoginMode && this.password !== this.confirmPassword) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    const url = this.isLoginMode 
      ? 'http://localhost:3000/auth/login' 
      : 'http://localhost:3000/auth/register';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password })
      });
      const data = await response.json();

      if (data.success) {
        this.successMessage = data.message;
        this.currentUser = this.email;
        localStorage.setItem('user', this.email);
        setTimeout(() => {
          this.closeModal();
          window.location.reload();
        }, 1000);
      } else {
        this.errorMessage = data.message;
      }
    } catch (error) {
      this.errorMessage = 'Ошибка подключения к серверу. Запустите бэкенд на порту 3000';
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getUser(): string | null {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
    window.location.reload();
  }
}