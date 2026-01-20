import { Paladin } from '../fighters/Paladin';
import { StatusEffect, StatusType } from '../status/StatusEffect';

test('Эффект заморозки суммирует урон при повторном наложении', function () {
  const fighter = new Paladin('Тест', 100, 10);

  const freeze1 = new StatusEffect(StatusType.FREEZE, 3, 2);
  const freeze2 = new StatusEffect(StatusType.FREEZE, 3, 2);

  fighter.applyStatus(freeze1);
  fighter.applyStatus(freeze2);

  const damage = fighter.processStatusEffects();

  expect(damage).toBe(4);
});
