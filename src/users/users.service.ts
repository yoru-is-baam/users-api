import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const userCount: number = await this.userRepository.count();
    const user: User = this.userRepository.create({
      email,
      password,
      admin: userCount === 0,
    });

    try {
      const createdUser = await this.userRepository.save(user);
      return createdUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === 'ER_DUP_ENTRY') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  private async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  findUserById(id: number): Promise<User> {
    return this.findById(id);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  findAllUsers(paginationDto: PaginationDto): Promise<User[]> {
    const { page, pageSize } = paginationDto;
    return this.userRepository
      .createQueryBuilder('user')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findById(id);
    return this.userRepository.remove(user);
  }
}
