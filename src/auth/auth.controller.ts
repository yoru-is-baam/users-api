import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dtos';
import { AuthService } from './auth.service';
import { RefreshDto } from './dtos/refresh.dto';
import { CurrentUser } from '../users/decorators';
import { JwtGuard } from '../guards';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('/signout')
  signOut(@CurrentUser('id') id: number) {
    return this.authService.signOut(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/refresh')
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
