let miner: Role = {
  body: [WORK, CARRY, MOVE],
  memory: {
    role: Roles.MINER,
    working: true,
  },
  run: (creep: Creep) => {
    return OK;
  },
};

export default miner;
