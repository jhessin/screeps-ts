import { CreepsWithRole } from 'utils';
import { RoleName } from './RoleNames';

let repairer: Role = {
  body: [WORK, CARRY, MOVE, MOVE],
  memory: {
    role: RoleName.REPAIRER,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  work: repair,
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function repair(creep: Creep): ScreepsReturnCode {
  let id = creep.memory.targetId;
  let target: Structure | null = id
    ? Game.getObjectById(id)
    : creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => {
          if (s.hits === s.hitsMax || s instanceof StructureWall) return false;
          for (let creep of CreepsWithRole(repairer)) {
            if (creep.memory.targetId === s.id) return false;
          }
          return true;
        },
      });

  if (!target) return buildRoads(creep);

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
