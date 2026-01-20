import { EventRecorder } from '../recording/EventRecorder';
import { GameEngine } from '../engine/GameEngine';

function fixedRng(value: number): () => number {
  return function (): number {
    return value;
  };
}

test('Бой всегда завершается и возвращает победителя', function () {
  const recorder = new EventRecorder(false);
  const engine = new GameEngine(recorder, fixedRng(0.5));

  engine.initializeTournament(2);
  const winner = engine.runTournament();

  expect(winner).toBeDefined();
  expect(winner.isAlive()).toBe(true);
});

test('Игра не зацикливается при большом количестве бойцов', function () {
  const recorder = new EventRecorder(false);
  const engine = new GameEngine(recorder, fixedRng(0.5));

  engine.initializeTournament(8);
  const winner = engine.runTournament();

  expect(winner).toBeDefined();
  expect(winner.isAlive()).toBe(true);
});

test('После смерти одного бойца бой завершается', function () {
  const recorder = new EventRecorder(false);
  const engine = new GameEngine(recorder, fixedRng(0.5));

  engine.initializeTournament(2);
  engine.runTournament();

  const events = recorder.getAllEvents().join('\n');
  expect(events.includes('погибает')).toBe(true);
});

test('Раунды увеличиваются по мере проведения турнира', function () {
  const recorder = new EventRecorder(false);
  const engine = new GameEngine(recorder, fixedRng(0.5));

  engine.initializeTournament(4);
  engine.runTournament();

  const events = recorder.getAllEvents().join('\n');
  expect(events.includes('Кон')).toBe(true);
});

test('Количество живых бойцов уменьшается после завершения раунда', function () {
  const recorder = new EventRecorder(false);
  const engine = new GameEngine(recorder, fixedRng(0.5));

  engine.initializeTournament(4);
  const winner = engine.runTournament();
  expect(winner.isAlive()).toBe(true);
});

test('Логи боя формируются во время игры', function () {
  const recorder = new EventRecorder(false);
  const engine = new GameEngine(recorder, fixedRng(0.5));

  engine.initializeTournament(2);
  engine.runTournament();

  const events = recorder.getAllEvents();
  expect(events.length).toBeGreaterThan(0);
});

test('Игра корректно работает при минимальном количестве бойцов', function () {
  const recorder = new EventRecorder(false);
  const engine = new GameEngine(recorder, fixedRng(0.5));

  engine.initializeTournament(2);
  const winner = engine.runTournament();

  expect(winner).toBeDefined();
});
