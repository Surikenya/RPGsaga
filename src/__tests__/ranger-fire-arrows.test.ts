import { Ranger } from '../fighters/Ranger';
import { Paladin } from '../fighters/Paladin';

test('Лучник использует огненные стрелы без мгновенного урона и накладывает горение', function () {
  const ranger = new Ranger('Леголас', 100, 10);
  const target = new Paladin('Манекен', 100, 5);

  const damage = ranger.executeAbility(target);

  expect(damage).toBe(0);

  const dotDamage = target.processStatusEffects();
  expect(dotDamage).toBe(2);
});
