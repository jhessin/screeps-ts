export function updateState(creep: Creep) {
  if (creep.memory.working && creep.store.energy === 0) {
    creep.memory.working = false;
  } else if (
    !creep.memory.working &&
    creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0
  ) {
    creep.memory.working = true;
  }
}
