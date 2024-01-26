import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PermissionsService } from '../permissions/permissions.service';
import { RoleNameExists } from './decorators';

@Module({
  controllers: [RolesController],
  providers: [RolesService, PermissionsService, RoleNameExists],
  exports: [RolesService],
})
export class RolesModule {}
