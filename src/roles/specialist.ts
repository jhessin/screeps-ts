import { CreepsWithRole } from 'utils';
import { RoleNames } from './roleNames';

let specialist: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.SPECIALIST,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  work: creep => creep.storeFreeEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default specialist;
