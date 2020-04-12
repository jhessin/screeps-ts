export class Finder {
  pos: RoomPosition;

  constructor(pos: RoomObject) {
    this.pos = pos.pos;
  }

  public FindClosestFreeEnergy(): EnergySource | null {
    // First get the nearest dropped resources.
    let sources: EnergySource[] = [];
    let energy: EnergySource | null = this.pos.findClosestByPath(
      FIND_DROPPED_RESOURCES,
    );

    if (energy) sources.push(energy);

    // Next look for tombstones
    energy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.energy > 0,
    });

    if (energy) sources.push(energy);

    // Now for ruins
    energy = this.pos.findClosestByPath(FIND_RUINS, {
      filter: s => s.store.energy > 0,
    });

    if (energy) sources.push(energy);

    // Next we go for containers
    energy = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s instanceof StructureContainer && s.store.energy > 0,
    });

    if (energy) sources.push(energy);

    // Finally we go directly for the source.
    // energy = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    return this.pos.findClosestByPath(sources);
  }

  public FindClosestEnergy(): EnergySource | null {
    // First get closest free energy if we can
    let energy = this.FindClosestFreeEnergy();

    // Return it if it isn't a source
    if (energy && !(energy instanceof Source)) return energy;

    // Now check for Storege structures
    let storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s instanceof StructureStorage && s.store.energy > 0,
    });

    return storage;
  }

  public FindClosestStorageFacility(): Structure | void {
    let structure: Structure | null = this.pos.findClosestByPath(
      FIND_MY_STRUCTURES,
      {
        filter: s =>
          (s instanceof StructureSpawn ||
            s instanceof StructureExtension ||
            s instanceof StructureTower) &&
          s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      },
    );

    if (structure) return structure;

    structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: s =>
        (s as HasStore).store &&
        (s as HasStore).store.getFreeCapacity(RESOURCE_ENERGY) > 0,
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
