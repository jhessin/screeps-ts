interface Creep {
  run(): number;
}

enum Role {
  Miner = 'miner',
  Lorry = 'lorry',
  Worker = 'worker',
  Attacker = 'attacker',
  Healer = 'healer',
  Claimer = 'claimer',
  Scout = 'scout',
  Upgrader = 'upgrader',
}

global.Role = Role;

const Bodies: {
  [name in Role]: BodyPartConstant[];
} = {
  [Role.Miner]: [MOVE, WORK, WORK, WORK, WORK, WORK],
  [Role.Lorry]: [CARRY, MOVE],
  [Role.Worker]: [WORK, CARRY, MOVE, MOVE],
  [Role.Upgrader]: [WORK, CARRY, MOVE, MOVE],
  [Role.Attacker]: [TOUGH, RANGED_ATTACK, ATTACK, MOVE, MOVE, MOVE],
  [Role.Healer]: [TOUGH, RANGED_ATTACK, HEAL, MOVE, MOVE, MOVE],
  [Role.Claimer]: [CLAIM, MOVE],
  [Role.Scout]: [MOVE],
};

global.Bodies = Bodies;

const ROOMSIZE = 79;

function not_found(name: string) {
  console.log(`Target not found for ${name}`);
  return ERR_NOT_FOUND;
}

