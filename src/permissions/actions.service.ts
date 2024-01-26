import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActionsService {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number) {
    return this.prismaService.action.findUnique({ where: { id } });
  }
}
