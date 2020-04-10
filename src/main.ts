import { ErrorMapper } from 'utils';
import 'Traveler/Traveler';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

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
