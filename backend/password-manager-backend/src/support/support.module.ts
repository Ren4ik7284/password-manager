import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupportController } from "./support.controller";
import { SupportMessage } from "./entities/support-message.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SupportMessage])],
  controllers: [SupportController],
})
export class SupportModule {}
