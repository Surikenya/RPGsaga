import { BaseFighter } from '../fighters/BaseFighter';
import { FighterGenerator} from '../generators/FighterGenerator';
import { EventRecorder } from '../recording/EventRecorder';
import { StatusType } from '../status/StatusEffect';

// Сам движок, запускает турнир
export class GameEngine {
  private fighters: BaseFighter[] = [];
  private readonly recorder: EventRecorder;
  private roundIndex: number = 0;
  private readonly abilityProbability: number = 0.5;
  private readonly rng: () => number;

  constructor(recorder: EventRecorder, rng: () => number = Math.random) {
    this.recorder = recorder;
    this.rng = rng;
  }

  public initializeTournament(fighterCount: number): void {
    if (fighterCount % 2 !== 0) {
      throw new Error('Количество персонажей должно быть четным');
    }

    if (fighterCount < 2) {
      throw new Error('Количество персонажей должно быть не менее 2');
    }

    this.fighters = FighterGenerator.generateRandomFighters(fighterCount, this.rng);
    
    this.recorder.record(`Игра началась! Создано ${fighterCount} персонажей.`);
  }

  public runTournament(): BaseFighter {
    if (this.fighters.length === 0) {
      throw new Error('Игра не инициализирована. Вызовите initializeTournament() сначала.');
    }

    while (this.fighters.length > 1) {
      this.roundIndex++;
      this.recorder.recordRound(this.roundIndex);

      this.processRound();

      this.fighters = this.fighters.filter(f => f.isAlive());

      this.fighters.forEach(f => f.resetForNewBattle());
    }

    const champion = this.fighters[0];
    this.recorder.recordFinalVictory(champion);

    return champion;
  }

  private processRound(): void {
    const mixedFighters = this.randomizeArray([...this.fighters]);

    const battlePairs: [BaseFighter, BaseFighter][] = [];
    for (let i = 0; i < mixedFighters.length; i += 2) {
      battlePairs.push([mixedFighters[i], mixedFighters[i + 1]]);
    }

    for (const [fighter1, fighter2] of battlePairs) {
      this.runBattle(fighter1, fighter2);
    }
  }

  private runBattle(fighter1: BaseFighter, fighter2: BaseFighter): void {
    this.recorder.recordBattleStart(fighter1, fighter2);

    let activeFighter = this.rng() < 0.5 ? fighter1 : fighter2;
    let passiveFighter = activeFighter === fighter1 ? fighter2 : fighter1;

    while (fighter1.isAlive() && fighter2.isAlive()) {
      this.handleStatusEffects(fighter1);
      this.handleStatusEffects(fighter2);

      if (!passiveFighter.isAlive()) {
        break;
      }

      if (!activeFighter.isAlive()) {
        [activeFighter, passiveFighter] = [passiveFighter, activeFighter];
        continue;
      }

      const shouldUseSpecial = this.checkAbilityUsage(activeFighter);

      let damageOutput: number;

      if (shouldUseSpecial && activeFighter.canExecuteAbility()) {
        damageOutput = activeFighter.executeAbility(passiveFighter);
        this.recorder.recordAbility(activeFighter, passiveFighter, damageOutput);
      } else {
        damageOutput = activeFighter.performAttack(passiveFighter);
        this.recorder.recordAttack(activeFighter, passiveFighter, damageOutput);
      }

      if (!passiveFighter.isAlive()) {
        this.recorder.recordDeath(passiveFighter);
        break;
      }

      [activeFighter, passiveFighter] = [passiveFighter, activeFighter];
    }

    const winner = fighter1.isAlive() ? fighter1 : fighter2;
    this.recorder.recordVictory(winner, this.roundIndex);
  }

  private checkAbilityUsage(fighter: BaseFighter): boolean {
    if (!fighter.canExecuteAbility()) {
      return false;
    }

    return this.rng() < this.abilityProbability;
  }

  private handleStatusEffects(fighter: BaseFighter): void {
    const statusDamage = fighter.processStatusEffects();
    
    if (statusDamage > 0) {
      let effectText = '';
      if (fighter.hasStatus(StatusType.BURN)) {
        effectText = 'горение';
      } else if (fighter.hasStatus(StatusType.FREEZE)) {
        effectText = 'ледяной урон';
      }

      if (effectText) {
        this.recorder.recordEffect(fighter, effectText, statusDamage);
      }

      if (!fighter.isAlive()) {
        this.recorder.recordDeath(fighter);
      }
    }
  }

  private randomizeArray<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  public getAliveCount(): number {
    return this.fighters.filter(f => f.isAlive()).length;
  }

  public getCurrentRound(): number {
    return this.roundIndex;
  }
}

