/// These are the names of the creeps - they should never be used up.
const names = [
  'Jim',
  'Crystal',
  'Nathan',
  'Samuel',
  'Anna',
  'Tom',
  'Diane',
  'Pat',
  'Gary',
  'Tina',
  'David',
  'Andy',
  'Joey',
  'Chris',
  'Steven',
  'Sarah',
  'Spurf',
  'Elizabeth',
  'Melchizedek',
  'Sassel',
  'Grillbrick',
  'Abbey',
  'Katie',
];

function getRandomName(room: Room) {
  for (let name of names) {
    if (Game.creeps[name]) {
      continue;
    } else {
      return `${name}_${room.name}`;
    }
  }
  return 'ENDOFTHELINE!!!!!!';
}
