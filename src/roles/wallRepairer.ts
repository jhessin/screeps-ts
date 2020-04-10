let wallRepairer: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.WALL_REPAIRER,
    working: true,
  },
  run: (creep: Creep) => {
    return OK;
  },
};

export default wallRepairer;
