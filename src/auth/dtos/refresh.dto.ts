import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJlbWFpbCI6InZsYWRAZ21haWwuY29tIiwiaWF0IjoxNzA1ODE2ODQ4LCJleHAiOjE3MDU4MTc3NDh9.YSndUWU9WLCPHSNa7Bm7IdbhtQrPQFRo70YNBF7bsko',
  })
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
