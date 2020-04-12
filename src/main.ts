import { ErrorMapper } from 'utils';
import 'prototypes';
import './Traveler/Traveler';
import { BasicRoles, SpecialRoles } from 'roles';
import { RoleNames } from 'roles/roleNames';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Run the towers
  let towers = _.filter(Game.structures, s => s instanceof StructureTower);

  for (let tower of towers) {
    runTower(tower as StructureTower);
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

  console.log(`Done: CPU LOAD: ${Game.cpu.getUsed()}`);
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
  // Emergency spawn
  if (BasicRoles.miner.creeps().length === 0) {
    return spawn.spawnMiner(true);
  }
  if (BasicRoles.lorry.creeps().length === 0) {
    return spawn.spawnRole(BasicRoles.lorry, true);
  }

  // Regular spawning
  for (let name in BasicRoles) {
    let role = BasicRoles[name as RoleNames];

    let creeps = role.creeps();
    let demand = spawn.roleDemand(role);
    console.log(`${creeps.length} of ${demand} ${name}: ${creeps}`);

    if (creeps.length < demand) {
      if (name === RoleNames.MINER) return spawn.spawnMiner();
      return spawn.spawnRole(role);
    }
  }

  return OK;
}

function runTower(tower: StructureTower) {
  let enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

  if (enemy) tower.attack(enemy);
}
