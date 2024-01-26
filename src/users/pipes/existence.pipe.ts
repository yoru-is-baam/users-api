import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class UserIdNotExistsPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const user = await this.usersService.findById(value);
    if (!user) throw new NotFoundException('no user found');
    return value;
  }
}
