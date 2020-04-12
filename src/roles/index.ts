import Builder from './Builder';
import Lorry from './Lorry';
import Miner from './Miner';
import Repairer from './Repairer';
import WallRepairer from './WallRepairer';
import Upgrader from './Upgrader';
import { RoleNames } from './RoleNames';

let basicRoles: RoleList = {
  [RoleNames.MINER]: Miner,
  [RoleNames.LORRY]: Lorry,
  [RoleNames.UPGRADER]: Upgrader,
  [RoleNames.REPAIRER]: Repairer,
  [RoleNames.BUILDER]: Builder,
  [RoleNames.WALL_REPAIRER]: WallRepairer,
};

export const BasicRoles = basicRoles;

import Specialist from './Specialist';

export const SpecialRoles: RoleList = {
  [RoleNames.SPECIALIST]: Specialist,
};
