import Builder from './builder';
import Lorry from './lorry';
import Miner from './miner';
import Repairer from './repairer';
import WallRepairer from './wallRepairer';
import Upgrader from './upgrader';
import { RoleNames } from './roleNames';

let basicRoles: RoleList = {
  [RoleNames.MINER]: Miner,
  [RoleNames.LORRY]: Lorry,
  [RoleNames.REPAIRER]: Repairer,
  [RoleNames.UPGRADER]: Upgrader,
  [RoleNames.BUILDER]: Builder,
  [RoleNames.WALL_REPAIRER]: WallRepairer,
};

export * from './specialist';
export default basicRoles;
