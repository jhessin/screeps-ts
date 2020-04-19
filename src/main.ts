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

  for (const room of Object.values(Game.rooms)) {
    // Run Links
    for (const link of room.find(FIND_MY_STRUCTURES, {
      filter: s => s instanceof StructureLink,
    }) as StructureLink[]) {
      link.run();
    }

    // Run Terminals
    for (const terminal of room.find(FIND_MY_STRUCTURES, {
      filter: s => s instanceof StructureTerminal,
    }) as StructureTerminal[]) {
      if (terminal.cooldown > 0) break;
      let roomName = terminal.room.name;
      for (const resource of Object.keys(
        terminal.store,
      ) as ResourceConstant[]) {
        if (resource === RESOURCE_ENERGY) continue;
        let amount = terminal.store[resource];
        let orders = Game.market.getAllOrders({
          type: ORDER_BUY,
          resourceType: resource,
        });

        let best: Order | undefined;
        for (const order of orders) {
          if (!best) best = order;
          if (!order.roomName) continue;
          if (!best.roomName) continue;
          let orderCost = Game.market.calcTransactionCost(
            amount,
            roomName,
            order.roomName,
          );
          let bestCost = Game.market.calcTransactionCost(
            amount,
            roomName,
            best.roomName,
          );
          if (order.price > best.price || orderCost < bestCost) best = order;
        }
        if (!best || !best.roomName) continue;

        Game.market.deal(best.id, amount, roomName);
      }
    }
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
