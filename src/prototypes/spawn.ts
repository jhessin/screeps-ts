import { getRandomName } from 'names';
import { RoleNames } from 'roles/RoleNames';
import { BasicRoles } from 'roles';

StructureSpawn.prototype.spawnRole = function(
  role: Role,
  emergency: boolean = false,
) {
  let energy = emergency
    ? this.room.energyAvailable
    : this.room.energyCapacityAvailable;
  let cost = bodyCost(role.body);
  let numParts = Math.floor(energy / cost);
  let body: BodyPartConstant[] = [];

  role.body.forEach(part => {
    for (let i = 0; i < numParts; i++) {
      body.push(part);
    }
  });

  return this.spawnCreep(body, getRandomName(), {
    memory: role.memory,
  });
};

function bodyCost(body: BodyPartConstant[]): number {
  return _.sum(body, p => BODYPART_COST[p]);
}

StructureSpawn.prototype.roleDemand = function(role: Role): number {
  // initialize if necessary
  if (!this.memory.roles) {
    this.memory.roles = {
      [RoleNames.MINER]: 2,
      [RoleNames.LORRY]: 2,
      [RoleNames.BUILDER]: 2,
      [RoleNames.UPGRADER]: 2,
      [RoleNames.REPAIRER]: 2,
      [RoleNames.WALL_REPAIRER]: 2,
      [RoleNames.SPECIALIST]: 0,
    };
  }

  return this.memory.roles[role.memory.role];
};

StructureSpawn.prototype.spawnMiner = function(
  emergency: boolean = false,
): ScreepsReturnCode {
  let energy = emergency
    ? this.room.energyAvailable
    : this.room.energyCapacityAvailable;
  let role = BasicRoles.miner;
  let cost = bodyCost(role.body);
  let numParts = Math.floor(energy / cost);
  let body: BodyPartConstant[] = [];

  while (bodyCost(role.body) > energy) {
    role.body.shift();
  }

  // Special case for miners
  return this.spawnCreep(role.body, getRandomName(), {
    memory: role.memory,
  });
};
