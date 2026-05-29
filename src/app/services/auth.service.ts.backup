import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private users = [
    { email: "user@example.com", password: "123456" },
    { email: "test@test.com", password: "test123" }
  ];
  
  private isLoggedIn = false;
  private currentUser: string | null = null;

  login(email: string, password: string): boolean {
    console.log("Login attempt:", email, password);
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.isLoggedIn = true;
      this.currentUser = email;
      localStorage.setItem("user", email);
      console.log("Login success");
      return true;
    }
    console.log("Login failed");
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || localStorage.getItem("user") !== null;
  }

  getUser(): string | null {
    return this.currentUser || localStorage.getItem("user");
  }

  register(email: string, password: string): boolean {
    console.log("Register attempt:", email);
    if (this.users.find(u => u.email === email)) {
      console.log("User already exists");
      return false;
    }
    this.users.push({ email, password });
    console.log("Register success, users:", this.users);
    return true;
  }
}
