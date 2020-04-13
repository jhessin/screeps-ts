import { RoleNames } from 'roles/RoleNames';

export const CreepsWithRole = (role: Role): Creep[] =>
  _.filter(Game.creeps, c => c.memory.role === role.memory.role);

export const CreepsWithRoleName = (roleName: RoleNames): Creep[] =>
  _.filter(Game.creeps, c => c.memory.role === roleName);
