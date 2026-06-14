import { Injectable } from "@angular/core";

export interface SavedPassword {
  id: number;
  password: string;
  createdAt: Date;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
}

@Injectable({
  providedIn: "root"
})
export class PasswordHistoryService {
  private storageKey = "saved_passwords";

  getPasswords(): SavedPassword[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  savePassword(password: SavedPassword): void {
    const passwords = this.getPasswords();
    passwords.unshift(password);
    if (passwords.length > 50) {
      passwords.pop();
    }
    localStorage.setItem(this.storageKey, JSON.stringify(passwords));
  }

  deletePassword(id: number): void {
    const passwords = this.getPasswords();
    const filtered = passwords.filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey);
  }
}
