import Builder from './Builder';
import Lorry from './Lorry';
import Miner from './Miner';
import Repairer from './Repairer';
import WallRepairer from './WallRepairer';
import Upgrader from './Upgrader';
import LinkLoader from './LinkLoader';
import { RoleName } from './RoleNames';

let basicRoles: RoleList = {
  [RoleName.MINER]: Miner,
  [RoleName.LORRY]: Lorry,
  [RoleName.LINK_LOADER]: LinkLoader,
  [RoleName.REPAIRER]: Repairer,
  [RoleName.UPGRADER]: Upgrader,
  [RoleName.BUILDER]: Builder,
  [RoleName.WALL_REPAIRER]: WallRepairer,
};

export const BasicRoles = basicRoles;

import Specialist from './Specialist';
import Salvager from './Salvager';
import Defender from './Defender';

export const SpecialRoles: RoleList = {
  [RoleName.SPECIALIST]: Specialist,
  [RoleName.SALVAGER]: Salvager,
  [RoleName.DEFENDER]: Defender,
};
