import { BaseFighter } from './BaseFighter';

// Paladin class - uses retribution strike
export class Paladin extends BaseFighter {
  private abilityExecuted: boolean = false;

  constructor(name: string, health: number, strength: number) {
    super(name, health, strength);
  }

  public getClassType(): string {
    return 'Рыцарь';
  }

  public getAbilityName(): string {
    return 'Удар возмездия';
  }

  public canExecuteAbility(): boolean {
    return !this.abilityExecuted;
  }

  public executeAbility(target: BaseFighter): number {
    if (!this.canExecuteAbility()) {
      return this.performAttack(target);
    }

    this.abilityExecuted = true;

    const baseDamage = this.strength;
    const extraDamage = Math.floor(baseDamage * 0.3);
    const totalDamage = baseDamage + extraDamage;

    target.sufferDamage(totalDamage);

    return totalDamage;
  }

  public resetForNewBattle(): void {
    super.resetForNewBattle();
    this.abilityExecuted = false;
  }
}

