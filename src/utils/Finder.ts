export class Finder {
  pos: RoomPosition;

  constructor(pos: RoomObject) {
    this.pos = pos.pos;
  }

  public FindClosestFreeEnergy(): EnergySource | null {
    // First get the nearest dropped resources.
    let energy: EnergySource | null = this.pos.findClosestByPath(
      FIND_DROPPED_RESOURCES,
    );

    if (energy) return energy;

    // Next look for tombstones
    energy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.energy > 0,
    });

    if (energy) return energy;

    // Now for ruins
    energy = this.pos.findClosestByPath(FIND_RUINS, {
      filter: s => s.store.energy > 0,
    });

    if (energy) return energy;

    // Next we go for containers
    energy = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s instanceof StructureContainer && s.store.energy > 0,
    });

    if (energy) return energy;

    // Finally we go directly for the source.
    energy = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    return energy;
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

    return storage || energy;
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

    let room = Game.rooms[this.pos.roomName];
    return room.controller;
  }
}
