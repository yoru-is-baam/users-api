import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionDto } from './dtos';

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  grantPermission(dto: PermissionDto) {
    return this.prismaService.permission.create({ data: { ...dto } });
  }

  denyPermission(dto: PermissionDto) {
    return this.prismaService.permission.delete({
      where: { roleId_entityId_actionId: { ...dto } },
    });
  }

  findPermission(roleId: number, actionId: number, entityId: number) {
    return this.prismaService.permission.findUnique({
      where: {
        roleId_entityId_actionId: {
          roleId,
          entityId,
          actionId,
        },
      },
    });
  }
}
