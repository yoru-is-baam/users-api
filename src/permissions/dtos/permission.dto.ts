import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, Validate } from 'class-validator';
import { RoleIdNotExists } from '../../roles/decorators';
import { ActionIdNotExists, EntityIdNotExists } from '../decorators';

export class PermissionDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @Validate(RoleIdNotExists)
  roleId: number;

  @ApiProperty({
    required: true,
  })
  @IsInt()
  @IsPositive()
  @Validate(ActionIdNotExists)
  actionId: number;

  @ApiProperty({
    required: true,
  })
  @IsInt()
  @IsPositive()
  @Validate(EntityIdNotExists)
  entityId: number;
}
