import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UserIdNotExistsPipe } from './pipes';
import { EmailExists } from './decorators';
import { PermissionsService } from '../permissions/permissions.service';
import { RoleIdNotExists } from '../roles/decorators';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [UsersController],
  providers: [
    RolesService,
    UsersService,
    UserIdNotExistsPipe,
    EmailExists,
    PermissionsService,
    RoleIdNotExists,
  ],
  exports: [UsersService],
})
export class UsersModule {}
