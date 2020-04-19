interface StructureLink {
  run(): void;
}

StructureLink.prototype.run = function() {
  let otherLinks = this.room.find(FIND_MY_STRUCTURES, {
    filter: s => s instanceof StructureLink,
  }) as StructureLink[];

  if (this.store.getFreeCapacity() === 0) {
    // link is full offload some energy
    let target: StructureLink | undefined;
    for (let link of otherLinks) {
      if (!target) target = link;
      if (
        link.store.getUsedCapacity(RESOURCE_ENERGY) <
        target.store.getUsedCapacity(RESOURCE_ENERGY)
      )
        target = link;
    }

    if (target)
      this.transferEnergy(
        target,
        target.store.getFreeCapacity(RESOURCE_ENERGY),
      );
  }
};
