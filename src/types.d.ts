// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: RoleNames;
  room?: string;
  working: boolean;
  sourceId?: Id<EnergySource>;
  targetId?: Id<Structure> | Id<ConstructionSite>;
  _trav?: Object;
}

interface SpawnMemory {
  roles?: { [roleName in RoleNames]: number };
}

interface Creep {
  // shortcuts for memory objects
  working: () => boolean;
  role: () => RoleNames;
  targetId: () => string | void;
  sourceId: () => string | void;

  // The generic run method that calls the appropriate role methods
  run: () => ScreepsReturnCode;

  // Harvest free energy -- Used by harvesters and lorries
  harvestFreeEnergy: () => ScreepsReturnCode;
  // Harvest work energy -- Used by everyone else
  harvestEnergy: () => ScreepsReturnCode;

  // Store free energy -- Used by both harvesters and lorries
  storeFreeEnergy: () => ScreepsReturnCode;

  // Universal fallback for all creeps.
  upgradeRoom: () => ScreepsReturnCode;
}

interface StructureSpawn {
  spawnRole: (role: Role, emergency?: boolean) => ScreepsReturnCode;
  roleDemand: (role: Role) => number;
}

// MINE
declare enum RoleNames {
  MINER = 'miner',
  LORRY = 'lorry',
  REPAIRER = 'repairer',
  WALL_REPAIRER = 'wallRepairer',
  BUILDER = 'builder',
  UPGRADER = 'upgrader',
  SPECIALIST = 'specialist',
}

type EnergySource = Source | Resource | Structure | Ruin | Tombstone;

interface Role {
  body: BodyPartConstant[];
  memory: CreepMemory;
  work: (creep: Creep) => ScreepsReturnCode;
  harvest: (creep: Creep) => ScreepsReturnCode;
  creeps: () => Creep[];
}

type RoleList = {
  [name in RoleNames]: Role;
};

interface HasStore {
  store: StoreDefinition;
}

interface Memory {
  uuid: number;
  log: any;
}
