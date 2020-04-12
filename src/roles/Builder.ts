import { CreepsWithRole } from 'utils';
import { RoleNames } from './RoleNames';

let builder: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: RoleNames.BUILDER,
    working: true,
  },
  work: buildSite,
  harvest: creep => creep.harvestEnergy(),
  creeps: function() {
    return CreepsWithRole(this);
  },
};

function build(creep: Creep, site: ConstructionSite) {
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

function buildSite(creep: Creep): ScreepsReturnCode {
  let site = containerSites(creep);
  if (site) return build(creep, site);

  site = extensionSites(creep);
  if (site) return build(creep, site);

  site = quickSites(creep);
  if (site) return build(creep, site);

  return creep.upgradeRoom();
}

function allSites(creep: Creep): ConstructionSite | void {
  let id = creep.memory.targetId;
  let target;
  if (id) target = Game.getObjectById(id);
  if (target) return target as ConstructionSite;
  target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
  return target as ConstructionSite;
}

function quickSites(creep: Creep): ConstructionSite | void {
  let id = creep.memory.targetId;
  let target;
  if (id) target = Game.getObjectById(id);
  if (target) return target as ConstructionSite;
  target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
    filter: s => s.progressTotal - s.progress < 500,
  });
  return target as ConstructionSite;
}

function containerSites(creep: Creep): ConstructionSite | void {
  let id = creep.memory.targetId;
  let target;
  if (id) target = Game.getObjectById(id);
  if (target) return target as ConstructionSite;
  target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
    filter: s => s.structureType === STRUCTURE_CONTAINER,
  });
  return target as ConstructionSite;
}

function extensionSites(creep: Creep): ConstructionSite | void {
  let id = creep.memory.targetId;
  let target;
  if (id) target = Game.getObjectById(id);
  if (target) return target as ConstructionSite;
  target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
    filter: s => s.structureType === STRUCTURE_EXTENSION,
  });
  return target as ConstructionSite;
}

export default builder;
