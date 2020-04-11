import { CreepsWithRole } from 'utils';
import { RoleNames } from './roleNames';

let lorry: Role = {
  body: [CARRY, CARRY, MOVE],
  memory: {
    role: RoleNames.LORRY,
    working: true,
  },
  work: creep => creep.storeFreeEnergy(),
  harvest: creep => creep.harvestFreeEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default lorry;
