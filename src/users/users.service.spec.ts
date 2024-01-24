import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { QueryFailedError } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from './dtos/pagination.dto';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser = {
    id: 2,
    email: 'test@example.com',
    password: 'password',
    admin: false,
  } as User;

  const mockUserRepository = {
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with correct properties', async () => {
      mockUserRepository.count.mockResolvedValue(0); // Assuming it's the first user
      mockUser.id = 1;
      mockUser.admin = true;
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(mockUser.email, mockUser.password);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
        admin: true, // Admin should be true for the first user
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should create a new user with admin set to false for non-first user', async () => {
      mockUserRepository.count.mockResolvedValue(1); // Assuming it's not the first user
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(mockUser.email, mockUser.password);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
        admin: false, // Admin should be false for non-first user
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if credentials are taken', async () => {
      mockUserRepository.count.mockResolvedValue(1); // Assuming it's not the first user
      mockUserRepository.save.mockRejectedValue(
        new QueryFailedError('', [], {
          code: 'ER_DUP_ENTRY',
        } as any),
      );

      try {
        await service.create(mockUser.email, mockUser.password);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Credentials taken');
      }
    });
  });

  describe('findUserById', () => {
    it('should return user if found by ID', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findById(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found by ID', async () => {
      // Mocking findOneBy to simulate that there is no user with the given ID
      mockUserRepository.findOneBy.mockResolvedValue(null);

      try {
        await service.findById(mockUser.id);
        // If the promise is not rejected, fail the test
        fail(
          'Expected service.findUserById to throw NotFoundException, but it did not throw',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('user not found');
      }
    });
  });

  describe('findUserByEmail', () => {
    it('should return user if found by email', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findByEmail(mockUser.email);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users based on pagination', async () => {
      const paginationDto: PaginationDto = { page: 1, pageSize: 10 };
      const mockUsers = [mockUser];

      // Mocking createQueryBuilder to simulate building a query
      const mockQuery = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(mockQuery);
      mockQuery.getMany.mockResolvedValue(mockUsers);

      const result = await service.findAllUsers(paginationDto);

      // Expect the method to return the array of users
      expect(result).toEqual(mockUsers);
      // Expect createQueryBuilder to have been called with the appropriate skip and take values
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith(
        'user',
      );
      expect(mockQuery.skip).toHaveBeenCalledWith(0); // (page - 1) * pageSize = (1 - 1) * 10 = 0
      expect(mockQuery.take).toHaveBeenCalledWith(10); // pageSize
    });
  });

  describe('update', () => {
    const updatedAttrs: Partial<User> = {
      password: 'newpassword',
    };

    it('should update the user with the specified id and return the updated user', async () => {
      const mockUpdatedUser = { ...mockUser, ...updatedAttrs } as User;

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUpdatedUser);

      const result = await service.update(mockUser.id, updatedAttrs);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: mockUser.id,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw NotFoundException if user is not found by ID', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      try {
        await service.update(mockUser.id, updatedAttrs);
        fail(
          'Expected service.update to throw NotFoundException, but it did not throw',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('user not found');
      }
    });
  });

  describe('remove', () => {
    it('should remove the user with the specified id and return the removed user', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: mockUser.id,
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });
  });
});
