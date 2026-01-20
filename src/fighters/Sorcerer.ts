import { BaseFighter } from './BaseFighter';
import { StatusEffect, StatusType } from '../status/StatusEffect';

// Класс МАГ. Не чувствует лед
export class Sorcerer extends BaseFighter {
  private readonly iceImmunity: boolean = true;

  constructor(name: string, health: number, strength: number) {
    super(name, health, strength);
  }

  public getClassType(): string {
    return 'Маг';
  }

  public getAbilityName(): string {
    return 'Заворожение';
  }

  public canExecuteAbility(): boolean {
    return true;
  }

  public executeAbility(target: BaseFighter): number {
    const stunEffect = new StatusEffect(StatusType.STUN, 1, 0);
    target.applyStatus(stunEffect);

    return 0;
  }

  public applyStatus(effect: StatusEffect): void {
    if (this.iceImmunity && effect.statusType === StatusType.FREEZE) {
      return;
    }

    super.applyStatus(effect);
  }

  public healAndRemoveEffects(): void {
    this.clearAllStatuses();
  }

  public resetForNewBattle(): void {
    super.resetForNewBattle();
  }
}

