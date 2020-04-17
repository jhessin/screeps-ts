interface Creep {
  run(): ScreepsReturnCode;
}

Creep.prototype.run = function() {
  // first check for existing task
  let code = runExistingAction(this);
  if (code !== false) return code;
  for (let range = 1; range < 79; range++) {
    // TODO find appropriate actions based on active body parts.
    if (this.getActiveBodyparts(CARRY) > 0) {
      // we carry energy do we have any to use?
      if (this.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        // look for something to do with energy
        // find energy use facility
        let target: RoomObject | null = this.pos.findInRange(
          FIND_STRUCTURES,
          range,
          {
            filter: s =>
              (s instanceof StructureSpawn ||
                s instanceof StructureExtension ||
                s instanceof StructureTower) &&
              s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
          },
        )[0];
        if (target) return this.transfer(target as Structure, RESOURCE_ENERGY);

        // find any other structures that have storage
        target = this.pos.findInRange(FIND_STRUCTURES, range, {
          filter: s => {
            let storable = s as { store: GenericStore };
            let store = storable.store;
            let capacity = store.getFreeCapacity(RESOURCE_ENERGY);
            return capacity && capacity > 0;
          },
        })[0];
        if (target) return this.transfer(target as Structure, RESOURCE_ENERGY);
        if (this.getActiveBodyparts(WORK)) {
          // find repair targets
          target = this.pos.findInRange(FIND_STRUCTURES, range, {
            filter: s =>
              s.hits < s.hitsMax &&
              !(s instanceof StructureWall || s instanceof StructureRampart),
          })[0];
          if (target) return this.repair(target as Structure);

          // find build targets
          target = this.pos.findInRange(FIND_CONSTRUCTION_SITES, range)[0];
          if (target) return this.repair(target as Structure);

          // find the room controller to upgrade
          target = this.pos.findInRange(FIND_STRUCTURES, range, {
            filter: s => s instanceof StructureController,
          })[0];
          if (target)
            return this.upgradeController(target as StructureController);
        }
        // find creeps with no energy and give half
        target = this.pos.findInRange(FIND_MY_CREEPS, range, {
          filter: s => s.store.getUsedCapacity(RESOURCE_ENERGY) === 0,
        })[0];
        if (target)
          return this.transfer(
            target as Creep,
            RESOURCE_ENERGY,
            this.store.getUsedCapacity(RESOURCE_ENERGY) / 2,
          );
      } else if (this.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        // TODO No Energy try to find some
        // find dropped resources
        // find tombstones
        // find ruins
        // IF we have a WORK part we can harvest from source
      }
    }
  }
  return OK;
};

function runExistingAction(creep: Creep): ScreepsReturnCode | false {
  let action = creep.memory.action;
  let id = creep.memory.targetId;
  if (!id || !action) {
    resetAction(creep);
    return false;
  }
  let target = Game.getObjectById(id);
  if (!target) {
    resetAction(creep);
    return false;
  }
  let resource = creep.memory.resource;
  if (!resource) resource = RESOURCE_ENERGY;

  switch (action) {
    case 'attack':
    case 'attackController':
    case 'build':
    case 'claimController':
    case 'dismantle':
    case 'harvest':
    case 'heal':
    case 'pickup':
    case 'reserveController':
    case 'upgradeController':
      return creep[action](target);
    case 'transfer':
    case 'withdraw':
      return creep[action](target, resource);
    case 'signController':
      return creep[action](target, 'Claimed by Grillbrick!');
    default:
      return false;
  }
}
