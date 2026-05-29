import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
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

  private validatePasswordStrength(password: string) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasMinLength) {
      throw new HttpException("Пароль должен содержать минимум 8 символов", HttpStatus.BAD_REQUEST);
    }
    if (!hasUpperCase) {
      throw new HttpException("Пароль должен содержать хотя бы одну заглавную букву", HttpStatus.BAD_REQUEST);
    }
    if (!hasSpecialChar) {
      throw new HttpException("Пароль должен содержать хотя бы один спецсимвол (!@#$%^&*)", HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  async register(email: string, password: string, name?: string) {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException("Email уже зарегистрирован", HttpStatus.BAD_REQUEST);
    }

    this.validatePasswordStrength(password);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashedPassword, name });
    await this.userRepo.save(user);

    return this.generateTokens(user);
  }

  async login(email: string, password: string, ip: string, bruteForceAttempt: any) {
    const user = await this.userRepo.findOne({ where: { email } });
    
    if (!user) {
      throw new HttpException("Пользователь с таким email не найден", HttpStatus.UNAUTHORIZED);
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      let attempt = bruteForceAttempt;
      
      if (!attempt) {
        attempt = await this.loginAttemptRepo.findOne({ where: { email, ip } });
      }
      
      if (!attempt) {
        attempt = this.loginAttemptRepo.create({ email, ip, attempts: 0 });
      }
      
      attempt.attempts += 1;
      attempt.lastAttemptAt = new Date();
      
      await this.loginAttemptRepo.save(attempt);
      
      if (attempt.attempts >= 3) {
        attempt.blockedUntil = new Date(Date.now() + 20 * 60 * 1000);
        await this.loginAttemptRepo.save(attempt);
        throw new HttpException(
          "Слишком много попыток. Доступ заблокирован на 20 минут",
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
      
      const remaining = 3 - attempt.attempts;
      throw new HttpException(`Неверный пароль. Осталось попыток: ${remaining}`, HttpStatus.UNAUTHORIZED);
    }
    
    if (bruteForceAttempt) {
      await this.loginAttemptRepo.delete({ id: bruteForceAttempt.id });
    } else {
      await this.loginAttemptRepo.delete({ email, ip });
    }
    
    return this.generateTokens(user);
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
