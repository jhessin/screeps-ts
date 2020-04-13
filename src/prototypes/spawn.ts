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

  console.log(
    `Spawning ${role.memory.role} creep.\n`,
    `Base body: ${role.body}\n`,
    `Base body cost ${bodyCost(role.body)}\n`,
    `Expanded body: ${body}\n`,
    `Expanded body cost: ${bodyCost(body)}\n`,
  );

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
      [RoleNames.MINER]: calculateMiners(this.room),
      [RoleNames.LORRY]: 1,
      [RoleNames.REPAIRER]: 1,
      [RoleNames.UPGRADER]: 1,
      [RoleNames.BUILDER]: 1,
      [RoleNames.WALL_REPAIRER]: 1,
      [RoleNames.DEFENDER]: calculateDefenders(this.room),
      [RoleNames.SPECIALIST]: calculateSpecialist(this.room),
      [RoleNames.SALVAGER]: calculateSalvager(this.room),
    };
  }

  return this.memory.roles[role.memory.role] || 1;
};
function calculateSpecialist(room: Room): number {
  return 0;
}

function calculateSalvager(room: Room): number {
  return 0;
}

// calculates how man miners we should need for a particular room.
function calculateMiners(room: Room): number {
  return room.find(FIND_SOURCES).length;
}
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

function calculateDefenders(room: Room): number {
  return room.find(FIND_MY_STRUCTURES, {
    filter: s => s instanceof StructureRampart,
  }).length;
}
