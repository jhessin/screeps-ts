import Harvester from './harvester';
import Builder from './builder';
import Lorry from './lorry';
import Miner from './miner';
import Repairer from './repairer';
import WallRepairer from './wallRepairer';
import Specialist from './specialist';
import Upgrader from './upgrader';

let roleList: RoleList = {
  [RoleNames.HARVESTER]: Harvester,
  [RoleNames.BUILDER]: Builder,
  [RoleNames.LORRY]: Lorry,
  [RoleNames.MINER]: Miner,
  [RoleNames.REPAIRER]: Repairer,
  [RoleNames.WALL_REPAIRER]: WallRepairer,
  [RoleNames.SPECIALIST]: Specialist,
  [RoleNames.UPGRADER]: Upgrader,
};

export default roleList;
