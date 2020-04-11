import { CreepsWithRole } from 'utils';
import { RoleNames } from './roleNames';

let wallRepairer: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.WALL_REPAIRER,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  // TODO Repair walls
  work: creep => creep.upgradeRoom(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default wallRepairer;
