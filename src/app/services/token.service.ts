import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = "access_token";

  setToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
}
