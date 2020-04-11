import { CreepsWithRole } from 'utils';
import { RoleNames } from './roleNames';

let harvester: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.HARVESTER,
    working: true,
  },
  work: creep => creep.storeFreeEnergy(),
  harvest: creep => creep.harvestFreeEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default harvester;
