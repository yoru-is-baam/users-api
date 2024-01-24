import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../enums';
import { Reflector } from '@nestjs/core';
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user) return false;
    return request.user.role === Role.ADMIN;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    return user && roles.includes(user.role);
  }
}
