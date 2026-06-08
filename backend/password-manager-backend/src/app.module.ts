import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SupportModule } from "./support/support.module";
import { ProfileController } from "./profile.controller";
import { User } from "./users/user.entity";
import { LoginAttempt } from "./auth/entities/login-attempt.entity";
import { RefreshToken } from "./auth/entities/refresh-token.entity";
import { SupportMessage } from "./support/entities/support-message.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [User, LoginAttempt, RefreshToken, SupportMessage],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    SupportModule,
  ],
  controllers: [ProfileController],
})
export class AppModule {}
