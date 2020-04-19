interface StructureSpawn {
  spawnRole(role: Role, emergency?: boolean): ScreepsReturnCode;
  run(): ScreepsReturnCode;
}

interface CreepMemory {
  room: string;
}

StructureSpawn.prototype.spawnRole = function(role, emergency = false) {
  let startingBody = Bodies[role];
  let endingBody: BodyPartConstant[] = startingBody;
  let room = this.room.name;
  let name = getRandomName(this.room);
  let energy = emergency
    ? this.room.energyAvailable
    : this.room.energyCapacityAvailable;

  // Special cases
  if (role === Role.Miner) {
    while (bodyCost(endingBody) > energy) {
      endingBody.pop();
    }
    if (endingBody.length < 2) return ERR_NOT_ENOUGH_ENERGY;
    return this.spawnCreep(endingBody, name, {
      memory: { room, role },
    });
  }
  if (role === Role.Scout) {
    while (endingBody.length < 3) {
      if (bodyCost(endingBody) >= energy) break;
      endingBody.push(MOVE);
    }
    return this.spawnCreep(endingBody, name, {
      memory: { room, role },
    });
  }

  // Regular roles
  let numParts = Math.floor(energy / bodyCost(startingBody));
  endingBody = [];
  for (let part of startingBody) {
    for (let i = 0; i < numParts; i++) {
      endingBody.push(part);
    }
  }

  return this.spawnCreep(endingBody, name, {
    memory: { room, role },
  });
};

StructureSpawn.prototype.run = function() {
  // Get the total room energy
  let totalEnergy = this.room.energyCapacityAvailable;

  // Get the curent creeps in the room
  let creeps = this.room.findCreeps();
  let upgraders = this.room.findCreeps(Role.Upgrader);
  let miners = this.room.findCreeps(Role.Miner);
  let lorries = this.room.findCreeps(Role.Lorry);
  let workers = this.room.findCreeps(Role.Worker);

  // calculate minimums
  let minMiners = this.room.find(FIND_SOURCES).length;
  minMiners += this.room.find(FIND_STRUCTURES, {
    filter: s => s instanceof StructureExtractor,
  }).length;
  let minLorries = minMiners;

  // First spawn emergencies
  if (miners.length === 0) return this.spawnRole(Role.Miner, true);
  if (lorries.length === 0) return this.spawnRole(Role.Lorry, true);

  // First ensure there are upgraders;
  if (upgraders.length === 0) return this.spawnRole(Role.Upgrader);

  // next spawn miners
  if (miners.length < minMiners) return this.spawnRole(Role.Miner);

  // next lorries
  if (lorries.length < minLorries) return this.spawnRole(Role.Lorry);

  // next we want at least 1 worker
  if (workers.length < 1) return this.spawnRole(Role.Worker);

  // TODO spawn special creeps here

  // Now fill to a maximum number
  if (creeps.length < 10) return this.spawnRole(getRandomRole());

  return ERR_FULL;
};

function getRandomRole(): Role {
  let roles = [Role.Worker, Role.Attacker, Role.Healer, Role.Upgrader];

  let index = Math.floor(Math.random() * roles.length);

  return roles[index];
}

function bodyCost(body: BodyPartConstant[]): number {
  let cost = 0;
  for (let part of body) {
    cost += BODYPART_COST[part];
  }
  return cost;
}
