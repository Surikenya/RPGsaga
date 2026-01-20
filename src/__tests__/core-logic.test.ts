import { Paladin } from '../fighters/Paladin';
import { Ranger } from '../fighters/Ranger';
import { StatusEffect, StatusType } from '../status/StatusEffect';

test('Боец жив, если здоровье больше 0', function () {
  const fighter = new Paladin('Тест', 10, 1);
  expect(fighter.isAlive()).toBe(true);
});

test('Боец умирает, если здоровье стало 0', function () {
  const fighter = new Paladin('Тест', 10, 1);
  fighter.sufferDamage(10);
  expect(fighter.health).toBe(0);
  expect(fighter.isAlive()).toBe(false);
});

test('Здоровье не уходит в минус при уроне больше текущего', function () {
  const fighter = new Paladin('Тест', 10, 1);
  fighter.sufferDamage(999);
  expect(fighter.health).toBe(0);
  expect(fighter.isAlive()).toBe(false);
});

test('Отрицательный урон не лечит и не меняет здоровье', function () {
  const fighter = new Paladin('Тест', 10, 1);
  const dealt = fighter.sufferDamage(-5);
  expect(dealt).toBe(0);
  expect(fighter.health).toBe(10);
});

test('Обычная атака уменьшает здоровье цели ровно на силу атакующего', function () {
  const attacker = new Paladin('Атакер', 100, 12);
  const target = new Paladin('Цель', 50, 1);

  const damage = attacker.performAttack(target);

  expect(damage).toBe(12);
  expect(target.health).toBe(38);
});

test('Лечение не превышает максимальное здоровье', function () {
  const fighter = new Paladin('Тест', 20, 1);
  fighter.sufferDamage(15);
  expect(fighter.health).toBe(5);

  fighter.restoreHealth(999);
  expect(fighter.health).toBe(20);
  expect(fighter.maxHealth).toBe(20);
});

test('processStatusEffects наносит урон от горения и уменьшает здоровье', function () {
  const fighter = new Paladin('Тест', 10, 1);
  fighter.applyStatus(new StatusEffect(StatusType.BURN, 3, 2));

  const dmg = fighter.processStatusEffects();

  expect(dmg).toBe(2);
  expect(fighter.health).toBe(8);
});

test('Эффект с длительностью 1 ход снимается после обработки', function () {
  const fighter = new Paladin('Тест', 10, 1);
  fighter.applyStatus(new StatusEffect(StatusType.BURN, 1, 2));

  fighter.processStatusEffects();

  expect(fighter.hasStatus(StatusType.BURN)).toBe(false);
});

test('resetForNewBattle очищает статусы', function () {
  const fighter = new Paladin('Тест', 10, 1);
  fighter.applyStatus(new StatusEffect(StatusType.BURN, 3, 2));
  expect(fighter.hasStatus(StatusType.BURN)).toBe(true);

  fighter.resetForNewBattle();

  expect(fighter.hasStatus(StatusType.BURN)).toBe(false);
});

test('Лучник остаётся живым до тех пор, пока здоровье больше 0 (быстрый регресс)', function () {
  const ranger = new Ranger('Лучник', 5, 1);
  ranger.sufferDamage(4);
  expect(ranger.isAlive()).toBe(true);

  ranger.sufferDamage(1);
  expect(ranger.health).toBe(0);
  expect(ranger.isAlive()).toBe(false);
});
