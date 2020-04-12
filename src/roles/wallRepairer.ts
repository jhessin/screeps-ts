import { CreepsWithRole } from 'utils';
import { RoleNames } from './roleNames';

let wallRepairer: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.WALL_REPAIRER,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  work: buildWalls,
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function repairWalls(creep: Creep): ScreepsReturnCode {
  let walls = creep.room
    .find(FIND_STRUCTURES, {
      filter: s =>
        (s instanceof StructureWall || s instanceof StructureRampart) &&
        s.hits < s.hitsMax,
    })
    .map(s => s as StructureWall);

  let lowest = walls.pop();
  if (lowest) {
    while (walls.length > 0) {
      let next = walls.pop();
      if (next && next.hits < lowest.hits) {
        lowest = next;
      }
    }

    let code = creep.repair(lowest);
    if (code === ERR_NOT_IN_RANGE) {
      return creep.travelTo(lowest) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Couldn't repair the wall: ${code}`);
      return code;
    }

    return code;
  }

  return creep.upgradeRoom();
}

function buildWalls(creep: Creep): ScreepsReturnCode {
  let site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
    filter: s => s.structureType === STRUCTURE_WALL,
  });

  if (!site) return repairWalls(creep);

  let code = creep.build(site);
  if (code === ERR_NOT_IN_RANGE) {
    return creep.travelTo(site) as ScreepsReturnCode;
  } else if (code !== OK) {
    console.log(`Error buliding wall: ${code}`);
    return code;
  }
  return code;
}

export default wallRepairer;
