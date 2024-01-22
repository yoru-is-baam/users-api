import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RefreshDto } from './dtos/refresh.dto';
import { Token } from './enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(authDto: AuthDto) {
    try {
      const user = await this.usersService.create(
        authDto.email,
        authDto.password,
      );
      const payload = { sub: user.id, email: user.email, isAdmin: user.admin };
      const accessToken = await this.generateToken(payload, Token.ACCESS_TOKEN);

      return { accessToken };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ForbiddenException('Credentials taken');
      }
    }
  }

  async signIn(authDto: AuthDto) {
    // find the user by email
    const user = await this.usersService.findUserByEmail(authDto.email);
    if (!user || !(await user.comparePassword(authDto.password)))
      throw new ForbiddenException('Credentials incorrect');

    const payload = { sub: user.id, email: user.email, isAdmin: user.admin };
    const accessToken = await this.generateToken(payload, Token.ACCESS_TOKEN);
    const refreshToken = await this.generateToken(payload, Token.REFRESH_TOKEN);

    // update refresh token
    await this.usersService.update(user.id, { refreshToken });

    return { accessToken, refreshToken };
  }

  async signOut(id: number) {
    const payload = { sub: id };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '0s',
      secret: 'logouttokensecret',
    });
    await this.usersService.update(id, { refreshToken: null });
    return { accessToken: token, refreshToken: token };
  }

  private generateToken(
    payload: { sub: number; email: string; isAdmin: boolean },
    token: Token,
  ) {
    let expiresIn: string, secret: string;

    if (token === Token.ACCESS_TOKEN) {
      expiresIn = this.config.get('ACCESS_TOKEN_LIFETIME');
      secret = this.config.get('ACCESS_TOKEN_SECRET');
    } else if (token === Token.REFRESH_TOKEN) {
      expiresIn = this.config.get('REFRESH_TOKEN_LIFETIME');
      secret = this.config.get('REFRESH_TOKEN_SECRET');
    }

    return this.jwtService.signAsync(payload, { expiresIn, secret });
  }

  async refresh(refreshDto: RefreshDto) {
    try {
      // check if refresh token is valid
      const { email } = await this.jwtService.verify(refreshDto.refreshToken, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.findUserByEmail(email);

      // generate new tokens
      const payload = { sub: user.id, email: user.email, isAdmin: user.admin };
      const newAccessToken = await this.generateToken(
        payload,
        Token.ACCESS_TOKEN,
      );
      const newRefreshToken = await this.generateToken(
        payload,
        Token.REFRESH_TOKEN,
      );

      // update new refresh token
      await this.usersService.update(user.id, {
        refreshToken: newRefreshToken,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
