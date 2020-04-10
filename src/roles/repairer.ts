let repairer: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.REPAIRER,
    working: true,
  },
  run: (creep: Creep) => {
    return OK;
  },
};

export default repairer;
