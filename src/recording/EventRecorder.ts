import * as fs from 'fs';
import * as path from 'path';

// Event recorder for game events
export class EventRecorder {
  private events: string[] = [];
  private readonly saveToFile: boolean;
  private readonly filePath: string;

  constructor(saveToFile: boolean = false, filePath?: string) {
    this.saveToFile = saveToFile;
    
    if (saveToFile) {
      this.filePath = filePath || path.join(process.cwd(), 'game_log.txt');
      
      if (fs.existsSync(this.filePath)) {
        fs.unlinkSync(this.filePath);
      }
    } else {
      this.filePath = '';
    }
  }

  public record(message: string): void {
    const time = new Date().toISOString();
    const eventMessage = `[${time}] ${message}`;
    
    this.events.push(eventMessage);
    
    console.log(message);
    
    if (this.saveToFile && this.filePath) {
      try {
        fs.appendFileSync(this.filePath, eventMessage + '\n', 'utf8');
      } catch (error) {
        console.error(`Ошибка записи в файл логов: ${error}`);
      }
    }
  }

  public recordRound(roundNum: number): void {
    this.record(`\nКон ${roundNum}.\n`);
  }

  public recordBattleStart(fighter1: { getInfo(): string }, fighter2: { getInfo(): string }): void {
    this.record(`${fighter1.getInfo()} vs ${fighter2.getInfo()}`);
  }

  public recordAttack(
    attacker: { getInfo(): string },
    defender: { getInfo(): string },
    damage: number
  ): void {
    this.record(`${attacker.getInfo()} наносит урон ${damage} противнику ${defender.getInfo()}`);
  }

  public recordAbility(
    fighter: { getInfo(): string; getAbilityName(): string },
    target: { getInfo(): string },
    damage: number
  ): void {
    if (damage > 0) {
      this.record(
        `${fighter.getInfo()} использует (${fighter.getAbilityName()}) и наносит урон ${damage} противнику ${target.getInfo()}`
      );
    } else {
      this.record(
        `${fighter.getInfo()} использует (${fighter.getAbilityName()}) на противника ${target.getInfo()}`
      );
    }
  }

  public recordEffect(
    fighter: { getInfo(): string },
    effectDesc: string,
    damage: number
  ): void {
    if (damage > 0) {
      this.record(`${fighter.getInfo()} получает ${damage} урона от эффекта "${effectDesc}"`);
    } else {
      this.record(`${fighter.getInfo()} подвергается эффекту "${effectDesc}"`);
    }
  }

  public recordDeath(fighter: { getInfo(): string }): void {
    this.record(`${fighter.getInfo()} погибает\n`);
  }

  public recordSkipTurn(fighter: { getInfo(): string }, reason: string): void {
    this.record(`${fighter.getInfo()} пропускает ход: ${reason}`);
  }

  public recordVictory(fighter: { getInfo(): string }, roundNum: number): void {
    this.record(`\n${fighter.getInfo()} побеждает в раунде ${roundNum}!`);
  }

  public recordFinalVictory(fighter: { getInfo(): string }): void {
    this.record(`\n═══════════════════════════════════════`);
    this.record(`🏆 ${fighter.getInfo()} становится Победителем турнира! 🏆`);
    this.record(`═══════════════════════════════════════\n`);
  }

  public getAllEvents(): string[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
    if (this.saveToFile && this.filePath && fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
    }
  }
}

