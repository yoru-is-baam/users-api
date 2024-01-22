import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const userCount = await this.userRepository.count();
    const user = this.userRepository.create({
      email,
      password,
      admin: userCount === 0,
    });
    return this.userRepository.save(user);
  }

  private async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  findUserById(id: number) {
    return this.findById(id);
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findAllUsers() {
    return this.userRepository.find();
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findById(id);
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    return this.userRepository.remove(user);
  }
}
