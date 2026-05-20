import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "ВАШ_СЕКРЕТНЫЙ_КЛЮЧ_ЗАМЕНИТЕ_НА_СЛОЖНЫЙ",
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
