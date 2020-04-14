import { RoleName } from 'roles/RoleNames';

export const CreepsWithRole = (role: Role): Creep[] =>
  _.filter(Game.creeps, c => c.memory.role === role.memory.role);

export const CreepsWithRoleName = (roleName: RoleName): Creep[] =>
  _.filter(Game.creeps, c => c.memory.role === roleName);
