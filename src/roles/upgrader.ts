import { CreepsWithRole } from 'utils';
import { RoleNames } from './roleNames';

let upgrader: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.UPGRADER,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  work: creep => creep.upgradeRoom(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default upgrader;
