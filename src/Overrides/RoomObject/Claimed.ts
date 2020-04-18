interface RoomObject {
  claimed(): boolean;
  id?: Id<any>;
}

RoomObject.prototype.claimed = function() {
  let room = this.room;
  let id = this.id;
  if (!room) return false;
  if (!id) return false;
  for (let creep of room.find(FIND_MY_CREEPS)) {
    if (creep.memory.targetId === this.id) {
      return true;
    }
  }
  return false;
};
