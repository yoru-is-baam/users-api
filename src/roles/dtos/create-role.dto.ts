import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { RoleNameExists } from '../decorators';

export class CreateRoleDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(RoleNameExists)
  name: string;
}
