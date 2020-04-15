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
    : creep.pos.findClosestByPath(getDamagedContainers(creep));

  if (!target) target = creep.pos.findClosestByPath(getSwampRoads(creep));
  if (!target)
    target = creep.pos.findClosestByPath(getAllDamagedStructures(creep));
  if (!target) return buildRoads(creep);

  // invalidate healed targets
  if (target.hits === target.hitsMax) {
    delete creep.memory.targetId;
    delete creep.memory._trav;
  }

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

function getAllDamagedStructures(creep: Creep): Structure[] {
  return creep.room.find(FIND_STRUCTURES, {
    filter: s => {
      if (s instanceof StructureWall || s instanceof StructureRampart)
        return false;
      for (let creep of CreepsWithRole(repairer)) {
        if (creep.memory.targetId === s.id) return false;
      }
      return s.hits < s.hitsMax;
    },
  });
}

function getSwampRoads(creep: Creep): StructureRoad[] {
  return creep.room.find(FIND_STRUCTURES, {
    filter: s => {
      if (!(s instanceof StructureRoad)) return false;

      for (let creep of CreepsWithRole(repairer)) {
        if (creep.memory.targetId === s.id) return false;
      }
      let terrain = s.room.getTerrain();

      if (terrain.get(s.pos.x, s.pos.y) !== TERRAIN_MASK_SWAMP) return false;
      return s.hits < s.hitsMax;
    },
  }) as StructureRoad[];
}

function getDamagedContainers(creep: Creep): StructureContainer[] {
  return creep.room.find(FIND_STRUCTURES, {
    filter: s => {
      for (let creep of CreepsWithRole(repairer)) {
        if (creep.memory.targetId === s.id) return false;
      }
      return s instanceof StructureContainer && s.hits < s.hitsMax;
    },
  }) as StructureContainer[];
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
