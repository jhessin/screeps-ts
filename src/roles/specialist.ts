let specialist: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.SPECIALIST,
    working: true,
  },
  run: (creep: Creep) => {
    return OK;
  },
};

export default specialist;
