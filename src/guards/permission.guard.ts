import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionType } from '../types';
import { PermissionsService } from '../permissions/permissions.service';
import { Role } from '../enums';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, body, params } = context.switchToHttp().getRequest();
    // ADMIN IS IMMUTABLE
    if (body?.roleId === Role.ADMIN || params?.id === Role.ADMIN) return false;

    const permission = this.reflector.get<PermissionType>(
      'permission',
      context.getHandler(),
    );
    if (!permission) return true;

    const isAllowed = await this.permissionsService.findPermission(
      user.roleId,
      permission.actionName,
      permission.entityName,
    );
    return !!isAllowed;
  }
}
