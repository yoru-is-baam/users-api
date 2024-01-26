import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { RolesService } from '../roles.service';

@Injectable()
export class RoleIdNotExistsPipe implements PipeTransform {
  constructor(private readonly rolesService: RolesService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const role = await this.rolesService.findById(value);
    if (!role) throw new NotFoundException('no role found');
    return value;
  }
}
