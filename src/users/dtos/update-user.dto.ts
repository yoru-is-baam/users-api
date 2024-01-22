import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'newpassword',
  })
  @IsString()
  @IsOptional()
  @Length(6)
  password: string;
}
