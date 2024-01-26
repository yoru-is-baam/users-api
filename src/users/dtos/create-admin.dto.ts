import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { AdminExists } from '../decorators';

export class CreateAdminDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @Validate(AdminExists)
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(3, 20, { message: 'Password has length from 3 to 20 chars' })
  password: string;
}
