import { UsersService } from '../users.service';
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'EmailExists', async: true })
@Injectable()
export class EmailExists implements ValidatorConstraintInterface {
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

@ValidatorConstraint({ name: 'AdminExists', async: true })
@Injectable()
export class AdminExists implements ValidatorConstraintInterface {
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
