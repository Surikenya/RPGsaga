import { Bowman } from './Bowman';
import { Character } from './Character';
import { Warrior } from './Warrior';
import { EffectKind } from '../effects/Effect';

// Тесты для класса Bowman
describe('Bowman', () => {
  let bowman: Bowman;
  let opponent: Character;

  beforeEach(() => {
    bowman = new Bowman('Эльдар', 100, 15);
    opponent = new Warrior('Противник', 100, 10);
  });

  describe('Базовые свойства', () => {
    test('должен возвращать правильный тип персонажа', () => {
      expect(bowman.getCharacterClass()).toBe('Лучник');
    });

    test('должен возвращать правильное название способности', () => {
      expect(['Огненные стрелы', 'Ледяные стрелы']).toContain(bowman.getSpecialAbilityName());
    });
  });

  describe('isSpecialAbilityAvailable', () => {
    test('должен возвращать true, если есть доступные способности', () => {
      expect(bowman.isSpecialAbilityAvailable()).toBe(true);
    });

    test('должен возвращать true после использования огненных стрел', () => {
      bowman.useSpecialAbility(opponent);
      expect(bowman.isSpecialAbilityAvailable()).toBe(true);
    });

    test('должен возвращать false после использования всех способностей', () => {
      bowman.useSpecialAbility(opponent);
      bowman.useSpecialAbility(opponent);
      bowman.useSpecialAbility(opponent);
      
      expect(bowman.isSpecialAbilityAvailable()).toBe(false);
    });
  });

  describe('useSpecialAbility - Огненные стрелы', () => {
    test('должен применять эффект горения к противнику', () => {
      bowman.useSpecialAbility(opponent);
      expect(opponent.hasEffect(EffectKind.FIRE)).toBe(true);
    });

    test('не должен наносить мгновенный урон при использовании огненных стрел', () => {
      const initialHealth = opponent.health;
      const damage = bowman.useSpecialAbility(opponent);
      
      expect(damage).toBe(0);
      expect(opponent.health).toBe(initialHealth);
    });

    test('должен наносить урон от горения каждый ход', () => {
      bowman.useSpecialAbility(opponent);
      
      const healthBeforeEffect = opponent.health;
      opponent.applyEffects();
      
      expect(opponent.health).toBe(healthBeforeEffect - 2);
    });
  });

  describe('useSpecialAbility - Ледяные стрелы', () => {
    test('должен наносить мгновенный урон при использовании ледяных стрел', () => {
      bowman.useSpecialAbility(opponent);
      
      const initialHealth = opponent.health;
      const damage = bowman.useSpecialAbility(opponent);
      
      expect(damage).toBe(bowman.strength);
      expect(opponent.health).toBe(initialHealth - bowman.strength);
    });

    test('должен применять эффект льда к противнику', () => {
      bowman.useSpecialAbility(opponent);
      bowman.useSpecialAbility(opponent);
      
      expect(opponent.hasEffect(EffectKind.ICE)).toBe(true);
    });

    test('должен суммировать урон от нескольких ледяных эффектов', () => {
      bowman.useSpecialAbility(opponent);
      bowman.useSpecialAbility(opponent);
      bowman.useSpecialAbility(opponent);
      
      const effects = (opponent as any).activeEffects.filter((e: any) => 
        e.kind === EffectKind.ICE && e.isActive
      );
      
      expect(effects.length).toBe(1);
      const iceDamagePerTurn = Math.floor(bowman.strength / 2);
      expect(effects[0].damagePerTurn).toBe(iceDamagePerTurn * 2);
    });

    test('должен позволять использовать ледяные стрелы 2 раза за бой', () => {
      bowman.useSpecialAbility(opponent);
      
      expect(bowman.isSpecialAbilityAvailable()).toBe(true);
      bowman.useSpecialAbility(opponent);
      expect(bowman.isSpecialAbilityAvailable()).toBe(true);
      bowman.useSpecialAbility(opponent);
      expect(bowman.isSpecialAbilityAvailable()).toBe(false);
    });
  });

  describe('resetForNewBattle', () => {
    test('должен сбрасывать все флаги использования способностей', () => {
      bowman.useSpecialAbility(opponent);
      bowman.useSpecialAbility(opponent);
      bowman.useSpecialAbility(opponent);
      
      expect(bowman.isSpecialAbilityAvailable()).toBe(false);
      
      bowman.resetForNewBattle();
      
      expect(bowman.isSpecialAbilityAvailable()).toBe(true);
    });
  });
});

