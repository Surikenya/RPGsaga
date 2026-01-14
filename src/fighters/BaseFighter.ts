import { StatusEffect, StatusType, IStatusEffect } from '../status/StatusEffect';

// Base class for all fighters in the game
export abstract class BaseFighter {
  private _hp: number;
  private _maxHp: number;
  private _damage: number;
  private _name: string;
  
  protected statusEffects: StatusEffect[] = [];

  constructor(name: string, hp: number, damage: number) {
    this._name = name;
    this._hp = hp;
    this._maxHp = hp;
    this._damage = damage;
  }

  // Getters
  public get name(): string {
    return this._name;
  }

  public get health(): number {
    return this._hp;
  }

  public get maxHealth(): number {
    return this._maxHp;
  }

  public get strength(): number {
    return this._damage;
  }

  // Check if fighter is alive
  public isAlive(): boolean {
    return this._hp > 0;
  }

  // Abstract methods - must be implemented by subclasses
  public abstract getClassType(): string;
  public abstract getAbilityName(): string;
  public abstract executeAbility(target: BaseFighter): number;
  public abstract canExecuteAbility(): boolean;

  // Basic attack
  public performAttack(target: BaseFighter): number {
    const attackDamage = this._damage;
    target.sufferDamage(attackDamage);
    return attackDamage;
  }

  // Receive damage
  public sufferDamage(amount: number): number {
    // Check for stun effect (skip damage)
    if (this.hasStatus(StatusType.STUN)) {
      this.removeStatus(StatusType.STUN);
      return 0;
    }

    const finalDamage = Math.max(0, amount);
    this._hp = Math.max(0, this._hp - finalDamage);
    return finalDamage;
  }

  // Add status effect
  public applyStatus(effect: StatusEffect): void {
    // Special handling for freeze effects (stacking)
    if (effect.statusType === StatusType.FREEZE) {
      const existingFreeze = this.statusEffects.find(e => e.statusType === StatusType.FREEZE && e.isActive);
      if (existingFreeze) {
        existingFreeze.incrementDamage(effect.damagePerTurn);
        existingFreeze.setMaximumDuration(effect.remainingTurns);
        return;
      }
    }
    
    this.statusEffects.push(effect);
  }

  // Check if fighter has specific status
  public hasStatus(statusType: StatusType): boolean {
    return this.statusEffects.some(e => e.statusType === statusType && e.isActive);
  }

  // Remove status effect
  public removeStatus(statusType: StatusType): void {
    const index = this.statusEffects.findIndex(e => e.statusType === statusType && e.isActive);
    if (index !== -1) {
      this.statusEffects[index].deactivate();
      this.statusEffects.splice(index, 1);
    }
  }

  // Remove all status effects
  public clearAllStatuses(): void {
    this.statusEffects.forEach(e => e.deactivate());
    this.statusEffects = [];
  }

  // Process status effects at turn start
  public processStatusEffects(): number {
    let accumulatedDamage = 0;
    
    for (const effect of this.statusEffects) {
      if (effect.isActive) {
        const effectDamage = effect.calculateDamage();
        accumulatedDamage += effectDamage;
        
        effect.decrementTurns();
        
        if (effect.remainingTurns <= 0) {
          effect.deactivate();
        }
      }
    }

    // Remove inactive effects
    this.statusEffects = this.statusEffects.filter(e => e.isActive);

    // Apply accumulated damage
    if (accumulatedDamage > 0) {
      this._hp = Math.max(0, this._hp - accumulatedDamage);
    }

    return accumulatedDamage;
  }

  // Restore health
  public restoreHealth(amount: number): void {
    this._hp = Math.min(this._maxHp, this._hp + amount);
  }

  // Get fighter info string
  public getInfo(): string {
    return `(${this.getClassType()}) ${this.name}`;
  }

  // Reset fighter state for new battle
  public resetForNewBattle(): void {
    this.statusEffects = [];
  }
}

