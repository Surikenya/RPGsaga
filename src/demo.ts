import { GameEngine } from './engine/GameEngine';
import { EventRecorder } from './recording/EventRecorder';

// Demo mode - automated tournament
function runDemo(): void {
  console.log('═══════════════════════════════════════');
  console.log('    🎮 Akvelon RPG SAGA - DEMO 🎮');
  console.log('═══════════════════════════════════════\n');

  const recorder = new EventRecorder(false);

  const engine = new GameEngine(recorder);

  try {
    const fighterCount = 4;
    console.log(`Запуск игры с ${fighterCount} персонажами...\n`);
    
    engine.initializeTournament(fighterCount);

    console.log('Начинаем турнир...\n');

    const winner = engine.runTournament();

    console.log(`\n🎉 Турнир завершен!`);
    console.log(`🏆 Победитель: ${winner.getInfo()}`);
    console.log(`❤️  Здоровье победителя: ${winner.health}/${winner.maxHealth}`);
    console.log(`⚔️  Сила победителя: ${winner.strength}`);

  } catch (error) {
    console.error('Произошла ошибка:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (require.main === module) {
  runDemo();
}

export { runDemo };
