import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-generator",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./generator.html",
  styleUrls: ["./generator.css"]
})
export class GeneratorComponent {
  length = 16;
  useUppercase = true;
  useLowercase = true;
  useNumbers = true;
  useSymbols = true;
  password = "";
  copied = false;

  constructor() {
    this.generate();
  }

  generate() {
    let chars = "";
    if (this.useUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (this.useLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (this.useNumbers) chars += "0123456789";
    if (this.useSymbols) chars += "!@#$%^&*";

    if (chars.length === 0) {
      this.password = "Выберите тип символов";
      return;
    }

    let result = "";
    for (let i = 0; i < this.length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.password = result;
  }

  copy() {
    navigator.clipboard.writeText(this.password);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  getStrength(): number {
    let strength = 0;
    if (this.length >= 12) strength++;
    if (this.length >= 16) strength++;
    if (this.useUppercase && this.useLowercase) strength++;
    if (this.useNumbers && this.useSymbols) strength++;
    return Math.min(strength, 4);
  }

  getStrengthText(): string {
    const texts = ["Очень слабый", "Слабый", "Средний", "Хороший", "Отличный"];
    return texts[this.getStrength()];
  }
}
