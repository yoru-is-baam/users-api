import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    required: true,
    example: 'admin@admin.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
