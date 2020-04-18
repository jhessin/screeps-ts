interface RoomPosition {
  // Things that use energy
  findBuildTarget(range: number): ConstructionSite | void;
  findRepairTarget(range: number): Structure | void;
  findWallRepairTarget(): StructureWall | void;
  findTransferTargetPrimary(
    range: number,
    resource?: ResourceConstant,
  ): Structure | Creep | PowerCreep | void;
  findTransferTargetSecondary(
    resource?: ResourceConstant,
  ): Structure | Creep | PowerCreep | void;

  // Things that get energy
  findDismantleTarget(range: number): Structure | void;
  findHarvestTarget(range: number): Source | Mineral | Deposit | void;
  findPickupTarget(range: number): Resource | void;
  findWithdrawTargetPrimary(
    range: number,
    resource?: ResourceConstant,
  ): Structure | Tombstone | Ruin | void;
  findWithdrawTargetSecondary(
    resource?: ResourceConstant,
  ): Structure | Tombstone | Ruin | void;

  // Things that require Claim part
  findClaimTarget(): StructureController | void;
  findReserveTarget(): StructureController | void;

  // Things that require Attack or Ranged Attack part
  findAttackTarget(range: number): Creep | PowerCreep | Structure | void;
  shouldMassAttack(): boolean;

  // Things that require heal part
  findHealTarget(range: number): Creep | PowerCreep | void;
  shouldMassHeal(): boolean;

  // Other things
  findPullTarget(range: number): Creep | void;
  findSignTarget(range: number): StructureController | void;
}

RoomPosition.prototype.findBuildTarget = function(range) {
  return this.findInRange(FIND_CONSTRUCTION_SITES, range)[0];
};

RoomPosition.prototype.findClaimTarget = function() {
  for (let room of Object.values(Game.rooms)) {
    if (
      room.controller &&
      !room.controller.my &&
      !room.controller.owner &&
      (!room.controller.reservation ||
        room.controller.reservation.username === 'Jhessin')
    )
      return room.controller;
  }
  return;
};

RoomPosition.prototype.findDismantleTarget = function(range) {
  for (let flag of this.findInRange(FIND_FLAGS, range)) {
    if (flag.name.startsWith('dismantle')) {
      // find underlying structure.
      let structure = flag.pos.findInRange(FIND_STRUCTURES, 0)[0];
      if (structure && !structure.claimed()) return structure;
    }
  }
  return;
};

RoomPosition.prototype.findHarvestTarget = function(range) {
  let source = this.findInRange(FIND_SOURCES_ACTIVE, range, {
    filter: s => !s.claimed(),
  })[0];
  if (source) return source;

  let mineral = this.findInRange(FIND_MINERALS, range, {
    filter: s =>
      s.pos.findInRange(FIND_STRUCTURES, 0, {
        filter: s => s instanceof StructureExtractor && !s.claimed(),
      }).length > 0,
  })[0];
  if (mineral) return mineral;

  let deposit = this.findInRange(FIND_DEPOSITS, range, {
    filter: s => s.cooldown <= range && !s.claimed(),
  })[0];
  if (deposit) return deposit;

  return;
};

RoomPosition.prototype.findPickupTarget = function(range) {
  return this.findInRange(FIND_DROPPED_RESOURCES, range, {
    filter: s => !s.claimed(),
  })[0];
};

RoomPosition.prototype.findPullTarget = function(range) {
  return this.findInRange(FIND_MY_CREEPS, range, {
    filter: s => s.getActiveBodyparts(MOVE) === 0 && !s.claimed(),
  })[0];
};

RoomPosition.prototype.findAttackTarget = function(range) {
  let creep = this.findInRange(FIND_HOSTILE_CREEPS, range)[0];
  if (creep) return creep;

  let powerCreep = this.findInRange(FIND_HOSTILE_POWER_CREEPS, range)[0];
  if (powerCreep) return powerCreep;

  return this.findInRange(FIND_HOSTILE_STRUCTURES, range)[0];
};

RoomPosition.prototype.shouldMassAttack = function() {
  let enemies: (Creep | PowerCreep | Structure)[] = [];

  for (let enemy of this.findInRange(FIND_HOSTILE_CREEPS, 3)) {
    enemies.push(enemy);
  }

  for (let enemy of this.findInRange(FIND_HOSTILE_POWER_CREEPS, 3)) {
    enemies.push(enemy);
  }

  for (let enemy of this.findInRange(FIND_HOSTILE_STRUCTURES, 3)) {
    enemies.push(enemy);
  }

  return enemies.length > 1;
};

