import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../users/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;

  const authDto: AuthDto = { email: 'test@gmail.com', password: 'test' };
  const mockToken: string = 'mockToken';
  const user: Partial<User> = {
    id: 1,
    email: authDto.email,
    password: authDto.password,
    admin: false,
    comparePassword: async (plainPassword: string) => plainPassword === 'test',
  };

  const mockConfigService = {
    get: (property: string) => Promise.resolve('property'),
  };

  const mockJwtService = {
    signAsync: async (
      payload: { sub: number; email: string; isAdmin: boolean },
      { expiresIn, secret }: { expiresIn: string; secret: string },
    ) => Promise.resolve(mockToken),
    verify: async (token: string, { secret }: { secret: string }) =>
      Promise.resolve({ sub: user.id, email: user.email, isAdmin: user.admin }),
  };

  beforeEach(async () => {
    mockUsersService = {
      findByEmail: (email: string) => Promise.resolve(user as User),
      findAllUsers: (paginationDto: PaginationDto) => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve(user as User),
      update: (id: number, attrs: Partial<User>) =>
        Promise.resolve(user as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user and return access token', async () => {
      const result = await service.signUp(authDto);
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should throw ForbiddenException if credentials are taken', async () => {
      mockUsersService.create = () =>
        Promise.reject(new ForbiddenException('Credentials taken'));

      try {
        await service.signUp(authDto);
        // If the promise is not rejected, fail the test
        fail(
          'Expected service.signUp to throw ForbiddenException, but it did not throw',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Credentials taken');
      }
    });
  });

  describe('signin', () => {
    it('should sign in and return two tokens', async () => {
      const result = await service.signIn(authDto);
      expect(result).toEqual({
        accessToken: mockToken,
        refreshToken: mockToken,
      });
    });

    it('should throw ForbiddenException if credentials are correct', async () => {
      user.comparePassword = async (plainPassword: string) => false;

      try {
        await service.signIn(authDto);
        // If the promise is not rejected, fail the test
        fail(
          'Expected service.signIn to throw ForbiddenException, but it did not throw',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Credentials incorrect');
      }
    });
  });

  describe('signout', () => {
    it('should sign out and return two outdated tokens', async () => {
      const result = await service.signOut(user.id);
      expect(result).toEqual({
        accessToken: mockToken,
        refreshToken: mockToken,
      });
    });
  });

  describe('refresh', () => {
    it('should refresh and return two tokens', async () => {
      const refreshDto: RefreshDto = {
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJlbWFpbCI6InZsYWRAZ21haWwuY29tIiwiaWF0IjoxNzA1ODE2ODQ4LCJleHAiOjE3MDU4MTc3NDh9.YSndUWU9WLCPHSNa7Bm7IdbhtQrPQFRo70YNBF7bsko',
      };
      const result = await service.refresh(refreshDto);
      expect(result).toEqual({
        accessToken: mockToken,
        refreshToken: mockToken,
      });
    });
  });
});
