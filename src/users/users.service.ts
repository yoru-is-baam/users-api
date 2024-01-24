import { PasswordService } from '../password/password.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, PaginationDto } from './dtos';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from '../auth/dtos';
import { Role, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async create(dto: CreateUserDto) {
    const hashedPassword: string = await this.passwordService.hashPassword(
      dto.password,
    );
    return this.prismaService.user.create({
      data: { email: dto.email, password: hashedPassword },
    });
  }

  async createAdmin(dto: CreateAdminDto) {
    const hashedPassword: string = await this.passwordService.hashPassword(
      dto.password,
    );
    return this.prismaService.user.create({
      data: { email: dto.email, password: hashedPassword, role: Role.ADMIN },
    });
  }

  findById(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  findFirstAdmin() {
    return this.prismaService.user.findFirst({
      where: { role: Role.ADMIN },
    });
  }

  findAllUsers(paginationDto: PaginationDto): Promise<User[]> {
    const { page, pageSize } = paginationDto;
    return this.prismaService.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    if ('password' in attrs)
      attrs.password = await this.passwordService.hashPassword(attrs.password);
    const user = await this.prismaService.user.update({
      where: { id },
      data: { ...attrs },
    });
    return user;
  }

  async remove(id: number): Promise<User> {
    return this.prismaService.user.delete({ where: { id } });
  }
}
