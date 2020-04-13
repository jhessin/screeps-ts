import { CreepsWithRole } from 'utils';
import { RoleNames } from './RoleNames';

let specialist: Role = {
  body: [WORK, CARRY, MOVE, MOVE],
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
