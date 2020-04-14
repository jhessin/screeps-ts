import { CreepsWithRole } from 'utils';
import { RoleName } from './RoleNames';

let defender: Role = {
  body: [TOUGH, RANGED_ATTACK, ATTACK, MOVE],
  memory: {
    role: RoleName.DEFENDER,
    working: true,
  },
  work: defend,
  harvest: defend,
  creeps: function(): Creep[] {
    return CreepsWithRole(this);
  },
};

function defend(creep: Creep): ScreepsReturnCode {
  // Get all PowerCreeps in range
  let enemies: (Creep | PowerCreep)[] = creep.pos.findInRange(
    FIND_HOSTILE_POWER_CREEPS,
    3,
  );

  // Get all creeps in range
  for (let enemy of creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)) {
    enemies.push(enemy);
  }

  // If there are none move to rally point.
  if (enemies.length === 0) return moveToRally(creep);

  let code: ScreepsReturnCode;
  // If there is more than one enemy perform a Mass Attack
  if (enemies.length > 1) return creep.rangedMassAttack();

  // Otherwise perform a targeted attack
  let enemy = creep.pos.findClosestByRange(enemies);
  // If for some reason the enemy disappeared move to the rally point and wait
  if (!enemy) return moveToRally(creep);

  // Try a close attack first
  code = creep.attack(enemy);
  if (code === ERR_NOT_IN_RANGE) {
    // Then a ranged attack
    code = creep.rangedAttack(enemy);
  }
  if (code !== OK) {
    console.log(`Couldn't attack hostile creep: ${code}`);
  }
  return code;
}

function moveToRally(creep: Creep): ScreepsReturnCode {
  let target: Structure | null = creep.memory.targetId
    ? Game.getObjectById(creep.memory.targetId)
    : creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => {
          if (!(s instanceof StructureRampart)) return false;

          for (let creep of defender.creeps()) {
            if (creep.memory.targetId === s.id) return false;
          }
          return true;
        },
      });

  if (target) {
    creep.memory.targetId = target.id;
    return creep.travelTo(target) as ScreepsReturnCode;
  }

  let rally = Game.flags.rally;

  if (!rally) return ERR_NOT_FOUND;

  return creep.travelTo(rally) as ScreepsReturnCode;
}

export default defender;
