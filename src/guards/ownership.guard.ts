import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) return false;
    const currentUserId = +request.user.id;
    const updateUserId = +request.params.id;
    return currentUserId === updateUserId;
  }
}
