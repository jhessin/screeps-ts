import { RoleName } from 'roles/RoleNames';
import { CreepsWithRoleName } from './functions';

// TODO Full refactor with smaller units.

const ROOMSIZE = 49;

export class Finder {
  pos: RoomPosition;

  constructor(pos: RoomObject) {
    this.pos = pos.pos;
  }

  // Return all resources of a giver type (default ENERGY)
  // within a range (default entire room)
  public resources(
    type: ResourceConstant = RESOURCE_ENERGY,
    range: number = ROOMSIZE,
  ): Resource[] | null {
    return this.pos.findInRange(FIND_DROPPED_RESOURCES, range, {
      filter: s => s.resourceType === type,
    });
  }

  // Return all resources other than a given type (default ENERGY)
  // within a range (default entire room)
  public otherResources(
    type: ResourceConstant = RESOURCE_ENERGY,
    range: number = ROOMSIZE,
  ): Resource[] | null {
    return this.pos.findInRange(FIND_DROPPED_RESOURCES, range, {
      filter: s => s.resourceType !== type,
    });
  }

  public creepsWithRole(
    role: RoleName,
    target: Id<any> | null,
    range: number = ROOMSIZE,
  ): Creep[] {
    return this.pos.findInRange(FIND_MY_CREEPS, range, {
      filter: s => {
        if (!target) return s.memory.role === role;
        return s.memory.role === role && s.memory.targetId === target;
      },
    });
  }

  // find all enemies in the room or in range
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

  public sources(active: boolean = false, range = ROOMSIZE): Source[] | null {
    return this.pos.findInRange(
      active ? FIND_SOURCES_ACTIVE : FIND_SOURCES,
      range,
    );
  }

  public closestByPath(...objects: RoomObject[]): RoomObject | null {
    return this.pos.findClosestByPath(objects);
  }

  public structures(
    type: StructureConstant | null = null,
    range = ROOMSIZE,
  ): Structure[] {
    let filter = type ? (s: Structure) => s.structureType === type : {};
    return this.pos.findInRange(FIND_STRUCTURES, range, {
      filter,
    });
  }

  // ----- OLD METHODS ----
  // DEPRECATED
  public FindClosestFreeEnergy(min: number = 50): EnergySource | null {
    // First get the nearest dropped resources.
    let sources: EnergySource[] = [];
    let energy: EnergySource | null = this.pos.findClosestByPath(
      FIND_DROPPED_RESOURCES,
      {
        filter: r => r.amount > min,
      },
    );

    if (energy) sources.push(energy);

    // Next look for tombstones
    energy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.energy > min,
    });

    if (energy) sources.push(energy);

    // Now for ruins
    energy = this.pos.findClosestByPath(FIND_RUINS, {
      filter: s => s.store.energy > min,
    });

    if (energy) sources.push(energy);

    // Next we go for containers & links
    energy = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s =>
        (s instanceof StructureContainer || s instanceof StructureLink) &&
        s.store.energy > min,
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
        filter: r => r.amount > min,
      },
    );

    if (energy) sources.push(energy);

    // Next look for tombstones
    energy = this.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.energy > min,
    });

    if (energy) sources.push(energy);

    // Now for ruins
    energy = this.pos.findClosestByPath(FIND_RUINS, {
      filter: s => s.store.energy > min,
    });

    if (energy) sources.push(energy);

    // Next we go for containers
    energy = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s instanceof StructureContainer && s.store.energy > min,
    });

    if (energy) sources.push(energy);

    // Finally we go directly for the source.
    // energy = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    return this.pos.findClosestByPath(sources);
  }
  public FindClosestStorageFacility(): Structure | void {
    let structure: Structure | null = this.pos.findClosestByPath(
      FIND_MY_STRUCTURES,
      {
        filter: s => {
          if (
            !(
              (s instanceof StructureSpawn ||
                s instanceof StructureExtension ||
                s instanceof StructureTower) &&
              s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            )
          )
            return false;

          for (let creep of CreepsWithRoleName(RoleName.MINER)) {
            if (creep.memory.targetId === s.id) return false;
          }
          return true;
        },
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
