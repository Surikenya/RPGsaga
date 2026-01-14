import { BattleManager } from './BattleManager';
import { LogWriter } from '../logging/LogWriter';
import { Character } from '../characters/Character';
import { CharacterBuilder, CharacterType } from '../builders/CharacterBuilder';

// Тесты для класса BattleManager
describe('BattleManager', () => {
  let logWriter: LogWriter;
  let mockRandom: jest.Mock;

  beforeEach(() => {
    logWriter = new LogWriter(false);
    mockRandom = jest.fn();
  });

  describe('initializeGame', () => {
    test('должен инициализировать игру с четным количеством персонажей', () => {
      mockRandom.mockReturnValue(0.5);
      
      const battleManager = new BattleManager(logWriter, mockRandom);
      
      battleManager.initializeGame(4);
      
      expect(battleManager.getAliveCharactersCount()).toBe(4);
    });

    test('должен выбрасывать ошибку для нечетного количества персонажей', () => {
      const battleManager = new BattleManager(logWriter, mockRandom);
      
      expect(() => {
        battleManager.initializeGame(3);
      }).toThrow('Количество персонажей должно быть четным');
    });

    test('должен выбрасывать ошибку для количества меньше 2', () => {
      const battleManager = new BattleManager(logWriter, mockRandom);
      
      expect(() => {
        battleManager.initializeGame(0);
      }).toThrow('Количество персонажей должно быть не менее 2');
    });
  });

  describe('startGame', () => {
    test('должен выбрасывать ошибку, если игра не инициализирована', () => {
      const battleManager = new BattleManager(logWriter, mockRandom);
      
      expect(() => {
        battleManager.startGame();
      }).toThrow('Игра не инициализирована');
    });

    test('должен определять победителя для 2 персонажей', () => {
      mockRandom
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.9);

      const battleManager = new BattleManager(logWriter, mockRandom);
      battleManager.initializeGame(2);

      const winner = battleManager.startGame();

      expect(winner).toBeDefined();
      expect(winner.isAlive()).toBe(true);
    });

    test('должен проводить несколько раундов для 4 персонажей', () => {
      mockRandom.mockReturnValue(0.5);

      const battleManager = new BattleManager(logWriter, mockRandom);
      battleManager.initializeGame(4);

      const winner = battleManager.startGame();

      expect(winner).toBeDefined();
      expect(winner.isAlive()).toBe(true);
      expect(battleManager.getRoundNumber()).toBeGreaterThan(0);
    });
  });

  describe('getAliveCharactersCount', () => {
    test('должен возвращать правильное количество живых персонажей', () => {
      mockRandom.mockReturnValue(0.5);
      
      const battleManager = new BattleManager(logWriter, mockRandom);
      battleManager.initializeGame(4);
      
      expect(battleManager.getAliveCharactersCount()).toBe(4);
    });
  });

  describe('getRoundNumber', () => {
    test('должен возвращать 0 до начала игры', () => {
      mockRandom.mockReturnValue(0.5);
      
      const battleManager = new BattleManager(logWriter, mockRandom);
      battleManager.initializeGame(2);
      
      expect(battleManager.getRoundNumber()).toBe(0);
    });

    test('должен возвращать правильный номер раунда после начала игры', () => {
      mockRandom.mockReturnValue(0.5);
      
      const battleManager = new BattleManager(logWriter, mockRandom);
      battleManager.initializeGame(2);
      battleManager.startGame();
      
      expect(battleManager.getRoundNumber()).toBeGreaterThan(0);
    });
  });
});

