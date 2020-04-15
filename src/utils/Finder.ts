import { RoleName } from 'roles/RoleName';
import { CreepsWithRoleName } from './functions';

// TODO Full refactor with smaller units.

const ROOMSIZE = 49;

export class Finder {
  pos: RoomPosition;

  /**
   *Creates an instance of Finder.
   * @param {RoomObject} pos
   * @memberof Finder
   */
  constructor(pos: RoomObject) {
    this.pos = pos.pos;
  }

  /**
   *
   *
   * @returns {Id<EnergySource>[]}
   * @memberof Finder
   */
  getClaimedSourceIds(): Id<EnergySource>[] {
    let creeps = this.pos.findInRange(FIND_MY_CREEPS, ROOMSIZE);
    let sources = [];
    for (let creep of creeps) {
      let id = creep.memory.sourceId;
      if (id) sources.push(id);
    }
    return sources;
  }

  isClaimedSource(source: EnergySource) {
    return _.contains(this.getClaimedSourceIds(), source.id);
  }

  getClaimedTargetIds(): Id<Structure | ConstructionSite>[] {
    let creeps = this.pos.findInRange(FIND_MY_CREEPS, ROOMSIZE);
    let targets: Id<Structure | ConstructionSite>[] = [];
    for (let creep of creeps) {
      let id = creep.memory.targetId;
      if (id) targets.push(id);
    }

    return targets;
  }

  isClaimedTarget(target: Structure | ConstructionSite) {
    return _.contains(this.getClaimedTargetIds(), target.id);
  }

  /** Return all resources of a given type (defaults to energy)
   * If range is provided the results are limited to those in that range.
   * @param  {ResourceConstant=RESOURCE_ENERGY} type
   * @param  {number=ROOMSIZE} range
   * @returns Resource[]
   */
  public resources(
    type: ResourceConstant = RESOURCE_ENERGY,
    range: number = ROOMSIZE,
  ): Resource[] {
    return this.pos.findInRange(FIND_DROPPED_RESOURCES, range, {
      filter: s => s.resourceType === type && !this.isClaimedSource(s),
    });
  }

  /** Returns all resources other than a given type (default energy)
   * If range is provided limit results to those
   * @param  {ResourceConstant=RESOURCE_ENERGY} type
   * @param  {number=ROOMSIZE} range
   * @returns Resource[]
   */
  public otherResources(
    type: ResourceConstant = RESOURCE_ENERGY,
    range: number = ROOMSIZE,
  ): Resource[] {
    return this.pos.findInRange(FIND_DROPPED_RESOURCES, range, {
      filter: s => s.resourceType !== type && !this.isClaimedSource(s),
    });
  }

  /** Returns all the creeps with a given RoleName
   * If range is provided it limits results to those within the given range.
   * @param  {RoleName} role
   * @param  {number=ROOMSIZE} range
   * @returns Creep
   */
  public creepsWithRole(role: RoleName, range: number = ROOMSIZE): Creep[] {
    return this.pos.findInRange(FIND_MY_CREEPS, range, {
      filter: s => s.memory.role === role,
    });
  }

  /** Returns all enemies within a given range.
   * @param  {number=ROOMSIZE} range=ROOMSIZE
   * @returns AnyCreep
   */
  public enemies(range = ROOMSIZE): AnyCreep[] {
    // first add the power creeps
    let enemies: AnyCreep[] = this.pos.findInRange(
      FIND_HOSTILE_POWER_CREEPS,
      range,
    );

    // then the regular creeps
    enemies.push.apply(this.pos.findInRange(FIND_HOSTILE_CREEPS, range));

    return enemies;
  }

  /** Find all the sources within a given range or within the room.
   * @param  {boolean=false} active // Should we search only for active sources?
   * @param {number=ROOMSIZE} range // The range that should be searched
   *
   * @returns Source
   */
  public sources(active = false, range = ROOMSIZE): Source[] {
    return this.pos.findInRange(
      active ? FIND_SOURCES_ACTIVE : FIND_SOURCES,
      range,
    );
  }

  /** Find the closest of a list of objects by path
   * @param  {RoomObject[]} ...objects
   * @returns RoomObject
   */
  public closestByPath(...objects: RoomObject[][]): RoomObject | null {
    let result: RoomObject[] = [];
    for (let object of objects) {
      let target = this.pos.findClosestByPath(object);
      if (target) result.push(target);
    }
    return this.pos.findClosestByPath(result);
  }

  // ----- OLD METHODS ----
  // DEPRECATED
  public FindClosestFreeEnergy(min: number = 50): EnergySource | null {
    // return this.closestByPath(this.resources() ) as EnergySource;
    // First get the nearest dropped resources.
    let sources: EnergySource[] = [];
    let energy: EnergySource | null = this.pos.findClosestByPath(
      FIND_DROPPED_RESOURCES,
      {
        filter: r => r.amount > min && !this.isClaimedSource(r),
      },
    );

    if (energy) sources.push(energy);

    // Next look for tombstones
    energy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.energy > min && !this.isClaimedSource(t),
    });

    if (energy) sources.push(energy);

    // Now for ruins
    energy = this.pos.findClosestByPath(FIND_RUINS, {
      filter: s => s.store.energy > min && !this.isClaimedSource(s),
    });

    if (energy) sources.push(energy);

    // Next we go for containers & links
    energy = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s =>
        (s instanceof StructureContainer || s instanceof StructureLink) &&
        s.store.energy > min &&
        !this.isClaimedSource(s),
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
        filter: r => r.amount > min && !this.isClaimedSource(r),
      },
    );

    if (energy) sources.push(energy);

    // Next look for tombstones
    energy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.energy > min && !this.isClaimedSource(t),
    });

    if (energy) sources.push(energy);

    // Now for ruins
    energy = this.pos.findClosestByPath(FIND_RUINS, {
      filter: s => s.store.energy > min && !this.isClaimedSource(s),
    });

    if (energy) sources.push(energy);

    // Next we go for containers
    energy = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s =>
        s instanceof StructureContainer &&
        s.store.energy > min &&
        !this.isClaimedSource(s),
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

              for (let creep of CreepsWithRoleName(RoleName.MINER)) {
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
