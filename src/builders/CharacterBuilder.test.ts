import { CharacterBuilder, CharacterType } from './CharacterBuilder';
import { Character } from '../characters/Character';
import { Warrior } from '../characters/Warrior';
import { Bowman } from '../characters/Bowman';
import { Wizard } from '../characters/Wizard';

// Тесты для CharacterBuilder
describe('CharacterBuilder', () => {
  let mockRandom: jest.Mock;

  beforeEach(() => {
    mockRandom = jest.fn();
  });

  describe('createCharacter', () => {
    test('должен создавать воина с заданными параметрами', () => {
      const character = CharacterBuilder.createCharacter(CharacterType.WARRIOR, {
        name: 'Тестовый Рыцарь',
        health: 100,
        strength: 20
      });

      expect(character).toBeInstanceOf(Warrior);
      expect(character.name).toBe('Тестовый Рыцарь');
      expect(character.health).toBe(100);
      expect(character.strength).toBe(20);
    });

    test('должен создавать лучника с заданными параметрами', () => {
      const character = CharacterBuilder.createCharacter(CharacterType.BOWMAN, {
        name: 'Тестовый Лучник',
        health: 80,
        strength: 15
      });

      expect(character).toBeInstanceOf(Bowman);
      expect(character.name).toBe('Тестовый Лучник');
      expect(character.health).toBe(80);
      expect(character.strength).toBe(15);
    });

    test('должен создавать мага с заданными параметрами', () => {
      const character = CharacterBuilder.createCharacter(CharacterType.WIZARD, {
        name: 'Тестовый Маг',
        health: 70,
        strength: 25
      });

      expect(character).toBeInstanceOf(Wizard);
      expect(character.name).toBe('Тестовый Маг');
      expect(character.health).toBe(70);
      expect(character.strength).toBe(25);
    });

    test('должен выбрасывать ошибку для неизвестного типа', () => {
      expect(() => {
        CharacterBuilder.createCharacter('UNKNOWN' as CharacterType, {
          name: 'Тест',
          health: 100,
          strength: 10
        });
      }).toThrow('Неизвестный тип персонажа');
    });
  });

  describe('createRandomCharacter', () => {
    test('должен создавать персонажа со случайными параметрами', () => {
      mockRandom
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5);

      const character = CharacterBuilder.createRandomCharacter(CharacterType.WARRIOR, mockRandom);

      expect(character).toBeInstanceOf(Warrior);
      expect(character.name).toBeDefined();
      expect(character.health).toBeGreaterThanOrEqual(50);
      expect(character.health).toBeLessThanOrEqual(150);
      expect(character.strength).toBeGreaterThanOrEqual(5);
      expect(character.strength).toBeLessThanOrEqual(50);
    });

    test('должен создавать персонажа с разными типами', () => {
      const warrior = CharacterBuilder.createRandomCharacter(CharacterType.WARRIOR);
      const bowman = CharacterBuilder.createRandomCharacter(CharacterType.BOWMAN);
      const wizard = CharacterBuilder.createRandomCharacter(CharacterType.WIZARD);

      expect(warrior).toBeInstanceOf(Warrior);
      expect(bowman).toBeInstanceOf(Bowman);
      expect(wizard).toBeInstanceOf(Wizard);
    });
  });

  describe('createRandomCharacters', () => {
    test('должен создавать указанное количество персонажей', () => {
      const characters = CharacterBuilder.createRandomCharacters(6);

      expect(characters.length).toBe(6);
      characters.forEach(char => {
        expect(char).toBeInstanceOf(Character);
      });
    });

    test('должен создавать персонажей разных типов', () => {
      const characters = CharacterBuilder.createRandomCharacters(10);

      const types = new Set(characters.map(c => c.getCharacterClass()));
      expect(types.size).toBeGreaterThan(1);
    });

    test('должен использовать переданный генератор случайных чисел', () => {
      mockRandom.mockReturnValue(0.5);

      CharacterBuilder.createRandomCharacters(3, mockRandom);

      expect(mockRandom).toHaveBeenCalled();
    });
  });

  describe('getAvailableNames', () => {
    test('должен возвращать массив имен', () => {
      const names = CharacterBuilder.getAvailableNames();

      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
      names.forEach(name => {
        expect(typeof name).toBe('string');
      });
    });
  });

  describe('getRandomName', () => {
    test('должен возвращать случайное имя из списка', () => {
      const names = CharacterBuilder.getAvailableNames();
      const randomName = CharacterBuilder.getRandomName();

      expect(names).toContain(randomName);
    });

    test('должен использовать переданный генератор случайных чисел', () => {
      mockRandom.mockReturnValue(0.5);

      CharacterBuilder.getRandomName(mockRandom);

      expect(mockRandom).toHaveBeenCalled();
    });
  });
});