RoomPosition.prototype.findHealTarget = function(range) {
  let powerCreep = this.findInRange(FIND_MY_POWER_CREEPS, range, {
    filter: s => s.hits < s.hitsMax,
  })[0];
  if (powerCreep) return powerCreep;

  let creep = this.findInRange(FIND_MY_CREEPS, range, {
    filter: s => s.hits < s.hitsMax,
  })[0];
  if (creep) return creep;
  return;
};

RoomPosition.prototype.shouldMassHeal = function() {
  let targets: (Creep | PowerCreep)[] = [];

  for (let creep of this.findInRange(FIND_MY_CREEPS, 3, {
    filter: s => s.hits < s.hitsMax,
  })) {
    targets.push(creep);
  }

  for (let creep of this.findInRange(FIND_MY_POWER_CREEPS, 3, {
    filter: s => s.hits < s.hitsMax,
  })) {
    targets.push(creep);
  }

  return targets.length > 1;
};

RoomPosition.prototype.findRepairTarget = function(range) {
  return this.findInRange(FIND_STRUCTURES, range, {
    filter: s => s.hits < s.hitsMax,
  })[0];
};

RoomPosition.prototype.findReserveTarget = function() {
  for (let room of Object.values(Game.rooms)) {
    let controller = room.controller;
    if (!controller) continue;
    if (controller.my) continue;
    if (controller.reservation) continue;
    if (controller.owner) continue;
    return controller;
  }
  return;
};

RoomPosition.prototype.findSignTarget = function(range) {
  for (let room of Object.values(Game.rooms)) {
    let controller = room.controller;
    if (!controller) continue;
    let sign = controller.sign;
    if (!sign) return controller;
    if (controller.my && sign.username != 'Jhessin') return controller;
  }
  return;
};

RoomPosition.prototype.findTransferTargetPrimary = function(range, resource) {
  let structure = this.findInRange(FIND_MY_STRUCTURES, range, {
    filter: s => {
      if (
        s instanceof StructureSpawn ||
        s instanceof StructureExtension ||
        s instanceof StructureTower
      ) {
        let capacity = s.store.getFreeCapacity(resource);
        if (capacity) {
          return capacity > 0;
        }
      }
      return false;
    },
  })[0];
  if (structure) return structure;

  let creep = this.findInRange(FIND_MY_CREEPS, range, {
    filter: s =>
      s.getActiveBodyparts(CARRY) > 0 &&
      s.store.getUsedCapacity(resource) === 0,
  })[0];
  if (creep) return creep;

  let powerCreep = this.findInRange(FIND_MY_POWER_CREEPS, range, {
    filter: s => s.store.getFreeCapacity(resource) > 0,
  })[0];
  if (powerCreep) return powerCreep;
  return;
};

RoomPosition.prototype.findTransferTargetSecondary = function(resource) {
  let structure = this.findClosestByPath(FIND_STRUCTURES, {
    filter: s => {
      let store = (s as { store: GenericStore }).store;
      if (!store) return false;
      let capacity = store.getFreeCapacity(resource);
      // If there is no capacity what does that mean?
      if (!capacity) return false;
      return capacity > 0;
    },
  });
  if (structure) return structure;

  return;
};

RoomPosition.prototype.findWithdrawTargetPrimary = function(range, resource) {
  let tombstone = this.findInRange(FIND_TOMBSTONES, range, {
    filter: s => s.store.getUsedCapacity(resource) > 0,
  })[0];
  if (tombstone) return tombstone;

  let ruin = this.findInRange(FIND_RUINS, range, {
    filter: s => s.store.getUsedCapacity(resource) > 0,
  })[0];
  if (ruin) return ruin;

  let container = this.findInRange(FIND_STRUCTURES, range, {
    filter: s =>
      s instanceof StructureContainer && s.store.getUsedCapacity(resource) > 0,
  })[0];
  if (container) return container;
  return;
};

RoomPosition.prototype.findWithdrawTargetSecondary = function(resource) {
  // Secondary withdraw targets are Storage and Links
  let structure = this.findClosestByPath(FIND_STRUCTURES, {
    filter: s => {
      if (!(s instanceof StructureStorage || s instanceof StructureLink))
        return false;
      let store = s.store;
      if (!store) return false;
      let usedCapacity = store[resource || RESOURCE_ENERGY];
      return usedCapacity > 0;
    },
  });
  if (structure) return structure;

  return;
};

RoomPosition.prototype.findWallRepairTarget = function() {
  let walls = this.findInRange(FIND_STRUCTURES, 79, {
    filter: s => s instanceof StructureWall && s.hits < s.hitsMax,
  }) as StructureWall[];

  let target: StructureWall | undefined;
  for (let wall of walls) {
    if (!target) target = wall;
    if (wall.hits < target.hits) target = wall;
  }
  return target;
};
