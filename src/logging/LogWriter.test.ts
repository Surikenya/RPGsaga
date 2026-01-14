import { LogWriter } from './LogWriter';
import * as fs from 'fs';
import * as path from 'path';
import { Character } from '../characters/Character';
import { Warrior } from '../characters/Warrior';

// Тесты для класса LogWriter
describe('LogWriter', () => {
  let logWriter: LogWriter;
  const testLogPath = path.join(__dirname, 'test_log.txt');

  afterEach(() => {
    if (fs.existsSync(testLogPath)) {
      fs.unlinkSync(testLogPath);
    }
  });

  describe('Конструктор', () => {
    test('должен создавать логгер без записи в файл', () => {
      logWriter = new LogWriter(false);
      expect(logWriter).toBeDefined();
    });

    test('должен создавать логгер с записью в файл', () => {
      logWriter = new LogWriter(true, testLogPath);
      expect(logWriter).toBeDefined();
    });
  });

  describe('log', () => {
    test('должен добавлять сообщение в лог', () => {
      logWriter = new LogWriter(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      logWriter.log('Тестовое сообщение');

      expect(consoleSpy).toHaveBeenCalledWith('Тестовое сообщение');
      
      consoleSpy.mockRestore();
    });

    test('должен записывать в файл, если включена запись в файл', () => {
      logWriter = new LogWriter(true, testLogPath);
      
      logWriter.log('Тестовое сообщение');

      expect(fs.existsSync(testLogPath)).toBe(true);
      const content = fs.readFileSync(testLogPath, 'utf8');
      expect(content).toContain('Тестовое сообщение');
    });
  });

  describe('logRound', () => {
    test('должен логировать начало раунда', () => {
      logWriter = new LogWriter(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      logWriter.logRound(1);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Кон 1'));
      
      consoleSpy.mockRestore();
    });
  });

  describe('logBattleStart', () => {
    test('должен логировать начало боя', () => {
      logWriter = new LogWriter(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const char1 = new Warrior('Персонаж1', 100, 10);
      const char2 = new Warrior('Персонаж2', 100, 10);

      logWriter.logBattleStart(char1, char2);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Персонаж1')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Персонаж2')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('logAttack', () => {
    test('должен логировать атаку', () => {
      logWriter = new LogWriter(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const attacker = new Warrior('Атакующий', 100, 10);
      const target = new Warrior('Цель', 100, 10);

      logWriter.logAttack(attacker, target, 10);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('наносит урон 10')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('logAbility', () => {
    test('должен логировать использование способности с уроном', () => {
      logWriter = new LogWriter(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const character = new Warrior('Рыцарь', 100, 10);
      const target = new Warrior('Цель', 100, 10);

      logWriter.logAbility(character, target, 15);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('использует')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('урон 15')
      );
      
      consoleSpy.mockRestore();
    });

    test('должен логировать использование способности без урона', () => {
      logWriter = new LogWriter(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const character = new Warrior('Рыцарь', 100, 10);
      const target = new Warrior('Цель', 100, 10);

      logWriter.logAbility(character, target, 0);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('использует')
      );
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('урон')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('logDeath', () => {
    test('должен логировать смерть персонажа', () => {
      logWriter = new LogWriter(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const character = new Warrior('Персонаж', 100, 10);

      logWriter.logDeath(character);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('погибает')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('logFinalVictory', () => {
    test('должен логировать финальную победу', () => {
      logWriter = new LogWriter(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const character = new Warrior('Победитель', 100, 10);

      logWriter.logFinalVictory(character);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Победителем турнира')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('getLogs', () => {
    test('должен возвращать все записи лога', () => {
      logWriter = new LogWriter(false);
      
      logWriter.log('Сообщение 1');
      logWriter.log('Сообщение 2');

      const logs = logWriter.getLogs();

      expect(logs.length).toBeGreaterThanOrEqual(2);
      expect(logs.some(log => log.includes('Сообщение 1'))).toBe(true);
      expect(logs.some(log => log.includes('Сообщение 2'))).toBe(true);
    });
  });

  describe('clear', () => {
    test('должен очищать логи', () => {
      logWriter = new LogWriter(false);
      
      logWriter.log('Сообщение');
      logWriter.clear();

      expect(logWriter.getLogs().length).toBe(0);
    });

    test('должен удалять файл логов при очистке', () => {
      logWriter = new LogWriter(true, testLogPath);
      
      logWriter.log('Сообщение');
      expect(fs.existsSync(testLogPath)).toBe(true);
      
      logWriter.clear();
      
      expect(fs.existsSync(testLogPath)).toBe(false);
    });
  });
});

