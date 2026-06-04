import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";
import { LoginAttempt } from "../entities/login-attempt.entity";

@Injectable()
export class BruteForceGuard implements CanActivate {
  constructor(
    @InjectRepository(LoginAttempt)
    private loginAttemptRepo: Repository<LoginAttempt>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { email } = request.body;
    
    if (!email) return true;

    const attempt = await this.loginAttemptRepo.findOne({
      where: { email }
    });

    if (attempt && attempt.blockedUntil && attempt.blockedUntil > new Date()) {
      const minutesLeft = Math.ceil((attempt.blockedUntil.getTime() - Date.now()) / 60000);
      throw new HttpException(
        `Слишком много попыток. Попробуйте через ${minutesLeft} минут`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    request["bruteForceAttempt"] = attempt;
    return true;
  }
}
