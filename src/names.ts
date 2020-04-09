/// These are the names of the creeps - they should never be used up.
export const names = [
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

export function getRandomName() {
  for (let name of names) {
    if (Game.creeps[name]) {
      continue;
    } else {
      return name;
    }
  }
  return 'ENDOFTHELINE!!!!!!';
}
