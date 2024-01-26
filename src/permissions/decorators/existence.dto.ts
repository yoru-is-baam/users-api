import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActionsService } from '../actions.service';
import { EntitiesService } from '../entities.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ActionIdNotExists implements ValidatorConstraintInterface {
  constructor(private readonly actionsService: ActionsService) {}

  async validate(value: number): Promise<boolean> {
    const action = await this.actionsService.findById(value);
    if (!action) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'No action found';
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class EntityIdNotExists implements ValidatorConstraintInterface {
  constructor(private readonly entitiesService: EntitiesService) {}

  async validate(value: number): Promise<boolean> {
    const entity = await this.entitiesService.findById(value);
    if (!entity) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'No entity found';
  }
}
