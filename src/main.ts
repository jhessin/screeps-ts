import { ErrorMapper } from 'utils';
import 'prototypes';
import './Traveler/Traveler';
import { BasicRoles, SpecialRoles } from 'roles';
import { RoleName } from 'roles/RoleNames';
import { salvagersNeeded } from 'roles/Salvager';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`=========================NEW LOOP=========================`);

  // Run the towers
  let towers = _.filter(Game.structures, s => s instanceof StructureTower);

  for (let tower of towers) {
    runTower(tower as StructureTower);
  }

  // Run all links
  let links = _.filter(Game.structures, s => s instanceof StructureLink);
  for (let link of links) {
    runLink(link as StructureLink);
  }

  // Run all the creeps
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];

    creep.run();
  }

  // Run all the spawns
  for (let name in Game.spawns) {
    let spawn = Game.spawns[name];

    spawnAsNeeded(spawn);

    let energy = spawn.room.energyAvailable;
    let capacity = spawn.room.energyCapacityAvailable;
    console.log(`${energy} of ${capacity} available for spawns`);
  }

  // Clean memory every 500 ticks.
  if (Game.time % 500 === 0) {
    cleanMemory();
  }

  console.log(
    `===================Done: CPU LOAD: ${Game.cpu.getUsed()}=======`,
  );
});

function cleanMemory() {
  console.log('Cleaning Memory...');

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

function spawnAsNeeded(spawn: StructureSpawn) {
  logCreeps(spawn);

  // Emergency spawn
  for (let role of Object.values(BasicRoles)) {
    if (role.creeps().length === 0) {
      if (role.memory.role === RoleName.MINER) return spawn.spawnMiner(true);
      return spawn.spawnRole(role, true);
    }
  }

  // Spawn defenders if needed
  let defenderRole = SpecialRoles[RoleName.DEFENDER];
  let defenders = defenderRole.creeps();
  if (defenders.length < spawn.room.find(FIND_HOSTILE_CREEPS).length) {
    return spawn.spawnRole(defenderRole, true);
  }

  // Special Spawning
  if (
    SpecialRoles[RoleName.SALVAGER].creeps().length <
    salvagersNeeded(spawn.room)
  ) {
    return spawn.spawnRole(SpecialRoles[RoleName.SALVAGER]);
  }

  // Basic Spawning
  for (let name in BasicRoles) {
    let role = BasicRoles[name];

    let creeps = role.creeps();
    let demand = spawn.roleDemand(role);
    if (creeps.length < demand) {
      if (name === RoleName.MINER) return spawn.spawnMiner();
      return spawn.spawnRole(role);
    }
  }

  // Spawn defenders if needed
  if (defenders.length < spawn.room.find(FIND_HOSTILE_CREEPS).length) {
    return spawn.spawnRole(defenderRole, true);
  } else if (defenders.length < spawn.roleDemand(defenderRole)) {
    return spawn.spawnRole(defenderRole);
  }

  return OK;
}

function runTower(tower: StructureTower) {
  let enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

  if (enemy) tower.attack(enemy);
}

function runLink(link: StructureLink) {
  let target: StructureLink;

  target = link.room.find(FIND_MY_STRUCTURES, {
    filter: s =>
      s instanceof StructureLink &&
      s.store.getUsedCapacity(RESOURCE_ENERGY) <
        link.store.getUsedCapacity('energy') / 2 &&
      s.id !== link.id,
  })[0] as StructureLink;

  if (!target) return;

  let amount =
    (link.store.getUsedCapacity(RESOURCE_ENERGY) -
      target.store.getUsedCapacity('energy')) /
    2;
  link.transferEnergy(target, amount);
}

function logCreeps(spawn: StructureSpawn) {
  console.log('---Special Roles---');
  for (let name in SpecialRoles) {
    let role = SpecialRoles[name];
    let creeps = role.creeps();
    let demand = spawn.roleDemand(role);
    console.log(`${creeps.length} of ${demand} ${name}: ${creeps}`);
  }

  // Regular spawning
  console.log('---Standard Roles---');
  for (let name in BasicRoles) {
    let role = BasicRoles[name];

    let creeps = role.creeps();
    let demand = spawn.roleDemand(role);
    console.log(`${creeps.length} of ${demand} ${name}: ${creeps}`);
  }
}
