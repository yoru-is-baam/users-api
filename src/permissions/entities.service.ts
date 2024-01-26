import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EntitiesService {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number) {
    return this.prismaService.entity.findUnique({ where: { id } });
  }
}
