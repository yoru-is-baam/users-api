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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @Post('/signup')
  @ApiOperation({
    summary: 'Sign up an account',
    description:
      'Users create their account. The first account is the admin account.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign up an account successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input value.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credentials taken.',
  })
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Post('/signin')
  @ApiOperation({
    summary: 'Sign in an account',
    description: 'Users log in their account.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sign in an account successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input value.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credentials incorrect.',
  })
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard, JwtGuard)
  @Post('/signout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sign out an account',
    description: 'Users log out their account.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sign out an account successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not logged in.',
  })
  signOut(@CurrentUser('id') id: number) {
    return this.authService.signOut(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/refresh')
  @ApiOperation({
    summary: 'Refresh a new token',
    description: 'Client automatically request a new refresh token.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Refresh token successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input value.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid token.',
  })
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
