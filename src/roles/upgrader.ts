export const Upgrader = {
  run(creep: Creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) creep.moveTo(sources[0]);
    } else {
      if (!creep.room.controller) {
        if (creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY)) creep.moveTo(Game.spawns["Spawn1"]);
      } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
        creep.moveTo(creep.room.controller);
    }
  }
};
