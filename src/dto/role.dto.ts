import { RoleNames, RolePermissions } from 'src/enums/roles.enum';

export class RoleDTO {
  name: RoleNames;
  permissions: RolePermissions[];
}
