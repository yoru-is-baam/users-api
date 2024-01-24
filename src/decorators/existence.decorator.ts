import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'EmailExistsRule', async: true })
@Injectable()
export class EmailExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(value: any): Promise<boolean> {
    const user = await this.usersService.findByEmail(value);
    if (user) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Email already exists';
  }
}

@ValidatorConstraint({ name: 'AdminExistsRule', async: true })
@Injectable()
export class AdminExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(value: any): Promise<boolean> {
    const admin = await this.usersService.findFirstAdmin();
    if (admin) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Admin already exists';
  }
}