const Actions: {
  [name in Role]: (creep: Creep) => ScreepsReturnCode;
} = {
  [Role.Upgrader]: function(creep) {
    if (creep.memory.working) {
      let controller = creep.room.controller;
      if (controller) return creep.upgradeController(controller);
    } else {
      // Get energy
      for (let range = 0; range < ROOMSIZE; range++) {
        let pickup = creep.pos.findPickupTarget(range, RESOURCE_ENERGY);
        if (pickup && pickup.resourceType === RESOURCE_ENERGY)
          return creep.pickup(pickup);

        let dismantle = creep.pos.findDismantleTarget(range);
        if (dismantle) return creep.dismantle(dismantle);

        let withdraw = creep.pos.findWithdrawTargetPrimary(
          range,
          RESOURCE_ENERGY,
        );
        if (withdraw) return creep.withdraw(withdraw, RESOURCE_ENERGY);

        let harvest = creep.pos.findHarvestTarget(range, RESOURCE_ENERGY);
        if (harvest) return creep.harvest(harvest);
      }
      let withdraw = creep.pos.findWithdrawTargetSecondary(RESOURCE_ENERGY);
      if (withdraw) return creep.withdraw(withdraw, RESOURCE_ENERGY);
    }
    return not_found(creep.memory.role as string);
  },
  [Role.Scout]: function(creep) {
    let scoutFlag = Game.flags.scout;
    if (!scoutFlag) return not_found(creep.memory.role as string);
    return creep.travelTo(scoutFlag) as ScreepsReturnCode;
  },
  [Role.Miner]: function(creep) {
    for (let range = 1; range <= ROOMSIZE; range++) {
      let target = creep.pos.findHarvestTarget(range);
      if (target) {
        let container = target.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: s =>
            s instanceof StructureContainer && s.store.getFreeCapacity() > 0,
        })[0];
        if (container) {
          if (creep.pos.isEqualTo(container.pos)) {
            return creep.harvest(target);
          } else {
            return creep.travelTo(container) as ScreepsReturnCode;
          }
        }
        return creep.harvest(target);
      }
    }
    return not_found(creep.memory.role as string);
  },
  [Role.Lorry]: function(creep) {
    if (creep.memory.working) {
      let resources: ResourceConstant[] = [];
      for (let resource of RESOURCES_ALL) {
        if (creep.store.getUsedCapacity(resource) > 0) resources.push(resource);
      }
      for (let range = 1; range < ROOMSIZE; range++) {
        for (let resource of resources) {
          let transfer = creep.pos.findTransferTargetPrimary(range, resource);
          if (transfer) {
            if (transfer instanceof Creep)
              return creep.transfer(
                transfer,
                resource,
                creep.store.getUsedCapacity(resource) / 2,
              );
            return creep.transfer(transfer, resource);
          }
        }
      }

      for (const resource of resources) {
        let transfer = creep.pos.findTransferTargetSecondary(resource);
        if (transfer) {
          if (transfer instanceof Creep)
            return creep.transfer(
              transfer,
              resource,
              creep.store.getUsedCapacity(resource) / 2,
            );
          return creep.transfer(transfer, resource);
        }
      }
    } else {
      // Get energy
      for (let resource of RESOURCES_ALL) {
        for (let range = 0; range < ROOMSIZE; range++) {
          let pickup = creep.pos.findPickupTarget(range, resource);
          if (pickup) return creep.pickup(pickup);

          let withdraw = creep.pos.findWithdrawTargetPrimary(range, resource);
          if (withdraw) return creep.withdraw(withdraw, resource);
        }
      }
      for (const resource of RESOURCES_ALL) {
        let withdraw = creep.pos.findWithdrawTargetSecondary(resource);
        if (withdraw) return creep.withdraw(withdraw, resource);
      }
    }
    return not_found(creep.memory.role as string);
  },
  [Role.Worker]: function(creep) {
    let resources: ResourceConstant[] = [];
    for (let resource of RESOURCES_ALL) {
      if (creep.store.getUsedCapacity(resource) > 0) resources.push(resource);
    }
    if (creep.memory.working) {
      for (let range = 1; range < ROOMSIZE; range++) {
        if (_.contains(resources, RESOURCE_ENERGY)) {
          let build = creep.pos.findBuildTarget(range);
          if (build) return creep.build(build);
          let repair = creep.pos.findRepairTarget(range);
          if (repair) return creep.repair(repair);
        }

        for (let resource of resources) {
          let transfer = creep.pos.findTransferTargetPrimary(range, resource);
          if (transfer) return creep.transfer(transfer, resource);
        }
      }
      if (_.contains(resources, RESOURCE_ENERGY)) {
        let wall = creep.pos.findWallRepairTarget();
        if (wall) return creep.repair(wall);
      }

      for (let resource of resources) {
        let transfer = creep.pos.findTransferTargetSecondary(resource);
        if (transfer) return creep.transfer(transfer, resource);
      }

      let controller = creep.room.controller;
      if (controller) return creep.upgradeController(controller);
    } else {
      // Get energy
      for (let range = 0; range < ROOMSIZE; range++) {
        let dismantle = creep.pos.findDismantleTarget(range);
        if (dismantle) return creep.dismantle(dismantle);
        for (let resource of RESOURCES_ALL) {
          let pickup = creep.pos.findPickupTarget(range, resource);
          if (pickup) return creep.pickup(pickup);

          let withdraw = creep.pos.findWithdrawTargetPrimary(range, resource);
          if (withdraw) return creep.withdraw(withdraw, resource);
        }

        let harvest = creep.pos.findHarvestTarget(range);
        if (harvest) return creep.harvest(harvest);
      }
      for (let resource of RESOURCES_ALL) {
        let withdraw = creep.pos.findWithdrawTargetSecondary(resource);
        if (withdraw) return creep.withdraw(withdraw, resource);
      }
    }
    return not_found(creep.memory.role as string);
  },
  [Role.Attacker]: function(creep) {
    for (let range = 0; range < ROOMSIZE; range++) {
      if (creep.pos.shouldMassAttack()) {
        return creep.rangedMassAttack() as ScreepsReturnCode;
      }

      let attack = creep.pos.findAttackTarget(range);
      if (attack) return creep.attack(attack);
    }
    let rally = creep.pos.findRallyPoint();
    if (rally) {
      creep.memory.targetId = rally.id;
      return creep.travelTo(rally) as ScreepsReturnCode;
    }

    return not_found(creep.memory.role as string);
  },
  [Role.Healer]: function(creep) {
    for (let range = 0; range < ROOMSIZE; range++) {
      let heal = creep.pos.findHealTarget(range);
      if (heal) return creep.heal(heal);

      if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        if (creep.pos.shouldMassAttack()) return creep.rangedMassAttack();

        let attack = creep.pos.findAttackTarget(range);
        if (attack) return creep.attack(attack);
      }
    }
    let rally = Game.flags.rally;
    if (rally) return creep.travelTo(rally) as ScreepsReturnCode;

    return not_found(creep.memory.role as string);
  },
  [Role.Claimer]: function(creep) {
    let target = creep.pos.findClaimTarget();
    if (target) {
      let code = creep.claimController(target);
      if (code === ERR_GCL_NOT_ENOUGH) {
        return creep.reserveController(target);
      } else {
        return code;
      }
    }
    return not_found(creep.memory.role as string);
  },
};

