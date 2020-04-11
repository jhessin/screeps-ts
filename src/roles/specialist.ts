import { CreepsWithRole } from 'utils';

let specialist: Role = {
  body: [WORK, CARRY, MOVE],
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
