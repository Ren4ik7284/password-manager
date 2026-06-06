import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProfileController } from "./profile.controller";
import { User } from "./users/user.entity";
import { LoginAttempt } from "./auth/entities/login-attempt.entity";
import { RefreshToken } from "./auth/entities/refresh-token.entity";

@Module({
  imports: [
    CacheModule.register({
      ttl: 60000,
      max: 100,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [User, LoginAttempt, RefreshToken],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [ProfileController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
