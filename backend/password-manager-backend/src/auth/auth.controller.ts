import { Controller, Post, Body, Req, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { BruteForceGuard } from "./guards/brute-force.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: { email: string; password: string; name?: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BruteForceGuard)
  async login(@Body() body: { email: string; password: string }, @Req() req: Request) {
    const bruteForceAttempt = req["bruteForceAttempt"];
    return this.authService.login(body.email, body.password, bruteForceAttempt);
  }
}
