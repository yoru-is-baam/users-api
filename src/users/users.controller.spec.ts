import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PaginationDto } from './dtos/pagination.dto';
import { UpdateUserDto } from './dtos';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;

  const updateUserDto: UpdateUserDto = {
    password: 'newpassword',
  };

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@gmail.com',
    password: 'test',
    admin: false,
    comparePassword: async (plainPassword: string) => plainPassword === 'test',
  };

  const updatedUser = { ...mockUser, ...updateUserDto } as User;

  beforeEach(async () => {
    mockUsersService = {
      findById: (id: number) => Promise.resolve(mockUser as User),
      findAllUsers: (paginationDto: PaginationDto) => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve(mockUser as User),
      update: (id: number, attrs: Partial<User>) =>
        Promise.resolve(updatedUser as User),
      remove: (id: number) => Promise.resolve(mockUser as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({})
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the current user', async () => {
    const result = controller.getMe(mockUser as User);
    expect(result).toEqual(mockUser);
  });

  it('should return the user with the specified ID', async () => {
    const result = await controller.findUser(mockUser.id);
    expect(result).toEqual(mockUser);
  });

  it('should return all users with pagination', async () => {
    const paginationDto: PaginationDto = { page: 1, pageSize: 10 };
    // Mocking the findAllUsers method of mockUsersService
    const mockUsers = [
      { id: 1, email: 'test1@gmail.com' },
      { id: 2, email: 'test2@gmail.com' },
    ];
    mockUsersService.findAllUsers = (paginationDto: PaginationDto) =>
      Promise.resolve(mockUsers as User[]);

    const result = await controller.findAllUsers(paginationDto);
    expect(result).toEqual(mockUsers);
  });

  it('should remove a user', async () => {
    const result = await controller.removeUser(mockUser.id);
    expect(result).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const result = await controller.updateUser(mockUser.id, updateUserDto);
    expect(result).toEqual(updatedUser);
  });
});
