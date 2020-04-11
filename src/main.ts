import { ErrorMapper } from 'utils';
import 'prototypes';
import './Traveler/Traveler';
import roleList from 'roles';
import { RoleNames } from 'roles/roleNames';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Run all the creeps
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];

    creep.run();
  }

  // Run all the spawns
  for (let name in Game.spawns) {
    let spawn = Game.spawns[name];

    spawnAsNeeded(spawn);
  }

  // Clean memory every 500 ticks.
  if (Game.time % 500 === 0) {
    cleanMemory();
  }
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
  if (
    roleList.harvester.creeps().length === 0 &&
    roleList.lorry.creeps().length === 0
  ) {
    if (roleList.miner.creeps().length > 0) {
      return spawn.spawnRole(roleList.lorry, true);
    } else {
      return spawn.spawnRole(roleList.harvester, true);
    }
  }

  // Regular spawning
  for (let name in roleList) {
    let role = roleList[name as RoleNames];

    let creeps = role.creeps();
    let demand = spawn.roleDemand(role);
    console.log(`${creeps.length} of ${demand} ${name}: ${creeps}`);

    if (creeps.length < demand) {
      return spawn.spawnRole(role);
    }
  }

  return OK;
}
