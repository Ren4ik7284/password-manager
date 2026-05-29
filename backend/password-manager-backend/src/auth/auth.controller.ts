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
    try {
      return await this.authService.register(body.email, body.password, body.name);
    } catch (error) {
      throw error;
    }
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BruteForceGuard)
  async login(@Body() body: { email: string; password: string }, @Req() req: Request) {
    try {
      const ip = req.ip || req.connection?.remoteAddress || "unknown";
      const bruteForceAttempt = req["bruteForceAttempt"];
      return await this.authService.login(body.email, body.password, ip, bruteForceAttempt);
    } catch (error) {
      throw error;
    }
  }
}
