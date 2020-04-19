declare namespace NodeJS {
  interface Global {
    Role: typeof Role;
    Bodies: {
      [name in Role]: BodyPartConstant[];
    };
    getRandomName(room: Room): string;
    resetAction(creep: Creep): ScreepsReturnCode;
  }
}
