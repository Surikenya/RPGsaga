import { Wizard } from './Wizard';
import { Character } from './Character';
import { Warrior } from './Warrior';
import { Effect, EffectKind } from '../effects/Effect';

// Тесты для класса Wizard
describe('Wizard', () => {
  let wizard: Wizard;
  let opponent: Character;

  beforeEach(() => {
    wizard = new Wizard('Гэндальф', 80, 12);
    opponent = new Warrior('Противник', 100, 10);
  });

  describe('Базовые свойства', () => {
    test('должен возвращать правильный тип персонажа', () => {
      expect(wizard.getCharacterClass()).toBe('Маг');
    });

    test('должен возвращать правильное название способности', () => {
      expect(wizard.getSpecialAbilityName()).toBe('Заворожение');
    });
  });

  describe('isSpecialAbilityAvailable', () => {
    test('должен всегда возвращать true', () => {
      expect(wizard.isSpecialAbilityAvailable()).toBe(true);
      
      wizard.useSpecialAbility(opponent);
      expect(wizard.isSpecialAbilityAvailable()).toBe(true);
      
      wizard.useSpecialAbility(opponent);
      expect(wizard.isSpecialAbilityAvailable()).toBe(true);
    });
  });

  describe('useSpecialAbility', () => {
    test('должен применять эффект заворожения к противнику', () => {
      wizard.useSpecialAbility(opponent);
      expect(opponent.hasEffect(EffectKind.CHARM)).toBe(true);
    });

    test('не должен наносить урон при использовании заворожения', () => {
      const initialHealth = opponent.health;
      const damage = wizard.useSpecialAbility(opponent);
      
      expect(damage).toBe(0);
      expect(opponent.health).toBe(initialHealth);
    });

    test('должен блокировать урон, если противник заворожен', () => {
      wizard.useSpecialAbility(opponent);
      
      const initialHealth = opponent.health;
      opponent.receiveDamage(50);
      
      expect(opponent.health).toBe(initialHealth);
      expect(opponent.hasEffect(EffectKind.CHARM)).toBe(false);
    });
  });

  describe('Иммунитет к льду', () => {
    test('должен быть невосприимчив к ледяным эффектам', () => {
      const iceEffect = new Effect(EffectKind.ICE, 3, 5);
      wizard.addEffect(iceEffect);
      
      expect(wizard.hasEffect(EffectKind.ICE)).toBe(false);
    });

    test('должен принимать другие эффекты', () => {
      const fireEffect = new Effect(EffectKind.FIRE, 3, 5);
      wizard.addEffect(fireEffect);
      
      expect(wizard.hasEffect(EffectKind.FIRE)).toBe(true);
    });
  });

  describe('healAndRemoveEffects', () => {
    test('должен удалять все эффекты', () => {
      const fireEffect = new Effect(EffectKind.FIRE, 3, 5);
      wizard.addEffect(fireEffect);
      
      expect(wizard.hasEffect(EffectKind.FIRE)).toBe(true);
      
      wizard.healAndRemoveEffects();
      
      expect(wizard.hasEffect(EffectKind.FIRE)).toBe(false);
    });
  });
});

