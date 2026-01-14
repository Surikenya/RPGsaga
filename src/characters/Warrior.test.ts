import { Warrior } from './Warrior';
import { Character } from './Character';

// Тесты для класса Warrior
describe('Warrior', () => {
  let warrior: Warrior;
  let opponent: Character;

  beforeEach(() => {
    warrior = new Warrior('Артур', 100, 20);
    opponent = new Warrior('Противник', 100, 10);
  });

  describe('Базовые свойства', () => {
    test('должен возвращать правильный тип персонажа', () => {
      expect(warrior.getCharacterClass()).toBe('Рыцарь');
    });

    test('должен возвращать правильное название способности', () => {
      expect(warrior.getSpecialAbilityName()).toBe('Удар возмездия');
    });
  });

  describe('isSpecialAbilityAvailable', () => {
    test('должен возвращать true до использования способности', () => {
      expect(warrior.isSpecialAbilityAvailable()).toBe(true);
    });

    test('должен возвращать false после использования способности', () => {
      warrior.useSpecialAbility(opponent);
      expect(warrior.isSpecialAbilityAvailable()).toBe(false);
    });
  });

  describe('useSpecialAbility', () => {
    test('должен наносить урон с бонусом 30%', () => {
      const initialHealth = opponent.health;
      warrior.useSpecialAbility(opponent);
      
      const expectedDamage = 20 + Math.floor(20 * 0.3);
      expect(opponent.health).toBe(initialHealth - expectedDamage);
    });

    test('должен возвращать правильный урон', () => {
      const damage = warrior.useSpecialAbility(opponent);
      const expectedDamage = 20 + Math.floor(20 * 0.3);
      expect(damage).toBe(expectedDamage);
    });

    test('не должен позволять использовать способность дважды за бой', () => {
      warrior.useSpecialAbility(opponent);
      const healthBeforeSecondUse = opponent.health;
      
      warrior.useSpecialAbility(opponent);
      
      expect(opponent.health).toBe(healthBeforeSecondUse - warrior.strength);
    });
  });

  describe('resetForNewBattle', () => {
    test('должен сбрасывать флаг использования способности', () => {
      warrior.useSpecialAbility(opponent);
      expect(warrior.isSpecialAbilityAvailable()).toBe(false);
      
      warrior.resetForNewBattle();
      expect(warrior.isSpecialAbilityAvailable()).toBe(true);
    });
  });
});

