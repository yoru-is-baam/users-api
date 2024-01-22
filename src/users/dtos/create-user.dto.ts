import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    example: 'johnsmith@gmail.com',
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
