let Harvester: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.HARVESTER,
    working: true,
  },
  run: (creep: Creep) => {
    return OK;
  },
};

export default Harvester;
