import { RoleNames, RolePermissions } from '../enums/roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RoleNames })
  name: RoleNames;

  @Column({ type: 'simple-array', enum: RolePermissions })
  permissions: RolePermissions[];
}
