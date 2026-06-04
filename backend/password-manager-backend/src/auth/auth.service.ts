import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../users/user.entity";
import { LoginAttempt } from "./entities/login-attempt.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(LoginAttempt)
    private loginAttemptRepo: Repository<LoginAttempt>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException("Email уже зарегистрирован", HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashedPassword, name });
    await this.userRepo.save(user);

    return this.generateTokens(user);
  }

  async login(email: string, password: string, bruteForceAttempt: any) {
    const user = await this.userRepo.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException("Пользователь с таким email не найден");
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      let attempt = bruteForceAttempt;
      
      if (!attempt) {
        attempt = await this.loginAttemptRepo.findOne({ where: { email } });
      }
      
      if (!attempt) {
        attempt = this.loginAttemptRepo.create({ email, attempts: 0 });
      }
      
      attempt.attempts += 1;
      attempt.lastAttemptAt = new Date();
      
      if (attempt.attempts >= 3) {
        attempt.blockedUntil = new Date(Date.now() + 20 * 60 * 1000);
        await this.loginAttemptRepo.save(attempt);
        throw new HttpException(
          "Слишком много попыток. Доступ заблокирован на 20 минут",
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
      
      await this.loginAttemptRepo.save(attempt);
      
      const remaining = 3 - attempt.attempts;
      throw new UnauthorizedException(`Неверный пароль. Осталось попыток: ${remaining}`);
    }
    
    if (bruteForceAttempt) {
      await this.loginAttemptRepo.delete({ id: bruteForceAttempt.id });
    } else {
      await this.loginAttemptRepo.delete({ email });
    }
    
    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      
      if (!user) {
        throw new UnauthorizedException("Пользователь не найден");
      }
      
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException("Невалидный refresh токен");
    }
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    
    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });
    
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name }
    };
  }
}
