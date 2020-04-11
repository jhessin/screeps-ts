import { CreepsWithRole } from 'utils';
import { RoleNames } from './roleNames';

let repairer: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.REPAIRER,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  work: repair,
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function repair(creep: Creep): ScreepsReturnCode {
  let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: s => s.hits < s.hitsMax && !(s instanceof StructureWall),
  });

  if (target) {
    creep.memory.targetId = target.id;
    let code = creep.repair(target);
    if (code === ERR_NOT_IN_RANGE) {
      return creep.travelTo(target) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Couldn't repair: ${code}`);
      return code;
    }
    return code;
  }

  return creep.upgradeRoom();
}

export default repairer;
