import { CreepsWithRole } from 'utils';
import { RoleName } from './RoleName';

let specialist: Role = {
  body: [CARRY, MOVE],
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
