interface Creep {
  _attack(
    target: Creep | PowerCreep | Structure,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART;

  _attackController(
    target: StructureController,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART;

  _build(
    target: ConstructionSite,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_NOT_ENOUGH_RESOURCES
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_RCL_NOT_ENOUGH
    | ERR_NO_BODYPART;

  _claimController(
    target: StructureController,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_FULL
    | ERR_NOT_IN_RANGE
    | ERR_NO_BODYPART
    | ERR_TIRED
    | ERR_GCL_NOT_ENOUGH;

  _dismantle(
    target: Structure,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART;

  _harvest(
    target: Source | Mineral | Deposit,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_NOT_FOUND
    | ERR_NOT_ENOUGH_RESOURCES
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART;

  _heal(
    target: Creep | PowerCreep,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART;

  _pickup(
    target: Resource,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_FULL
    | ERR_TIRED
    | ERR_NOT_IN_RANGE
    | ERR_NO_BODYPART;

  _repair(
    target: Structure,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_NOT_ENOUGH_RESOURCES
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART;

  _reserveController(
    target: StructureController,
  ):
    | OK
    | ERR_NOT_OWNER
    | ERR_BUSY
    | ERR_INVALID_TARGET
    | ERR_NOT_IN_RANGE
    | ERR_TIRED
    | ERR_NO_BODYPART;

  _signController(
    target: StructureController,
    text: string,
  ): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE;

  _transfer(
    target: Creep | PowerCreep | Structure,
    resourceType: string,
    amount?: number,
  ): ScreepsReturnCode;

  _upgradeController(target: StructureController): ScreepsReturnCode;

  _withdraw(
    target: Structure | Tombstone | Ruin,
    resourceType: string,
    amount?: number,
  ): ScreepsReturnCode;
}

interface CreepMemory {
  targetId: Id<any>;
  action: string;
}

function travelOrReport(
  code: ScreepsReturnCode,
  creep: Creep,
  target: RoomObject & { id: Id<any> },
): ScreepsReturnCode {
  creep.memory.targetId = target.id;
  if (code === ERR_NOT_IN_RANGE) {
    creep.travelTo(target);
  } else if (code !== OK) {
    console.log(`Couldn't attack: ${code}`);
    delete creep.memory.targetId;
    delete creep.memory._trav;
  }

  return code;
}

if (!Creep.prototype._attack) {
  Creep.prototype._attack = Creep.prototype.attack;
  Creep.prototype.attack = function(target) {
    this.memory.action = 'attack';
    let code = this._attack(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._attackController) {
  Creep.prototype._attackController = Creep.prototype.attackController;
  Creep.prototype.attackController = function() {
    let target = this.room.controller;
    if (!target) return ERR_INVALID_TARGET;
    this.memory.action = 'attackController';
    let code = this._attackController(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._build) {
  Creep.prototype._build = Creep.prototype.build;
  Creep.prototype.build = function(target) {
    this.memory.action = 'build';
    let code = this._build(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._claimController) {
  Creep.prototype._claimController = Creep.prototype.claimController;
  Creep.prototype.claimController = function() {
    let target = this.room.controller;
    if (!target) return ERR_INVALID_TARGET;
    this.memory.action = 'claimController';
    let code = this._claimController(target);

    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._dismantle) {
  Creep.prototype._dismantle = Creep.prototype.dismantle;
  Creep.prototype.dismantle = function(target) {
    this.memory.action = 'dismantle';
    let code = this._dismantle(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._harvest) {
  Creep.prototype._harvest = Creep.prototype.harvest;
  Creep.prototype.harvest = function(target) {
    this.memory.action = 'harvest';
    let code = this._harvest(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._heal) {
  Creep.prototype._heal = Creep.prototype.heal;
  Creep.prototype.heal = function(target) {
    this.memory.action = 'heal';
    let code = this._heal(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._pickup) {
  Creep.prototype._pickup = Creep.prototype.pickup;
  Creep.prototype.pickup = function(target) {
    this.memory.action = 'pickup';
    let code = this._pickup(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._repair) {
  Creep.prototype._repair = Creep.prototype.repair;
  Creep.prototype.repair = function(target) {
    this.memory.action = 'repair';
    let code = this._repair(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._reserveController) {
  Creep.prototype._reserveController = Creep.prototype.reserveController;
  Creep.prototype.reserveController = function() {
    let target = this.room.controller;
    if (!target) return ERR_INVALID_TARGET;
    this.memory.action = 'reserveController';
    let code = this._reserveController(target);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._signController) {
  Creep.prototype._signController = Creep.prototype.signController;
  Creep.prototype.signController = function(_, msg: string) {
    let target = this.room.controller;
    if (!target) return ERR_INVALID_TARGET;
    this.memory.action = 'signController';
    let code = this._signController(target, msg);
    return travelOrReport(code, this, target) as 0;
  };
}

if (!Creep.prototype._transfer) {
  Creep.prototype._transfer = Creep.prototype.transfer;
  Creep.prototype.transfer = function(target, resourceType, amount) {
    this.memory.action = 'transfer';
    let code = this.transfer(target, resourceType, amount);
    return travelOrReport(code, this, target);
  };
}

if (!Creep.prototype._upgradeController) {
  Creep.prototype._upgradeController = Creep.prototype.upgradeController;
  Creep.prototype.upgradeController = function() {
    let target = this.room.controller;
    if (!target) return ERR_INVALID_TARGET;
    this.memory.action = 'upgradeController';
    let code = this._upgradeController(target);
    return travelOrReport(code, this, target);
  };
}

if (!Creep.prototype._withdraw) {
  Creep.prototype._withdraw = Creep.prototype.withdraw;
  Creep.prototype.withdraw = function(target, resourceType, amount) {
    this.memory.action = 'withdraw';
    let code = this._withdraw(target, resourceType, amount);
    return travelOrReport(code, this, target);
  };
}
