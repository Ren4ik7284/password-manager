import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SupportMessage } from "./entities/support-message.entity";
import { CreateSupportMessageDto } from "./dto/create-support-message.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard, Roles } from "../auth/guards/roles.guard";

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

  @Get("admin/all-messages")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async getAllMessages() {
    const messages = await this.supportRepo.find({
      order: { createdAt: "DESC" }
    });
    return messages;
  }

  @Post("admin/update-status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async updateStatus(@Body() body: { id: number; status: string }) {
    await this.supportRepo.update(body.id, { status: body.status });
    return { success: true };
  }
}
