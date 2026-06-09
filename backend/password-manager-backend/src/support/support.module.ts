import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupportController } from "./support.controller";
import { SupportMessage } from "./entities/support-message.entity";
import { User } from "../users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SupportMessage, User])],
  controllers: [SupportController],
})
export class SupportModule {}
