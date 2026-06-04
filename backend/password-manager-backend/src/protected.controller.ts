import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";

@Controller("protected")
export class ProtectedController {
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return { user: req.user };
  }
}
