import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../users/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    
    if (!userId) {
      throw new ForbiddenException("Не авторизован");
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user || !requiredRoles.includes((user as any).role)) {
      throw new ForbiddenException("Доступ запрещен. Требуются права администратора");
    }

    return true;
  }
}

export const Roles = (...roles: string[]) => (target: any, key?: string, descriptor?: any) => {
  Reflect.defineMetadata("roles", roles, descriptor ? descriptor.value : target);
  return descriptor ? descriptor : target;
};
