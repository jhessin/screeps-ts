import { Finder } from 'utils';
import roleList from 'roles';

Creep.prototype.run = function() {
  if (this.spawning) {
    return ERR_BUSY;
  }

  if (this.memory.working && this.store.energy === 0) {
    this.memory.working = false;
    this.memory.sourceId = undefined;
  } else if (
    !this.memory.working &&
    this.store.getFreeCapacity(RESOURCE_ENERGY) === 0
  ) {
    this.memory.working = true;
    this.memory.targetId = undefined;
  }

  let role = roleList[this.memory.role];

  if (this.working()) {
    return role.work(this);
  } else {
    return role.harvest(this);
  }
};

Creep.prototype.working = function() {
  return this.memory.working;
};

Creep.prototype.role = function() {
  return this.memory.role;
};

Creep.prototype.targetId = function() {
  return this.memory.targetId;
};

Creep.prototype.sourceId = function() {
  return this.memory.sourceId;
};

Creep.prototype.harvestFreeEnergy = function() {
  let id = this.memory.sourceId;
  let finder = new Finder(this);
  let target: EnergySource | null = id
    ? Game.getObjectById(id)
    : finder.FindClosestFreeEnergy();
  if (target) {
    this.memory.sourceId = target.id;
    let code =
      target instanceof Source
        ? this.harvest(target)
        : target instanceof Resource
        ? this.pickup(target)
        : this.withdraw(target as Structure, RESOURCE_ENERGY);
    if (code === ERR_NOT_IN_RANGE) {
      return this.travelTo(target) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Error getting free energy: ${code}`);
      return code;
    }
    return code;
  }

  return ERR_NOT_FOUND;
};

Creep.prototype.harvestEnergy = function() {
  let id = this.memory.sourceId;
  let finder = new Finder(this);
  let target: EnergySource | null = id
    ? Game.getObjectById(id)
    : finder.FindClosestEnergy();
  if (target) {
    this.memory.sourceId = target.id;
    let code =
      target instanceof Source
        ? this.harvest(target)
        : target instanceof Resource
        ? this.pickup(target)
        : this.withdraw(target as Structure, RESOURCE_ENERGY);
    if (code === ERR_NOT_IN_RANGE) {
      return this.travelTo(target) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Error getting work energy: ${code}`);
      return code;
    }
    return code;
  }

  return ERR_NOT_FOUND;
};

Creep.prototype.storeFreeEnergy = function() {
  let id = this.memory.targetId;
  let finder = new Finder(this);
  let target: Structure | void | null =
    id !== undefined
      ? Game.getObjectById(id)
      : finder.FindClosestStorageFacility();
  if (target) {
    this.memory.targetId = target.id;
    let code = this.transfer(target, RESOURCE_ENERGY);
    if (code === ERR_NOT_IN_RANGE) {
      return this.travelTo(target) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Error transfering energy: ${code}`);
      return code;
    }
    return code;
  }

  return ERR_NOT_FOUND;
};

Creep.prototype.upgradeRoom = function() {
  let controller = this.room.controller;

  if (controller) {
    let code: ScreepsReturnCode = this.upgradeController(controller);
    if (code === ERR_NOT_IN_RANGE) {
      return this.travelTo(controller) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Couldn't upgrade controller: ${code}`);
      return code;
    }
    return code;
  }

  return ERR_NOT_FOUND;
};
