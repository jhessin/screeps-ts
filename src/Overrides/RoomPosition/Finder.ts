interface RoomPosition {
  findBuildTarget(range: number): ConstructionSite | void;
  findClaimTarget(): StructureController | void;
  findDismantleTarget(range: number): Structure | void;
  findHarvestTarget(range: number): Source | Mineral | Deposit | void;
  findPickupTarget(range: number): Resource | void;
  findPullTarget(range: number): Creep | void;
  findAttackTarget(range: number): Creep | PowerCreep | Structure | void;
  shouldMassAttack(): boolean;
  findHealTarget(range: number): Creep | PowerCreep | void;
  shouldMassHeal(): boolean;
  findRepairTarget(range: number): Structure | void;
  findReserveTarget(): StructureController | void;
  findSignTarget(range: number): StructureController | void;
  findTransferTargetPrimary(
    range: number,
  ): Structure | Creep | PowerCreep | void;
  findTransferTargetSecondary(): Structure | Creep | PowerCreep;
  findWithdrawTargetPrimary(range: number): Structure | Tombstone | Ruin;
  findWithdrawTargetSecondary(): Structure | Tombstone | Ruin;
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
      !room.controller.reservation
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
  let source = this.findInRange(FIND_SOURCES_ACTIVE, range)[0];
  if (source) return source;

  let mineral = this.findInRange(FIND_MINERALS, range, {
    filter: s =>
      s.pos.findInRange(FIND_STRUCTURES, 0, {
        filter: s => s instanceof StructureExtractor,
      }).length > 0,
  })[0];
  if (mineral) return mineral;

  let deposit = this.findInRange(FIND_DEPOSITS, range, {
    filter: s => s.cooldown < range,
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
  }
};
