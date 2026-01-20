import { StatusEffect, StatusType } from '../status/StatusEffect';

// Базовый класс для всех персов игры
export abstract class BaseFighter {
  private _hp: number;
  private _maxHp: number;
  private _damage: number;
  private _name: string;

  protected statusEffects: StatusEffect[] = [];
  private iceArrowsUsedCount: number = 0;

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
    const finalDamage = Math.max(0, amount);
    this._hp = Math.max(0, this._hp - finalDamage);
    return finalDamage;
  }

  //Лимит ледяных стрел на бой
  protected get maxIceArrowsPerBattle(): number {
    return 1;
  }

  //Можно ли использовать ледяные стрелы сейчас
  public canUseIceArrows(): boolean {
    return this.iceArrowsUsedCount < this.maxIceArrowsPerBattle;
  }

  // Использование ледяных стрел:
  public useIceArrows(target: BaseFighter): number {
    if (!this.canUseIceArrows()) {
      return this.performAttack(target);
    }

    this.iceArrowsUsedCount++;

    const directDamage = this.strength;
    target.sufferDamage(directDamage);

    const extraDamagePerTurn = 2;

    const freezeEffect = new StatusEffect(StatusType.FREEZE, 3, extraDamagePerTurn);
    target.applyStatus(freezeEffect);

    return directDamage;
  }

  // Добавление статуса, что перс под эффектом
  public applyStatus(effect: StatusEffect): void {
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
        if (effect.statusType === StatusType.STUN) {
          continue;
        }

        const effectDamage = effect.calculateDamage();
        accumulatedDamage += effectDamage;

        effect.decrementTurns();

        if (effect.remainingTurns <= 0) {
          effect.deactivate();
        }
      }
    }

    this.statusEffects = this.statusEffects.filter(function (e) {
      return e.isActive;
    });

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
    this.iceArrowsUsedCount = 0;
  }
}
