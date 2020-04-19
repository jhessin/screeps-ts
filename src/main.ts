import { ErrorMapper } from 'utils/ErrorMapper';
import './Names';
import './Traveler/Traveler';
import './Overrides/Creep/Basic';
import './Overrides/Creep/Run';
import './Overrides/Room/FindCreeps';
import './Overrides/RoomObject/Claimed';
import './Overrides/RoomPosition/Finder';
import './Overrides/Spawn/Spawner';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Run all creeps in the game
  for (const creep of Object.values(Game.creeps)) {
    creep.run();
  }

  for (const spawn of Object.values(Game.spawns)) {
    spawn.run();
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
