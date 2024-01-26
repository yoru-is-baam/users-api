import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../types';

export const Permission = (permission: PermissionType) => {
  return SetMetadata('permission', permission);
};
