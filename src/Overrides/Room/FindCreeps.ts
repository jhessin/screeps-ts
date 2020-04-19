interface Room {
  findCreeps(role?: Role): Creep[];
}

Room.prototype.findCreeps = function(role) {
  if (role) {
    return this.find(FIND_MY_CREEPS, {
      filter: s => s.memory.role === role,
    });
  } else {
    return this.find(FIND_MY_CREEPS);
  }
};
