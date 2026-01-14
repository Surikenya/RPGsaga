import { GameEngine } from './engine/GameEngine';
import { EventRecorder } from './recording/EventRecorder';
import * as readline from 'readline';

// Main entry point for the game
function getUserInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main(): Promise<void> {
  console.log('═══════════════════════════════════════');
  console.log('    🎮 Akvelon RPG SAGA 🎮');
  console.log('═══════════════════════════════════════\n');

  try {
    const input = await getUserInput('Введите количество персонажей (четное число, минимум 2): ');
    const fighterCount = parseInt(input, 10);

    if (isNaN(fighterCount) || fighterCount < 2 || fighterCount % 2 !== 0) {
      console.error('Ошибка: Количество персонажей должно быть четным числом, не менее 2.');
      process.exit(1);
    }

    const logFileInput = await getUserInput('Логировать в файл? (y/n, по умолчанию n): ');
    const saveToFile = logFileInput.toLowerCase() === 'y' || logFileInput.toLowerCase() === 'yes';

    const recorder = new EventRecorder(saveToFile);

    const engine = new GameEngine(recorder);

    engine.initializeTournament(fighterCount);

    console.log('\nНачинаем игру...\n');

    const winner = engine.runTournament();

    console.log(`\nИгра завершена! Победитель: ${winner.getInfo()}`);
    
    if (saveToFile) {
      console.log('\nЛоги сохранены в файл game_log.txt');
    }

  } catch (error) {
    console.error('Произошла ошибка:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Критическая ошибка:', error);
    process.exit(1);
  });
}

export { main };
