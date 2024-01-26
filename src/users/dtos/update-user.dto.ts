import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { RoleIdNotExists } from '../../roles/decorators';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(6)
  password: string;

  @ApiProperty({
    required: false,
  })
  @Validate(RoleIdNotExists)
  @IsInt()
  @IsPositive()
  roleId: number;
}
