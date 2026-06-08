import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-support",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./support.html",
  styleUrls: ["./support.css"]
})
export class SupportComponent {
  activeFaq: number | null = null;

  formData = {
    topic: "Проблема с входом",
    name: "",
    email: "",
    message: ""
  };

  errors = {
    name: "",
    email: "",
    message: ""
  };

  submitSuccess = false;
  submitError = "";

  toggleFaq(index: number) {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  validateForm(): boolean {
    let isValid = true;

    this.errors = { name: "", email: "", message: "" };

    if (!this.formData.name.trim()) {
      this.errors.name = "Введите ваше имя";
      isValid = false;
    } else if (this.formData.name.trim().length < 2) {
      this.errors.name = "Имя должно содержать минимум 2 символа";
      isValid = false;
    } else if (this.formData.name.length > 50) {
      this.errors.name = "Имя не должно превышать 50 символов";
      isValid = false;
    }

    if (!this.formData.email.trim()) {
      this.errors.email = "Введите email";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email.trim())) {
      this.errors.email = "Введите корректный email";
      isValid = false;
    }

    if (!this.formData.message.trim()) {
      this.errors.message = "Введите сообщение";
      isValid = false;
    } else if (this.formData.message.trim().length < 10) {
      this.errors.message = "Сообщение должно содержать минимум 10 символов";
      isValid = false;
    } else if (this.formData.message.length > 1000) {
      this.errors.message = "Сообщение не должно превышать 1000 символов";
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    this.submitSuccess = false;
    this.submitError = "";

    if (!this.validateForm()) {
      return;
    }

    console.log("Форма отправлена:", this.formData);
    this.submitSuccess = true;
    this.formData = {
      topic: "Проблема с входом",
      name: "",
      email: "",
      message: ""
    };

    setTimeout(() => {
      this.submitSuccess = false;
    }, 3000);
  }
}
