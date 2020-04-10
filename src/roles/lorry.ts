let lorry: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.LORRY,
    working: true,
  },
  run: (creep: Creep) => {
    return OK;
  },
};

export default lorry;
