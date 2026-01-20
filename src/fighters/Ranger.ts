import { BaseFighter } from './BaseFighter';
import { StatusEffect, StatusType } from '../status/StatusEffect';

export class Ranger extends BaseFighter {
  private fireArrowsUsed: boolean = false;

  protected get maxIceArrowsPerBattle(): number {
    return 2;
  }

  constructor(name: string, health: number, strength: number) {
    super(name, health, strength);
  }

  public getClassType(): string {
    return 'Лучник';
  }

  public getAbilityName(): string {
    return 'Огненные стрелы';
  }

  public canExecuteAbility(): boolean {
    return !this.fireArrowsUsed;
  }

  public executeAbility(target: BaseFighter): number {
    return this.shootFireArrows(target);
  }

  private shootFireArrows(target: BaseFighter): number {
    this.fireArrowsUsed = true;

    const burnEffect = new StatusEffect(StatusType.BURN, 100, 2);
    target.applyStatus(burnEffect);

    return 0;
  }

  public resetForNewBattle(): void {
    super.resetForNewBattle();
    this.fireArrowsUsed = false;
  }
}
