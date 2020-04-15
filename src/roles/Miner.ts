import { CreepsWithRole } from 'utils';
import { RoleName } from './RoleNames';

let miner: Role = {
  body: [MOVE, WORK, WORK, WORK, WORK, WORK],
  memory: {
    role: RoleName.MINER,
    working: true,
  },
  work: mine,
  harvest: mine,
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function mine(creep: Creep) {
  // Find an appropriate source
  let id = creep.memory.sourceId;
  let source = id
    ? Game.getObjectById(id)
    : creep.pos.findClosestByPath(FIND_SOURCES, {
        filter: s => {
          for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (
              creep.memory.role === RoleName.MINER &&
              creep.memory.sourceId === s.id
            )
              return false;
          }
          return true;
        },
      });

  if (!source)
    source = creep.pos.findClosestByPath(FIND_MINERALS, {
      filter: s => {
        for (let name in Game.creeps) {
          let creep = Game.creeps[name];
          if (
            creep.memory.role === RoleName.MINER &&
            creep.memory.sourceId === s.id
          )
            return false;
        }
        return true;
      },
    });

  if (source) {
    creep.memory.sourceId = source.id;
    let id = creep.memory.targetId;
    // Find an appropriate target
    let target: HasPos | null = id
      ? Game.getObjectById(id)
      : source.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: s =>
            s instanceof StructureContainer &&
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        })[0];
    if (!target) {
      target = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
        filter: s => s.structureType === STRUCTURE_CONTAINER,
      })[0];
    }
    if (target) {
      // travel to container
      if (creep.pos.isEqualTo(target.pos)) {
        return creep.harvest(source as Source);
      } else {
        return creep.travelTo(target) as ScreepsReturnCode;
      }
    }
    let code: ScreepsReturnCode = creep.harvest(source as Source);
    if (code === ERR_NOT_IN_RANGE) {
      return creep.travelTo(source) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Couldn't mine: ${code}`);
      return code;
    } else {
      return code;
    }
  }

  return ERR_NOT_FOUND;
}

export default miner;
