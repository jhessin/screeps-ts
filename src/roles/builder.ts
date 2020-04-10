let builder: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.BUILDER,
    working: true,
  },
  run: (creep: Creep) => {
    return OK;
  },
};

export default builder;
