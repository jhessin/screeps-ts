import Harvester from './harvester';
import Builder from './builder';
import Lorry from './lorry';
import Miner from './miner';
import Repairer from './repairer';
import WallRepairer from './wallRepairer';
import Specialist from './specialist';
import Upgrader from './upgrader';
import { RoleNames } from './roleNames';

let roleList: RoleList = {
  [RoleNames.MINER]: Miner,
  [RoleNames.LORRY]: Lorry,
  [RoleNames.UPGRADER]: Upgrader,
  [RoleNames.HARVESTER]: Harvester,
  [RoleNames.BUILDER]: Builder,
  [RoleNames.REPAIRER]: Repairer,
  [RoleNames.WALL_REPAIRER]: WallRepairer,
  [RoleNames.SPECIALIST]: Specialist,
};

export default roleList;
