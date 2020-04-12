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
  [RoleNames.UPGRADER]: Upgrader,
  [RoleNames.REPAIRER]: Repairer,
  [RoleNames.BUILDER]: Builder,
  [RoleNames.WALL_REPAIRER]: WallRepairer,
};

export const BasicRoles = basicRoles;

import Specialist from './specialist';

export const SpecialRoles: RoleList = {
  [RoleNames.SPECIALIST]: Specialist,
};
