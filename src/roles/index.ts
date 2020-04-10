import Harvester from './harvester';
import Builder from './builder';
import Lorry from './lorry';
import Miner from './miner';
import Repairer from './repairer';
import WallRepairer from './wallRepairer';
import Specialist from './specialist';
import Upgrader from './upgrader';

let RoleList: RoleList = {
  [Roles.HARVESTER]: Harvester,
  [Roles.BUILDER]: Builder,
  [Roles.LORRY]: Lorry,
  [Roles.MINER]: Miner,
  [Roles.REPAIRER]: Repairer,
  [Roles.WALL_REPAIRER]: WallRepairer,
  [Roles.SPECIALIST]: Specialist,
  [Roles.UPGRADER]: Upgrader,
};
