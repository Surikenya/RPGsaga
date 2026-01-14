import { BaseFighter } from '../fighters/BaseFighter';
import { Paladin } from '../fighters/Paladin';
import { Ranger } from '../fighters/Ranger';
import { Sorcerer } from '../fighters/Sorcerer';

// Fighter types
export enum FighterType {
  PALADIN = 'PALADIN',
  RANGER = 'RANGER',
  SORCERER = 'SORCERER'
}

// Fighter parameters
export interface FighterParams {
  name: string;
  health: number;
  strength: number;
}

// Generator for creating fighters
export class FighterGenerator {
  private static readonly NAME_LIST: string[] = [
    'Артур', 'Вильямс', 'Ланселот', 'Гавейн', 'Галахад', 'Персиваль',
    'Эльдар', 'Леголас', 'Робин', 'Гарольд', 'Аларик', 'Теоден',
    'Гэндальф', 'Мерлин', 'Гарри', 'Гермиона', 'Дамблдор', 'Волан-де-Морт'
  ];

  private static readonly HP_MIN: number = 50;
  private static readonly HP_MAX: number = 150;
  private static readonly DMG_MIN: number = 5;
  private static readonly DMG_MAX: number = 50;

  public static generateFighter(type: FighterType, params: FighterParams): BaseFighter {
    switch (type) {
      case FighterType.PALADIN:
        return new Paladin(params.name, params.health, params.strength);
      
      case FighterType.RANGER:
        return new Ranger(params.name, params.health, params.strength);
      
      case FighterType.SORCERER:
        return new Sorcerer(params.name, params.health, params.strength);
      
      default:
        throw new Error(`Неизвестный тип бойца: ${type}`);
    }
  }

  public static generateRandomFighter(
    type: FighterType,
    randomGen: () => number = Math.random
  ): BaseFighter {
    const params = this.createRandomParams(randomGen);
    return this.generateFighter(type, params);
  }

  public static generateRandomFighters(
    count: number,
    randomGen: () => number = Math.random
  ): BaseFighter[] {
    const fighters: BaseFighter[] = [];
    const availableTypes = [FighterType.PALADIN, FighterType.RANGER, FighterType.SORCERER];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(randomGen() * availableTypes.length);
      const selectedType = availableTypes[randomIndex];

      const fighter = this.generateRandomFighter(selectedType, randomGen);
      fighters.push(fighter);
    }

    return fighters;
  }

  private static createRandomParams(randomGen: () => number = Math.random): FighterParams {
    const nameIndex = Math.floor(randomGen() * this.NAME_LIST.length);
    const name = this.NAME_LIST[nameIndex];

    const health = Math.floor(
      this.HP_MIN + randomGen() * (this.HP_MAX - this.HP_MIN + 1)
    );

    const strength = Math.floor(
      this.DMG_MIN + randomGen() * (this.DMG_MAX - this.DMG_MIN + 1)
    );

    return { name, health, strength };
  }

  public static getAvailableNames(): string[] {
    return [...this.NAME_LIST];
  }

  public static getRandomName(randomGen: () => number = Math.random): string {
    const index = Math.floor(randomGen() * this.NAME_LIST.length);
    return this.NAME_LIST[index];
  }
}

