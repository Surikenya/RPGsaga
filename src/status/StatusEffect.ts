// Перечисление типов эффектов
export enum StatusType {
  BURN = 'BURN',              // Поджог (2 за ход)
  FREEZE = 'FREEZE',          // Лед (урон за умножение)
  STUN = 'STUN',              // пропуск хода (стан)
  RETALIATION = 'RETALIATION' // удар возмездия (удар идет бонусом)
}

export interface IStatusEffect {
  statusType: StatusType;
  remainingTurns: number;
  damagePerTurn?: number;
  isActive: boolean;
}

export class StatusEffect {
  private _remainingTurns: number;
  private _damagePerTurn: number;
  private _isActive: boolean;

  constructor(
    public readonly statusType: StatusType,
    remainingTurns: number,
    damagePerTurn: number = 0,
    isActive: boolean = true
  ) {
    this._remainingTurns = remainingTurns;
    this._damagePerTurn = damagePerTurn;
    this._isActive = isActive;
  }

  public get remainingTurns(): number {
    return this._remainingTurns;
  }

  public get damagePerTurn(): number {
    return this._damagePerTurn;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  // Урон стакается
  public incrementDamage(amount: number): void {
    this._damagePerTurn += amount;
  }

  // Установить длительность (для тех, что стакаются)
  public setMaximumDuration(turns: number): void {
    this._remainingTurns = Math.max(this._remainingTurns, turns);
  }

  // Уменьшение длительности
  public decrementTurns(): void {
    this._remainingTurns -= 1;
  }

  // Отключение
  public deactivate(): void {
    this._isActive = false;
  }

  // Проверка на включенность
  public isStillActive(): boolean {
    if (this._remainingTurns > 0) {
      return true;
    }
    this._isActive = false;
    return false;
  }

  // Подсчет урона
  public calculateDamage(): number {
    if (!this._isActive || this._remainingTurns <= 0) {
      return 0;
    }
    return this._damagePerTurn || 0;
  }

  // Копировать эффект, но создать новый его обьект
  public duplicate(): StatusEffect {
    return new StatusEffect(this.statusType, this._remainingTurns, this._damagePerTurn, this._isActive);
  }
}

