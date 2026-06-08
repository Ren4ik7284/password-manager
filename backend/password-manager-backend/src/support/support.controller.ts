import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SupportMessage } from "./entities/support-message.entity";
import { CreateSupportMessageDto } from "./dto/create-support-message.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("support")
export class SupportController {
  constructor(
    @InjectRepository(SupportMessage)
    private supportRepo: Repository<SupportMessage>,
  ) {}

  @Post("send-message")
  async sendMessage(@Body() dto: CreateSupportMessageDto) {
    const message = this.supportRepo.create({
      topic: dto.topic,
      name: dto.name,
      email: dto.email,
      message: dto.message,
      status: "new"
    });

    await this.supportRepo.save(message);

    return {
      success: true,
      message: "Сообщение отправлено",
      id: message.id
    };
  }

  @Get("my-messages")
  @UseGuards(JwtAuthGuard)
  async getMyMessages(@Request() req) {
    const userId = req.user.userId;
    const messages = await this.supportRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" }
    });
    return messages;
  }
}
