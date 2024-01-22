import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthDto } from './dtos';
import { RefreshDto } from './dtos/refresh.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const authDto: AuthDto = { email: 'test@gmail.com', password: 'test' };
  const mockToken: string = 'mockToken';

  const mockAuthService: Partial<AuthService> = {
    signUp: (authDto: AuthDto) => Promise.resolve({ accessToken: mockToken }),
    signIn: (authDto: AuthDto) =>
      Promise.resolve({ accessToken: mockToken, refreshToken: mockToken }),
    signOut: (id: number) =>
      Promise.resolve({ accessToken: mockToken, refreshToken: mockToken }),
    refresh: (refreshDto: RefreshDto) =>
      Promise.resolve({ accessToken: mockToken, refreshToken: mockToken }),
  };
  const mockThrottlerGuard = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue(mockThrottlerGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up a user successfully', async () => {
    const result: { accessToken: string } = await controller.signUp(authDto);
    expect(result).toEqual({ accessToken: mockToken });
  });

  it('should sign in a user successfully', async () => {
    const result: { accessToken: string; refreshToken: string } =
      await controller.signIn(authDto);
    expect(result).toEqual({ accessToken: mockToken, refreshToken: mockToken });
  });

  it('should sign out a user successfully', async () => {
    const id: number = 1;
    const result: { accessToken: string; refreshToken: string } =
      await controller.signOut(id);
    expect(result).toEqual({ accessToken: mockToken, refreshToken: mockToken });
  });

  it('should refresh token successfully', async () => {
    const refreshDto: RefreshDto = {
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJlbWFpbCI6InZsYWRAZ21haWwuY29tIiwiaWF0IjoxNzA1ODE2ODQ4LCJleHAiOjE3MDU4MTc3NDh9.YSndUWU9WLCPHSNa7Bm7IdbhtQrPQFRo70YNBF7bsko',
    };
    const result: { accessToken: string; refreshToken: string } =
      await controller.refresh(refreshDto);
    expect(result).toEqual({ accessToken: mockToken, refreshToken: mockToken });
  });
});
