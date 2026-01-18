import { assignCall, chooseElevator, estimateETA, SimulationOptions, SimulationState } from '../index';

const opts: SimulationOptions = {
  msPerFloor: 1000,
  doorOpenMs: 1000
};

const baseState: SimulationState = {
  nowMs: 0,
  buildings: {
    tower: {
      id: 'tower',
      floorsCount: 10,
      elevators: [
        {
          id: 'tower-e1',
          currentFloor: 2,
          status: 'moving',
          direction: 1,
          stopQueue: [7],
          doorRemainingMs: 0,
          progressMs: 0
        },
        {
          id: 'tower-e2',
          currentFloor: 4,
          status: 'idle',
          direction: 0,
          stopQueue: [],
          doorRemainingMs: 0,
          progressMs: 0
        }
      ]
    }
  }
};

test('assignCall chooses the fastest elevator when another is busy', () => {
  const next = assignCall(
    baseState,
    { id: 'call-1', buildingId: 'tower', floor: 5, createdAt: 0 },
    opts
  );
  const elevator1 = next.buildings.tower.elevators.find((e) => e.id === 'tower-e1');
  const elevator2 = next.buildings.tower.elevators.find((e) => e.id === 'tower-e2');

  expect(elevator1?.stopQueue).toEqual([7]);
  expect(elevator2?.stopQueue).toEqual([5]);
});

test('chooseElevator prefers the closer idle elevator', () => {
  const state: SimulationState = {
    ...baseState,
    buildings: {
      tower: {
        ...baseState.buildings.tower,
        elevators: [
          {
            id: 'tower-e1',
            currentFloor: 7,
            status: 'idle',
            direction: 0,
            stopQueue: [],
            doorRemainingMs: 0,
            progressMs: 0
          },
          {
            id: 'tower-e2',
            currentFloor: 2,
            status: 'idle',
            direction: 0,
            stopQueue: [],
            doorRemainingMs: 0,
            progressMs: 0
          }
        ]
      }
    }
  };

  const building = state.buildings.tower;
  const chosen = chooseElevator(building, 5, opts);

  expect(chosen).toBe('tower-e1');
  expect(estimateETA(building.elevators[0], 5, opts)).toBeLessThan(
    estimateETA(building.elevators[1], 5, opts)
  );
});
