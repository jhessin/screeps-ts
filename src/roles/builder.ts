import { CreepsWithRole } from 'utils';
import { RoleNames } from './roleNames';

let builder: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.BUILDER,
    working: true,
  },
  work: build,
  harvest: creep => creep.harvestEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function build(creep: Creep): ScreepsReturnCode {
  let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

  if (site) {
    creep.memory.targetId = site.id;
    let code = creep.build(site);
    if (code === ERR_NOT_IN_RANGE) {
      return creep.travelTo(site) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Can't build site: ${code}`);
      return code;
    }
    return code;
  }

  return creep.upgradeRoom();
}

export default builder;
