import { default as db } from '../../db/typeorm.config';
import { RoleDTO } from '../dto/role.dto';
import { Role } from '../entities/roles.entity';
import { RoleNames, RolePermissions } from '../enums/roles.enum';

const rolesSeed: RoleDTO[] = [];

for (const roleName of Object.values(RoleNames)) {
  const permissions: RolePermissions[] = [];

  for (const permission of Object.values(RolePermissions)) {
    if (roleName == RoleNames.USER) {
      if (permission == RolePermissions.LIST_PRODUCT) {
        permissions.push(permission);
      }
    } else if (roleName == RoleNames.MANAGER) {
      if (permission != RolePermissions.DELETE_PRODUCT) {
        permissions.push(permission);
      }
    } else {
      permissions.push(permission);
    }
  }

  const role: RoleDTO = {
    name: roleName,
    permissions,
  };

  rolesSeed.push(role);
}

async function runSeed() {
  const connection = await db.initialize();

  try {
    for (const role of rolesSeed) {
      const existingRole = await connection
        .getRepository(Role)
        .findOneBy({ name: role.name });

      if (!existingRole) {
        await connection.getRepository(Role).save(role);
      }
    }
    console.log('Seed executed successfully.');
  } catch (error) {
    console.error('Error executing seed: ', error);
  } finally {
    await connection.destroy();
  }
}

runSeed();
