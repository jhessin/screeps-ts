import { CreepsWithRole } from 'utils';

let builder: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.BUILDER,
    working: true,
  },
  work: creep =>
    // TODO build
    creep.upgradeRoom(),
  harvest: creep => creep.harvestEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

export default builder;
