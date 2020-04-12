import { Finder } from 'utils';
import { BasicRoles, SpecialRoles } from 'roles';
import { RoleNames } from 'roles/roleNames';

Creep.prototype.run = function() {
  if (!validateSource(this)) this.memory.sourceId = undefined;
  if (!validateTarget(this)) this.memory.targetId = undefined;

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

  // First check for basic roles
  let role = BasicRoles[this.memory.role];

  // Then check for special roles
  if (!role) role = SpecialRoles[this.memory.role];

  // Finally assign a default if none of those are valid
  if (!role) {
    console.log('INVALID ROLE DETECTED CREATING UPGRADER');
    this.memory.role = RoleNames.UPGRADER;
    role = BasicRoles[RoleNames.UPGRADER];
  }

  if (this.memory.working) {
    return role.work(this);
  } else {
    return role.harvest(this);
  }
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
      target instanceof Resource
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
  let target: Structure | void | null = id
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

  return this.upgradeRoom();
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

function validateSource(creep: Creep): boolean {
  // First sources - they must exist and must have energy
  let sourceId = creep.memory.sourceId;
  if (!sourceId) return true;
  let source = Game.getObjectById(sourceId);

  if (!source) return false;

  if (source instanceof Source && source.energy > 0) return true;
  if (
    (source instanceof Ruin || source instanceof Tombstone) &&
    source.store.getUsedCapacity(RESOURCE_ENERGY) > 0
  )
    return true;

  if (source instanceof Resource) return true;

  if (
    source instanceof StructureContainer &&
    source.store.getUsedCapacity(RESOURCE_ENERGY) > 0
  )
    return true;

  if (
    source instanceof StructureLink &&
    source.store.getUsedCapacity(RESOURCE_ENERGY) > 0
  )
    return true;

  if (
    source instanceof StructureStorage &&
    source.store.getUsedCapacity(RESOURCE_ENERGY) > 0
  )
    return true;

  if (
    source instanceof StructureTerminal &&
    source.store.getUsedCapacity(RESOURCE_ENERGY) > 0
  )
    return true;

  return false;
}

function validateTarget(creep: Creep): boolean {
  // Now targets - they must exist - be structures - and either have a store needing energy or be a RoomController
  let targetId = creep.memory.targetId;
  if (!targetId) return true;
  let target: HasStore | null = Game.getObjectById(targetId);

  if (!target) return false;

  if (
    target instanceof ConstructionSite &&
    creep.memory.role === RoleNames.BUILDER
  )
    return true;

  if (!(target instanceof Structure || target instanceof ConstructionSite))
    return false;

  if (!target.store || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0)
    return false;

  return true;
}
