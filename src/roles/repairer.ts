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

  return buildRoads(creep);
}

function buildRoads(creep: Creep): ScreepsReturnCode {
  let road = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
    filter: s => s.structureType === STRUCTURE_ROAD,
  });

  if (!road) return creep.upgradeRoom();

  let code = creep.build(road);
  if (code === ERR_NOT_IN_RANGE) {
    return creep.travelTo(road) as ScreepsReturnCode;
  } else if (code !== OK) {
    console.log(`Error building road: ${code}`);
  }
  return code;
}
export default repairer;
