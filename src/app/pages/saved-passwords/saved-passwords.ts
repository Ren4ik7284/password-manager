import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PasswordHistoryService, SavedPassword } from "../../services/password-history.service";

@Component({
  selector: "app-saved-passwords",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./saved-passwords.html",
  styleUrls: ["./saved-passwords.css"]
})
export class SavedPasswordsComponent implements OnInit {
  passwords: SavedPassword[] = [];
  copiedId: number | null = null;

  constructor(private historyService: PasswordHistoryService) {}

  ngOnInit() {
    this.loadPasswords();
  }

  loadPasswords() {
    this.passwords = this.historyService.getPasswords();
  }

  copyPassword(password: string, id: number) {
    navigator.clipboard.writeText(password);
    this.copiedId = id;
    setTimeout(() => {
      this.copiedId = null;
    }, 2000);
  }

  deletePassword(id: number) {
    this.historyService.deletePassword(id);
    this.loadPasswords();
  }

  clearAll() {
    if (confirm("Удалить все сохраненные пароли?")) {
      this.historyService.clearAll();
      this.loadPasswords();
    }
  }

  getStrengthText(password: string): string {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength++;
    const texts = ["Очень слабый", "Слабый", "Средний", "Хороший", "Отличный"];
    return texts[Math.min(strength, 4)];
  }
}
