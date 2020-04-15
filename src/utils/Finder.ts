import { RoleNames } from 'roles/RoleNames';
import { CreepsWithRoleName } from './functions';

function getClaimedSources(): EnergySource[] {
  let creeps = Object.values(Game.creeps);
  let sources = [];
  for (let creep of creeps) {
    let id = creep.memory.sourceId;
    if (!id) continue;
    let source = Game.getObjectById(id);
    if (source) sources.push(source);
  }
  return sources;
}

export class Finder {
  pos: RoomPosition;

  constructor(pos: RoomObject) {
    this.pos = pos.pos;
  }

  public FindClosestFreeEnergy(min: number = 50): EnergySource | null {
    // First get the nearest dropped resources.
    let sources: EnergySource[] = [];
    let energy: EnergySource | null = this.pos.findClosestByPath(
      FIND_DROPPED_RESOURCES,
      {
        filter: r => r.amount > min && !_.contains(getClaimedSources(), r),
      },
    );

    if (energy) sources.push(energy);

    // Next look for tombstones
    energy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.energy > min && !_.contains(getClaimedSources(), t),
    });

    if (energy) sources.push(energy);

    // Now for ruins
    energy = this.pos.findClosestByPath(FIND_RUINS, {
      filter: s => s.store.energy > min && !_.contains(getClaimedSources(), s),
    });

    if (energy) sources.push(energy);

    // Next we go for containers & links
    energy = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s =>
        (s instanceof StructureContainer || s instanceof StructureLink) &&
        s.store.energy > min &&
        !_.contains(getClaimedSources(), s),
    });

    if (energy) sources.push(energy);

    // Finally we go directly for the source.
    // energy = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    return this.pos.findClosestByPath(sources);
  }

  public FindClosestEnergy(min: number = 50): EnergySource | null {
    // First get closest free energy if we can
    let energy = this.FindClosestFreeEnergy();

    // Return it if it isn't a source
    if (energy) return energy;

    // Now check for Storege structures
    let storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s =>
        (s instanceof StructureStorage || s instanceof StructureLink) &&
        s.store.energy > min,
    });

    return storage;
  }

  public FindClosestNonLinkEnergy(min: number = 50): EnergySource | null {
    // First get the nearest dropped resources.
    let sources: EnergySource[] = [];
    let energy: EnergySource | null = this.pos.findClosestByPath(
      FIND_DROPPED_RESOURCES,
      {
        filter: r => r.amount > min && !_.contains(getClaimedSources(), r),
      },
    );

    if (energy) sources.push(energy);

    // Next look for tombstones
    energy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.energy > min && !_.contains(getClaimedSources(), t),
    });

    if (energy) sources.push(energy);

    // Now for ruins
    energy = this.pos.findClosestByPath(FIND_RUINS, {
      filter: s => s.store.energy > min && !_.contains(getClaimedSources(), s),
    });

    if (energy) sources.push(energy);

    // Next we go for containers
    energy = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s =>
        s instanceof StructureContainer &&
        s.store.energy > min &&
        !_.contains(getClaimedSources(), s),
    });

    if (energy) sources.push(energy);

    // Finally we go directly for the source.
    // energy = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    return this.pos.findClosestByPath(sources);
  }

  public FindClosestStorageFacility(
    energyType: ResourceConstant = RESOURCE_ENERGY,
  ): Structure | void {
    let structure: Structure | null =
      energyType !== RESOURCE_ENERGY
        ? null
        : this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s => {
              if (
                !(
                  (s instanceof StructureSpawn ||
                    s instanceof StructureExtension ||
                    s instanceof StructureTower) &&
                  s.store.getFreeCapacity(energyType) > 0
                )
              )
                return false;

              for (let creep of CreepsWithRoleName(RoleNames.MINER)) {
                if (creep.memory.targetId === s.id) return false;
              }
              return true;
            },
          });

    if (structure) return structure;

    structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: s =>
        (s as HasStore).store &&
        (s as HasStore).store.getFreeCapacity(energyType) > 0,
    });

    if (structure) return structure;

    // let room = Game.rooms[this.pos.roomName];
    // return room.controller;
  }

  findSalvage(): Structure | void {
    // Look for dismantle flags
    let flag = Game.flags.dismantle;

    if (flag) {
      return flag.pos.findInRange(FIND_STRUCTURES, 0)[0];
    }
  }
}
