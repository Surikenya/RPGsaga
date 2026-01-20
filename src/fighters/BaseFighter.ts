import { StatusEffect, StatusType} from '../status/StatusEffect';

// Базовый класс для всех персов игры
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

  // Геттеры
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

  // Проверка жив ли перс
  public isAlive(): boolean {
    return this._hp > 0;
  }

  public abstract getClassType(): string;
  public abstract getAbilityName(): string;
  public abstract executeAbility(target: BaseFighter): number;
  public abstract canExecuteAbility(): boolean;

  // Обычная атака
  public performAttack(target: BaseFighter): number {
    const attackDamage = this._damage;
    target.sufferDamage(attackDamage);
    return attackDamage;
  }

  // Получение дамага
  public sufferDamage(amount: number): number {
    // Проверка на стан
    if (this.hasStatus(StatusType.STUN)) {
      this.removeStatus(StatusType.STUN);
      return 0;
    }

    const finalDamage = Math.max(0, amount);
    this._hp = Math.max(0, this._hp - finalDamage);
    return finalDamage;
  }

  // Добавление статуса, что перс под эффектом
  public applyStatus(effect: StatusEffect): void {
    // Настройка для эффекта фриза
    if (effect.statusType === StatusType.FREEZE) {
      const existingFreeze = this.statusEffects.find(function (e) {
      return e.statusType === StatusType.FREEZE && e.isActive;
    });
      if (existingFreeze) {
        existingFreeze.incrementDamage(effect.damagePerTurn);
        existingFreeze.setMaximumDuration(effect.remainingTurns);
        return;
      }
    }
    
    this.statusEffects.push(effect);
  }

  // Проверка на необычный статус
  public hasStatus(statusType: StatusType): boolean {
    return this.statusEffects.some(function (e) {
      return e.statusType === statusType && e.isActive;
    });
  }

  // Убрать стат эффекта
  public removeStatus(statusType: StatusType): void {
    const index = this.statusEffects.findIndex(function (e) {
      return e.statusType === statusType && e.isActive;
    });
    if (index !== -1) {
      this.statusEffects[index].deactivate();
      this.statusEffects.splice(index, 1);
    }
  }

  // Убрать все статы эффекта
  public clearAllStatuses(): void {
    this.statusEffects.forEach(function (e) {
      e.deactivate();
    });
    this.statusEffects = [];
  }

  // Обработка стата эффекта на старте
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

    // Убрать неактивные статы
    this.statusEffects = this.statusEffects.filter(function (e) {
      return e.isActive;
    });

    // Применение урона
    if (accumulatedDamage > 0) {
      this._hp = Math.max(0, this._hp - accumulatedDamage);
    }

    return accumulatedDamage;
  }

  // Обновление здоровья
  public restoreHealth(amount: number): void {
    this._hp = Math.min(this._maxHp, this._hp + amount);
  }

  // Инфа по бойцу
  public getInfo(): string {
    return `(${this.getClassType()}) ${this.name}`;
  }

  // Обнуление статов бойца перед новой битвой
  public resetForNewBattle(): void {
    this.statusEffects = [];
  }
}

