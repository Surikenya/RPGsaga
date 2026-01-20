import { Paladin } from '../fighters/Paladin';
import { Ranger } from '../fighters/Ranger';

test('Все бойцы могут использовать ледяные стрелы один раз за бой', function () {
  const attacker = new Paladin('Артур', 100, 10);
  const target = new Paladin('Манекен', 100, 5);

  const first = attacker.useIceArrows(target);
  const second = attacker.useIceArrows(target);

  expect(first).toBe(10);
  expect(second).toBe(10);
});

test('Лучник может использовать ледяные стрелы два раза за бой', function () {
  const ranger = new Ranger('Леголас', 100, 10);
  const target = new Paladin('Манекен', 100, 5);

  const first = ranger.useIceArrows(target);
  const second = ranger.useIceArrows(target);

  expect(first).toBe(10);
  expect(second).toBe(10);
});
