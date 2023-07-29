import { SetMetadata } from '@nestjs/common';
import { RolePermissions } from 'src/enums/roles.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: RolePermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
