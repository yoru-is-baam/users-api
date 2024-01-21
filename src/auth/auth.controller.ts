import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthDto } from './dtos';
import { AuthService } from './auth.service';
import { RefreshDto } from './dtos/refresh.dto';
import { GetMe } from '../users/decorators';
import { JwtGuard } from './guards';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Post('/signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @UseGuards(JwtGuard)
  @Post('/signout')
  signOut(@GetMe('id') id: number) {
    return this.authService.signOut(id);
  }

  @Post('/refresh')
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
