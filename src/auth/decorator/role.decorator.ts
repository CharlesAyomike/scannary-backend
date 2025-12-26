import { SetMetadata } from '@nestjs/common';
import { Roles as AllRoles } from 'src/entities/users.entity';

export const RolesKey: string = 'adminRole';
export const Roles = (...adminRoles: [AllRoles, ...AllRoles[]]) =>
  SetMetadata(RolesKey, adminRoles);
