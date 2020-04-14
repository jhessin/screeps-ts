import { CreepsWithRole } from 'utils';
import { RoleNames } from './RoleNames';

const Salvager: Role = {
  body: [WORK, MOVE],
  memory: {
    role: RoleNames.SALVAGER,
    working: true,
  },
  work: salvage,
  harvest: salvage,
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function salvage(creep: Creep): ScreepsReturnCode {
  // find salvage
  let salvageFlag = creep.pos.findClosestByPath(FIND_FLAGS, {
    filter: f => f.name.startsWith('salvage'),
  });

  if (!salvageFlag) {
    console.log('No Salvage flag');

    return ERR_NOT_FOUND;
  }
  let salvageTarget = salvageFlag.pos.findInRange(FIND_STRUCTURES, 0)[0];
  if (!salvageTarget) {
    console.log('No Salvage Target');

    return ERR_NOT_FOUND;
  }
  let code = creep.dismantle(salvageTarget);
  if (code === ERR_NOT_IN_RANGE) {
    return creep.travelTo(salvageTarget) as ScreepsReturnCode;
  }
  if (code !== OK) {
    console.log(`Error salvaging: ${code}`);
  }
  return code;
}

function mine(creep: Creep): ScreepsReturnCode {
  creep.memory.role = RoleNames.MINER;
  return ERR_NO_BODYPART;
}

export function salvagersNeeded(room: Room): number {
  return (
    room.find(FIND_FLAGS, {
      filter: f => f.name.startsWith('salvage'),
    }).length && 1
  );
}
export default Salvager;
