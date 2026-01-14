import { Character } from './Character';
import { Warrior } from './Warrior';
import { Effect, EffectKind } from '../effects/Effect';

// Тесты для базового класса Character
describe('Character', () => {
  let character: Character;
  let opponent: Character;

  beforeEach(() => {
    character = new Warrior('Тестовый Рыцарь', 100, 10);
    opponent = new Warrior('Противник', 100, 10);
  });

  describe('Конструктор и геттеры', () => {
    test('должен создать персонажа с правильными параметрами', () => {
      expect(character.name).toBe('Тестовый Рыцарь');
      expect(character.health).toBe(100);
      expect(character.maxHealth).toBe(100);
      expect(character.strength).toBe(10);
    });

    test('должен возвращать правильные значения через геттеры', () => {
      expect(character.name).toBe('Тестовый Рыцарь');
      expect(character.health).toBe(100);
      expect(character.strength).toBe(10);
    });
  });

  describe('isAlive', () => {
    test('должен возвращать true, если здоровье больше 0', () => {
      expect(character.isAlive()).toBe(true);
    });

    test('должен возвращать false, если здоровье равно 0', () => {
      character.receiveDamage(100);
      expect(character.isAlive()).toBe(false);
    });

    test('должен возвращать false, если здоровье меньше 0', () => {
      character.receiveDamage(150);
      expect(character.health).toBe(0);
      expect(character.isAlive()).toBe(false);
    });
  });

  describe('attack', () => {
    test('должен наносить урон равный силе персонажа', () => {
      const initialHealth = opponent.health;
      character.attack(opponent);
      expect(opponent.health).toBe(initialHealth - character.strength);
    });

    test('должен возвращать нанесенный урон', () => {
      const damage = character.attack(opponent);
      expect(damage).toBe(character.strength);
    });
  });

  describe('receiveDamage', () => {
    test('должен уменьшать здоровье на величину урона', () => {
      const initialHealth = character.health;
      character.receiveDamage(20);
      expect(character.health).toBe(initialHealth - 20);
    });

    test('не должен уменьшать здоровье ниже 0', () => {
      character.receiveDamage(150);
      expect(character.health).toBe(0);
    });

    test('должен игнорировать урон, если персонаж заворожен', () => {
      const initialHealth = character.health;
      const charmEffect = new Effect(EffectKind.CHARM, 1, 0);
      character.addEffect(charmEffect);
      
      character.receiveDamage(50);
      expect(character.health).toBe(initialHealth);
      expect(character.hasEffect(EffectKind.CHARM)).toBe(false);
    });
  });

  describe('addEffect и hasEffect', () => {
    test('должен добавлять эффект к персонажу', () => {
      const fireEffect = new Effect(EffectKind.FIRE, 3, 2);
      character.addEffect(fireEffect);
      expect(character.hasEffect(EffectKind.FIRE)).toBe(true);
    });

    test('должен суммировать урон от ледяных эффектов', () => {
      const iceEffect1 = new Effect(EffectKind.ICE, 3, 5);
      const iceEffect2 = new Effect(EffectKind.ICE, 3, 3);
      
      character.addEffect(iceEffect1);
      character.addEffect(iceEffect2);
      
      const effects = (character as any).activeEffects.filter((e: Effect) => 
        e.kind === EffectKind.ICE && e.isActive
      );
      expect(effects.length).toBe(1);
      expect(effects[0].damagePerTurn).toBe(8);
    });
  });

  describe('applyEffects', () => {
    test('должен наносить урон от активных эффектов', () => {
      const fireEffect = new Effect(EffectKind.FIRE, 3, 5);
      character.addEffect(fireEffect);
      
      const initialHealth = character.health;
      character.applyEffects();
      
      expect(character.health).toBe(initialHealth - 5);
    });

    test('должен уменьшать длительность эффекта после применения', () => {
      const fireEffect = new Effect(EffectKind.FIRE, 3, 5);
      character.addEffect(fireEffect);
      
      character.applyEffects();
      
      const effects = (character as any).activeEffects;
      const activeFireEffect = effects.find((e: Effect) => 
        e.kind === EffectKind.FIRE && e.isActive
      );
      expect(activeFireEffect.turnsLeft).toBe(2);
    });

    test('должен удалять эффекты с истекшей длительностью', () => {
      const fireEffect = new Effect(EffectKind.FIRE, 1, 5);
      character.addEffect(fireEffect);
      
      character.applyEffects();
      
      expect(character.hasEffect(EffectKind.FIRE)).toBe(false);
    });
  });

  describe('heal', () => {
    test('должен восстанавливать здоровье', () => {
      character.receiveDamage(50);
      const healthBeforeHeal = character.health;
      
      character.heal(30);
      
      expect(character.health).toBe(healthBeforeHeal + 30);
    });

    test('не должен восстанавливать здоровье выше максимального', () => {
      character.receiveDamage(20);
      character.heal(150);
      
      expect(character.health).toBe(character.maxHealth);
    });
  });

  describe('resetForNewBattle', () => {
    test('должен удалять все эффекты при сбросе', () => {
      const fireEffect = new Effect(EffectKind.FIRE, 3, 5);
      character.addEffect(fireEffect);
      
      character.resetForNewBattle();
      
      expect(character.hasEffect(EffectKind.FIRE)).toBe(false);
    });
  });
});

