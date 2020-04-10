let upgrader: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.UPGRADER,
    working: true,
  },
  run: (creep: Creep) => {
    return OK;
  },
};

export default upgrader;
