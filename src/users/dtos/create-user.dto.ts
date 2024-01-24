import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { EmailExistsRule } from '../../decorators';

export class CreateUserDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Validate(EmailExistsRule)
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
