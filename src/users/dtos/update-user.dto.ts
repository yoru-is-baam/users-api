import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(6)
  password: string;
}
