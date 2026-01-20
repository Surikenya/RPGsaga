import { Paladin } from '../fighters/Paladin';

test('Рыцарь наносит на 30 процентов больше урона при использовании способности', function () {
  const attacker = new Paladin('Артур', 100, 10);
  const defender = new Paladin('Манекен', 100, 5);

  const damage = attacker.executeAbility(defender);

  expect(damage).toBe(13);
  expect(defender.health).toBe(87);
});
