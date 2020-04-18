interface Creep {
  run(): number;
}

enum RoleType {
  Miner = 'miner',
  Lorry = 'lorry',
  Worker = 'worker',
  Attacker = 'attacker',
  Claimer = 'claimer',
}

interface CreepMemory {
  role?: RoleType;
  working?: boolean;
}

function setState(creep: Creep) {
  if (
    creep.getActiveBodyparts(WORK) === 0 &&
    creep.getActiveBodyparts(CARRY) > 0
  ) {
    // lorry
    creep.memory.role = RoleType.Lorry;
  } else if (
    creep.getActiveBodyparts(CARRY) === 0 &&
    creep.getActiveBodyparts(WORK) > 0
  ) {
    // miner
    creep.memory.role = RoleType.Miner;
  } else if (
    creep.getActiveBodyparts(CARRY) > 0 &&
    creep.getActiveBodyparts(WORK) > 0
  ) {
    // worker
    creep.memory.role = RoleType.Worker;
  } else if (
    creep.getActiveBodyparts(ATTACK) > 0 ||
    creep.getActiveBodyparts(RANGED_ATTACK) > 0
  ) {
    // attacker
    creep.memory.role = RoleType.Attacker;
  } else if (creep.getActiveBodyparts(CLAIM) > 0) {
    creep.memory.role = RoleType.Claimer;
  }

  if (
    creep.memory.role !== RoleType.Miner &&
    creep.memory.role !== RoleType.Attacker
  ) {
    if (creep.memory.working && creep.store.getUsedCapacity() === 0) {
      creep.memory.working = false;
    } else if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
    }
  }
}

Creep.prototype.run = function() {
  // first update state
  setState(this);

  // now check for existing task
  let code = runExistingAction(this);
  if (code !== false) return code;

  // otherwise inspect for a task
  for (let range = 1; range < 79; range++) {
    // TODO find appropriate actions based on active body parts.
    switch (this.memory.role) {
      case RoleType.Attacker:
        // are we ranged?
        if (this.getActiveBodyparts(RANGED_ATTACK) > 0) {
          // Do we have more than one target in range?
          let targets: (Creep | PowerCreep | Structure)[];
          targets = this.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
          for (let target of this.pos.findInRange(
            FIND_HOSTILE_POWER_CREEPS,
            3,
          )) {
            targets.push(target);
          }
          for (let target of this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3)) {
            targets.push(target);
          }
          for (let target of this.pos.findInRange(FIND_HOSTILE_SPAWNS, 3)) {
            targets.push(target);
          }

          if (targets.length > 1) {
            return this.rangedMassAttack();
          } else {
            let target = targets[0];
            if (target) return this.rangedAttack(target);
          }
        }
        // find enemies or rally flags
        let target: Creep | PowerCreep | Structure = this.pos.findInRange(
          FIND_HOSTILE_CREEPS,
          range,
        )[0];
        if (target) return this.attack(target);
        target = this.pos.findInRange(FIND_HOSTILE_POWER_CREEPS, range)[0];
        if (target) return this.attack(target);
        target = this.pos.findInRange(FIND_HOSTILE_STRUCTURES, range)[0];
        if (target) return this.attack(target);

        let flag = Game.flags.rally;
        if (flag) return this.travelTo(flag);
        break;
      case RoleType.Lorry:
        if (this.memory.working) {
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
          if (target)
            return this.transfer(target as Structure, RESOURCE_ENERGY);

          // find any other structures that have storage
          target = this.pos.findInRange(FIND_STRUCTURES, range, {
            filter: s => {
              let storable = s as { store: GenericStore };
              let store = storable.store;
              let capacity = store.getFreeCapacity(RESOURCE_ENERGY);
              return capacity && capacity > 0;
            },
          })[0];
          if (target)
            return this.transfer(target as Structure, RESOURCE_ENERGY);

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
        } else {
          // TODO No Energy try to find some
          // find dropped resources
          // find tombstones
          // find ruins
        }
        break;
      case RoleType.Worker:
        if (this.memory.working) {
          // find repair targets
          let target: Structure | ConstructionSite = this.pos.findInRange(
            FIND_STRUCTURES,
            range,
            {
              filter: s =>
                s.hits < s.hitsMax &&
                !(s instanceof StructureWall || s instanceof StructureRampart),
            },
          )[0];
          if (target) return this.repair(target as Structure);

          // find build targets
          target = this.pos.findInRange(FIND_CONSTRUCTION_SITES, range)[0];
          if (target) return this.build(target);

          // find the room controller to upgrade
          target = this.pos.findInRange(FIND_STRUCTURES, range, {
            filter: s => s instanceof StructureController,
          })[0];
          if (target)
            return this.upgradeController(target as StructureController);
        } else {
          // not working
          // TODO Gather energy
        }
      case RoleType.Miner:
        // find sources that aren't being mined
        let source = this.pos.findInRange(FIND_SOURCES, range, {
          filter: s => {
            for (let creep of s.room.find(FIND_MY_CREEPS)) {
              if (creep.memory.targetId === s.id) return false;
            }
            return true;
          },
        })[0];
        if (source) this.harvest(source);
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
    case 'generateSafeMode':
    case 'pull':
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
