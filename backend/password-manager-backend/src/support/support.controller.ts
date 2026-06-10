import { Controller, Post, Body, Get, Delete, UseGuards, Request } from "@nestjs/common";
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
    return { success: true, id: message.id };
  }

  @Get("all-messages")
  @UseGuards(JwtAuthGuard)
  async getAllMessages(@Request() req) {
    const user = await this.supportRepo.manager.query("SELECT * FROM users WHERE id = ?", [req.user.userId]);
    if (!user || (user[0] as any).role !== "admin") {
      return { error: "Доступ запрещен" };
    }
    return await this.supportRepo.query("SELECT * FROM support_messages ORDER BY createdAt DESC");
  }

  @Post("update-status")
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Body() body: { id: number; status: string }, @Request() req) {
    const user = await this.supportRepo.manager.query("SELECT * FROM users WHERE id = ?", [req.user.userId]);
    if (!user || (user[0] as any).role !== "admin") {
      return { error: "Доступ запрещен" };
    }
    await this.supportRepo.query("UPDATE support_messages SET status = ? WHERE id = ?", [body.status, body.id]);
    return { success: true };
  }

  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  async deleteMessage(@Request() req) {
    const user = await this.supportRepo.manager.query("SELECT * FROM users WHERE id = ?", [req.user.userId]);
    if (!user || (user[0] as any).role !== "admin") {
      return { error: "Доступ запрещен" };
    }
    await this.supportRepo.query("DELETE FROM support_messages WHERE id = ?", [req.params.id]);
    return { success: true };
  }
}
