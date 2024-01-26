import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RolesService } from '../roles.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class RoleNameExists implements ValidatorConstraintInterface {
  constructor(private readonly rolesService: RolesService) {}

  async validate(value: string): Promise<boolean> {
    const role = await this.rolesService.findByName(value);
    if (role) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Role name already exists';
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class RoleIdNotExists implements ValidatorConstraintInterface {
  constructor(private readonly rolesService: RolesService) {}

  async validate(value: number): Promise<boolean> {
    const role = await this.rolesService.findById(value);
    if (!role) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'No role found';
  }
}
