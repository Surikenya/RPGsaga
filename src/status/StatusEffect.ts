// Status effect types
export enum StatusType {
  BURN = 'BURN',              // Fire damage (2 per turn)
  FREEZE = 'FREEZE',          // Ice damage (damage over multiple turns)
  STUN = 'STUN',              // Skip turn (stun effect)
  RETALIATION = 'RETALIATION' // Retaliation strike (bonus damage)
}

// Status effect interface
export interface IStatusEffect {
  statusType: StatusType;
  remainingTurns: number;
  damagePerTurn?: number;
  isActive: boolean;
}

// Status effect implementation
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

  // Increase damage per turn (for stacking effects)
  public incrementDamage(amount: number): void {
    this._damagePerTurn += amount;
  }

  // Set maximum duration (for stacking effects)
  public setMaximumDuration(turns: number): void {
    this._remainingTurns = Math.max(this._remainingTurns, turns);
  }

  // Decrease duration by 1
  public decrementTurns(): void {
    this._remainingTurns -= 1;
  }

  // Deactivate effect
  public deactivate(): void {
    this._isActive = false;
  }

  // Check if effect is still active
  public isStillActive(): boolean {
    if (this._remainingTurns > 0) {
      return true;
    }
    this._isActive = false;
    return false;
  }

  // Calculate and return damage for this turn
  public calculateDamage(): number {
    if (!this._isActive || this._remainingTurns <= 0) {
      return 0;
    }
    return this._damagePerTurn || 0;
  }

  // Create a copy of this effect
  public duplicate(): StatusEffect {
    return new StatusEffect(this.statusType, this._remainingTurns, this._damagePerTurn, this._isActive);
  }
}

