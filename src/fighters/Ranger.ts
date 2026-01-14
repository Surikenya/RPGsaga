import { BaseFighter } from './BaseFighter';
import { StatusEffect, StatusType } from '../status/StatusEffect';

// Ranger class - uses fire and ice arrows
export class Ranger extends BaseFighter {
  private fireArrowsUsed: boolean = false;
  private iceArrowsCount: number = 0;
  private readonly maxIceArrows: number = 2;

  constructor(name: string, health: number, strength: number) {
    super(name, health, strength);
  }

  public getClassType(): string {
    return 'Лучник';
  }

  public getAbilityName(): string {
    if (!this.fireArrowsUsed) {
      return 'Огненные стрелы';
    }
    if (this.iceArrowsCount < this.maxIceArrows) {
      return 'Ледяные стрелы';
    }
    return 'Огненные стрелы';
  }

  public canExecuteAbility(): boolean {
    return !this.fireArrowsUsed || this.iceArrowsCount < this.maxIceArrows;
  }

  public executeAbility(target: BaseFighter): number {
    if (!this.fireArrowsUsed) {
      return this.shootFireArrows(target);
    }

    if (this.iceArrowsCount < this.maxIceArrows) {
      return this.shootIceArrows(target);
    }

    return this.performAttack(target);
  }

  private shootFireArrows(target: BaseFighter): number {
    this.fireArrowsUsed = true;

    const burnEffect = new StatusEffect(StatusType.BURN, 100, 2);
    target.applyStatus(burnEffect);

    return 0;
  }

  private shootIceArrows(target: BaseFighter): number {
    this.iceArrowsCount++;

    const directDamage = this.strength;
    target.sufferDamage(directDamage);

    const iceDamagePerTurn = Math.floor(this.strength / 2);
    const freezeEffect = new StatusEffect(StatusType.FREEZE, 3, iceDamagePerTurn);
    target.applyStatus(freezeEffect);

    return directDamage;
  }

  public resetForNewBattle(): void {
    super.resetForNewBattle();
    this.fireArrowsUsed = false;
    this.iceArrowsCount = 0;
  }

  public getAbilityStatus(): { fireArrowsUsed: boolean; iceArrowsCount: number; maxIceArrows: number } {
    return {
      fireArrowsUsed: this.fireArrowsUsed,
      iceArrowsCount: this.iceArrowsCount,
      maxIceArrows: this.maxIceArrows
    };
  }
}

