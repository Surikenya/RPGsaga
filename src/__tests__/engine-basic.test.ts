import { EventRecorder } from '../recording/EventRecorder';
import { GameEngine } from '../engine/GameEngine';

test('Игровой движок проводит турнир и возвращает победителя', function () {
  const recorder = new EventRecorder(false);

  const engine = new GameEngine(recorder, function () {
    return 0.5;
  });

  engine.initializeTournament(4);
  const winner = engine.runTournament();

  expect(winner).toBeDefined();
  expect(winner.isAlive()).toBe(true);
});
