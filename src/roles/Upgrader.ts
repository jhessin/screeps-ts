import { CreepsWithRole } from 'utils';
import { RoleName } from './RoleNames';

let upgrader: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleName.UPGRADER,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  work: creep => creep.upgradeRoom(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default upgrader;
