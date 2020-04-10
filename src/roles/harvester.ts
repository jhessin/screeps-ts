import { Finder } from 'utils';
import { updateState } from 'utils/functions';

let harvester: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.HARVESTER,
    working: true,
  },
  run: (creep: Creep) => {
    updateState(creep);
    let finder = new Finder(creep);

    if (creep.memory.working) {
      // TODO: find structure to store energy
    } else {
      // TODO: make a creep overload function that harvests energy
      let id = creep.memory.targetId;
      let target = id ? Game.getObjectById(id) : finder.FindClosestFreeEnergy();
      if (target) {
      }
    }

    return OK;
  },
};

export default harvester;