interface CreepMemory {
  role?: Role;
  resource?: ResourceConstant;
  working?: boolean;
}

function setState(creep: Creep) {
  if (
    creep.memory.role === Role.Upgrader &&
    creep.getActiveBodyparts(WORK) > 0 &&
    creep.getActiveBodyparts(CARRY) > 0
  ) {
    // Upgrader
    creep.memory.role = Role.Upgrader;
  } else if (
    creep.getActiveBodyparts(WORK) === 0 &&
    creep.getActiveBodyparts(CARRY) > 0
  ) {
    // lorry
    creep.memory.role = Role.Lorry;
  } else if (
    creep.getActiveBodyparts(CARRY) === 0 &&
    creep.getActiveBodyparts(WORK) > 0
  ) {
    // miner
    creep.memory.role = Role.Miner;
  } else if (
    creep.getActiveBodyparts(CARRY) > 0 &&
    creep.getActiveBodyparts(WORK) > 0
  ) {
    // worker
    creep.memory.role = Role.Worker;
  } else if (creep.getActiveBodyparts(HEAL) > 0) {
    creep.memory.role = Role.Healer;
  } else if (
    creep.getActiveBodyparts(ATTACK) > 0 &&
    creep.getActiveBodyparts(RANGED_ATTACK) > 0
  ) {
    // attacker
    creep.memory.role = Role.Attacker;
  } else if (creep.getActiveBodyparts(CLAIM) > 0) {
    creep.memory.role = Role.Claimer;
  } else {
    creep.memory.role = Role.Scout;
  }

  if (creep.memory.role !== Role.Miner && creep.memory.role !== Role.Attacker) {
    if (
      creep.memory.working &&
      creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0
    ) {
      creep.memory.working = false;
    } else if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
    }
  }
}

Creep.prototype.run = function() {
  if (this.spawning) return ERR_BUSY;

  // first update state
  setState(this);

  // now check for existing task
  let code = runExistingAction(this);
  if (code !== false) return code;

  // otherwise inspect for a task
  let role = this.memory.role;
  if (!role) {
    console.log(`ERROR: role not being assigned for creep ${this.name}`);
    role = Role.Scout;
  }

  return Actions[role](this);
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
      return creep.attack(target);
    case 'attackController':
      return creep.attackController(target);
    case 'build':
      return creep.build(target);
    case 'claimController':
      return creep.claimController(target);
    case 'dismantle':
      return creep.dismantle(target);
    case 'harvest':
      return creep.harvest(target);
    case 'heal':
      return creep.heal(target);
    case 'pickup':
      return creep.pickup(target);
    case 'reserveController':
      return creep.reserveController(target);
    case 'upgradeController':
      return creep.upgradeController(target);
    case 'generateSafeMode':
      return creep.generateSafeMode(target);
    case 'pull':
      return creep.pull(target);
    case 'transfer':
      return creep.transfer(target, resource);
    case 'withdraw':
      return creep.withdraw(target, resource);
    case 'signController':
      return creep.signController(target, 'Claimed by Grillbrick!');
    default:
      return false;
  }
}
