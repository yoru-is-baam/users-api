import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dtos';
import { PasswordService } from '../password/password.service';
import { Payload } from '../types';
import { CreateAdminDto } from '../users/dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {}

  async signUp(dto: CreateUserDto) {
    const { id, email, roleId } = await this.usersService.create(dto);

    const payload = { sub: id, email, roleId };
    const accessToken = await this.signToken(payload);

    return { accessToken };
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // null meaning no email found or password wrong to controller handle
    if (
      !user ||
      !(await this.passwordService.comparePassword(dto.password, user.password))
    )
      return null;

    // generate tokens
    const payload: Payload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
    };
    const accessToken = await this.signToken(payload);

    return { accessToken };
  }

  async signOut(id: number) {
    const payload = {
      sub: id,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '0s',
      secret: 'logouttokensecret',
    });
    return { accessToken: token, refreshToken: token };
  }

  private signToken(payload: Payload) {
    const expiresIn = this.config.get<string>('ACCESS_TOKEN_LIFETIME');
    const secret = this.config.get<string>('ACCESS_TOKEN_SECRET');
    return this.jwtService.signAsync(payload, { expiresIn, secret });
  }

  async createAdminAccount(dto: CreateAdminDto) {
    const { id, email, roleId } = await this.usersService.createAdmin(dto);

    const payload = { sub: id, email, roleId };
    const accessToken = await this.signToken(payload);

    return { accessToken };
  }
}
