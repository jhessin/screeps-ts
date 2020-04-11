import { CreepsWithRole } from 'utils';

let repairer: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.REPAIRER,
    working: true,
  },
  harvest: creep => creep.harvestEnergy(),
  work: creep =>
    // TODO Repair
    creep.upgradeRoom(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default repairer;
