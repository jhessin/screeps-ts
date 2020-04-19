import { ErrorMapper } from 'utils/ErrorMapper';
import './Names';
import './Traveler/Traveler';
import './Overrides';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // Run all creeps in the game
  for (const creep of Object.values(Game.creeps)) {
    creep.run();
  }

  // Run spawns
  for (const spawn of Object.values(Game.spawns)) {
    spawn.run();
  }

  // Run Links
  for (const room of Object.values(Game.rooms)) {
    for (const link of room.find(FIND_MY_STRUCTURES, {
      filter: s => s instanceof StructureLink,
    }) as StructureLink[]) {
      link.run();
    }
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
