import { CreepsWithRole } from 'utils';
import { RoleName } from './RoleNames';

let lorry: Role = {
  body: [CARRY, MOVE],
  memory: {
    role: RoleName.LORRY,
    working: true,
  },
  work: creep => creep.storeFreeEnergy(),
  harvest: creep => creep.harvestFreeEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default lorry;
