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
  [RoleNames.REPAIRER]: Repairer,
  [RoleNames.UPGRADER]: Upgrader,
  [RoleNames.WALL_REPAIRER]: WallRepairer,
  [RoleNames.BUILDER]: Builder,
  [RoleNames.SPECIALIST]: Specialist,
};

export default roleList;
