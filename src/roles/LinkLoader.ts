import { CreepsWithRole, Finder } from 'utils';
import { RoleName } from './RoleNames';

let linkLoader: Role = {
  body: [CARRY, MOVE],
  memory: {
    role: RoleName.LINK_LOADER,
    working: true,
  },
  work: loadLink,
  harvest: harvestEnergy,
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function loadLink(creep: Creep): ScreepsReturnCode {
  let link: StructureLink | null = creep.pos.findInRange(FIND_STRUCTURES, 10, {
    filter: s =>
      s instanceof StructureLink &&
      s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
  })[0] as StructureLink;

  if (!link) return creep.storeFreeEnergy();

  let code = creep.transfer(link, RESOURCE_ENERGY);
  if (code === ERR_NOT_IN_RANGE) {
    return creep.travelTo(link) as ScreepsReturnCode;
  }
  if (code !== OK) console.log(`Error transfering to link: ${code}`);

  return code;
}

function harvestEnergy(creep: Creep): ScreepsReturnCode {
  let id = creep.memory.sourceId;
  let finder = new Finder(creep);
  let target: EnergySource | null = id
    ? Game.getObjectById(id)
    : finder.FindClosestNonLinkEnergy(
        creep.store.getFreeCapacity(RESOURCE_ENERGY),
      ) || finder.FindClosestNonLinkEnergy();
  if (target) {
    creep.memory.sourceId = target.id;
    let code =
      target instanceof Resource
        ? creep.pickup(target)
        : creep.withdraw(target as Structure, RESOURCE_ENERGY);
    if (code === ERR_NOT_IN_RANGE) {
      return creep.travelTo(target) as ScreepsReturnCode;
    } else if (code !== OK) {
      console.log(`Error getting free energy: ${code}`);
      return code;
    }
    return code;
  }

  return ERR_NOT_FOUND;
}

export default linkLoader;
