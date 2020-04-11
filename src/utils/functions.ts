export const CreepsWithRole = (role: Role): Creep[] =>
  _.filter(Game.creeps, c => c.memory.role === role.memory.role);
