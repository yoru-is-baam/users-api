import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos';
import { AuthService } from './auth.service';
import { CurrentUser } from '../users/decorators';
import { JwtGuard } from '../guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SignInDto } from './dtos';
import { ResponseCode } from '../enums';
import { CreateAdminDto } from '../users/dtos';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Post('/sign-up')
  async signUp(@Body() dto: CreateUserDto) {
    const result = await this.authService.signUp(dto);
    return { message: ResponseCode.CREATED, result };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Post('/sign-in')
  async signIn(@Body() dto: SignInDto) {
    const result = await this.authService.signIn(dto);
    if (!result) throw new BadRequestException('Wrong credentials');
    return { message: ResponseCode.OK, result };
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard, JwtGuard)
  @Post('/sign-out')
  async signOut(@CurrentUser('id') id: number) {
    const result = await this.authService.signOut(id);
    return { message: ResponseCode.OK, result };
  }

  @Post('sign-up-admin-account')
  @UseGuards(ThrottlerGuard)
  async createAdminAccount(@Body() dto: CreateAdminDto) {
    const result = await this.authService.createAdminAccount(dto);
    return { message: ResponseCode.CREATED, result };
  }
}
