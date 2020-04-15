import { CreepsWithRole } from 'utils';
import { RoleName } from './RoleNames';

let specialist: Role = {
  body: [WORK, CARRY, MOVE, MOVE],
  memory: {
    role: RoleName.SPECIALIST,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  work: creep => creep.storeFreeEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default specialist;
