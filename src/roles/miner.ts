import { CreepsWithRole } from 'utils';

let miner: Role = {
  body: [WORK, WORK, WORK, WORK, WORK, MOVE],
  memory: {
    role: RoleNames.MINER,
    working: true,
  },
  work: mine,
  harvest: mine,
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function mine(creep: Creep) {
  let id = creep.memory.sourceId;
  let source = id
    ? Game.getObjectById(id)
    : creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

  if (source) {
    creep.memory.sourceId = source.id;
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
