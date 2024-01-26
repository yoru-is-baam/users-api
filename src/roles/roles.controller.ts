import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dtos';
import { JwtGuard, PermissionGuard } from '../guards';
import { ActionName, EntityName, ResponseCode } from '../enums';
import { Permission } from '../decorators';
import { RoleIdNotExistsPipe } from './pipes';

@ApiBearerAuth()
@ApiTags('Roles')
@UseGuards(JwtGuard)
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(PermissionGuard)
  @Permission({
    entityName: EntityName.ROLE,
    actionName: ActionName.CREATE,
  })
  @Post()
  async createRole(@Body() dto: CreateRoleDto) {
    const role = await this.rolesService.create(dto);
    return { message: ResponseCode.CREATED, result: { role } };
  }

  @UseGuards(PermissionGuard)
  @Permission({
    entityName: EntityName.ROLE,
    actionName: ActionName.DELETE,
  })
  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe, RoleIdNotExistsPipe) id: number) {
    const role = await this.rolesService.delete(id);
    return { message: ResponseCode.OK, result: { role } };
  }
}
