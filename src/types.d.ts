// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: Roles;
  room?: string;
  working: boolean;
  targetId?: string;
}

interface SpawnMemory {
  roles: { [roleName: string]: number };
}

declare enum Roles {
  HARVESTER = 'harvester',
  MINER = 'miner',
  LORRY = 'lorry',
  REPAIRER = 'repairer',
  WALL_REPAIRER = 'wallRepairer',
  BUILDER = 'builder',
  UPGRADER = 'upgrader',
  SPECIALIST = 'specialist',
}

interface Role {
  body: BodyPartConstant[];
  memory: CreepMemory;
  run: (creep: Creep) => CreepActionReturnCode;
}

type RoleList = {
  [name in Roles]: Role;
};

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
