import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    if (!user) return false;
    const currentUserId = +user.id;
    const updateUserId = +params.id;
    return currentUserId === updateUserId;
  }
}
