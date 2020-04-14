import Builder from './Builder';
import Lorry from './Lorry';
import Miner from './Miner';
import Repairer from './Repairer';
import WallRepairer from './WallRepairer';
import Upgrader from './Upgrader';
import LinkLoader from './LinkLoader';
import { RoleNames } from './RoleNames';

let basicRoles: RoleList = {
  [RoleNames.MINER]: Miner,
  [RoleNames.LORRY]: Lorry,
  [RoleNames.LINK_LOADER]: LinkLoader,
  [RoleNames.REPAIRER]: Repairer,
  [RoleNames.UPGRADER]: Upgrader,
  [RoleNames.BUILDER]: Builder,
  [RoleNames.WALL_REPAIRER]: WallRepairer,
};

export const BasicRoles = basicRoles;

import Specialist from './Specialist';
import Salvager from './Salvager';
import Defender from './Defender';

export const SpecialRoles: RoleList = {
  [RoleNames.SPECIALIST]: Specialist,
  [RoleNames.SALVAGER]: Salvager,
  [RoleNames.DEFENDER]: Defender,
};
