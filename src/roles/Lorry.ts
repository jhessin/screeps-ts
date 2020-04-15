import { CreepsWithRole } from 'utils';
import { RoleNames } from './RoleNames';

let lorry: Role = {
  body: [CARRY, MOVE],
  memory: {
    role: RoleNames.LORRY,
    working: true,
    resourceType: RESOURCE_ENERGY,
  },
  work: creep => creep.storeFreeEnergy(),
  harvest: creep => creep.harvestFreeEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default lorry;
