import { Controller, Post, Body } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Controller("auth")
export class AuthController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post("register")
  async register(@Body() body: { email: string; password: string }) {
    const existing = await this.userRepository.findOne({ where: { email: body.email } });
    if (existing) {
      return { success: false, message: "Пользователь уже существует" };
    }
    
    const user = this.userRepository.create({ email: body.email, password: body.password });
    await this.userRepository.save(user);
    
    return { 
      success: true, 
      email: body.email, 
      message: "Регистрация успешна",
      isLoggedIn: true
    };
  }

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userRepository.findOne({ 
      where: { email: body.email, password: body.password } 
    });
    
    if (user) {
      return { 
        success: true, 
        email: body.email, 
        message: "Вход выполнен",
        isLoggedIn: true
      };
    }
    return { success: false, message: "Неверный email или пароль" };
  }
}
