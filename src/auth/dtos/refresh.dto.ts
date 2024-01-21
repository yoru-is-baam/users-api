import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
