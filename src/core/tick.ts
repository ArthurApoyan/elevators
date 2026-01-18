import { BuildingState, ElevatorState, SimulationOptions, SimulationState } from './types';

const directionTo = (from: number, to: number): -1 | 0 | 1 => {
  if (to > from) return 1;
  if (to < from) return -1;
  return 0;
};

const clampFloor = (floor: number, maxFloor: number) => {
  if (floor < 1) return 1;
  if (floor > maxFloor) return maxFloor;
  return floor;
};

const tickElevator = (
  elevator: ElevatorState,
  floorsCount: number,
  dtMs: number,
  opts: SimulationOptions
): ElevatorState => {
  if (elevator.status === 'doorsOpen') {
    const remaining = Math.max(0, elevator.doorRemainingMs - dtMs);
    const nextQueue =
      remaining === 0 && elevator.stopQueue[0] === elevator.currentFloor
        ? elevator.stopQueue.slice(1)
        : elevator.stopQueue;

    if (remaining > 0) {
      return {
        ...elevator,
        doorRemainingMs: remaining
      };
    }

    if (nextQueue.length > 0) {
      return {
        ...elevator,
        status: 'moving',
        direction: directionTo(elevator.currentFloor, nextQueue[0]),
        stopQueue: nextQueue,
        doorRemainingMs: 0,
        progressMs: 0
      };
    }

    return {
      ...elevator,
      status: 'idle',
      direction: 0,
      stopQueue: nextQueue,
      doorRemainingMs: 0,
      progressMs: 0
    };
  }

  if (elevator.status === 'moving') {
    if (elevator.stopQueue.length === 0) {
      return {
        ...elevator,
        status: 'idle',
        direction: 0,
        progressMs: 0
      };
    }

    const target = elevator.stopQueue[0];
    const direction = directionTo(elevator.currentFloor, target);

    if (direction === 0) {
      return {
        ...elevator,
        status: 'doorsOpen',
        direction: 0,
        doorRemainingMs: opts.doorOpenMs,
        progressMs: 0
      };
    }

    let progress = elevator.progressMs + dtMs;
    let currentFloor = elevator.currentFloor;
    let status: ElevatorState['status'] = elevator.status;

    while (progress >= opts.msPerFloor) {
      progress -= opts.msPerFloor;
      currentFloor = clampFloor(currentFloor + direction, floorsCount);

      if (currentFloor === target) {
        status = 'doorsOpen';
        progress = 0;
        break;
      }
    }

    if (status === 'doorsOpen') {
      return {
        ...elevator,
        currentFloor,
        status,
        direction: 0,
        doorRemainingMs: opts.doorOpenMs,
        progressMs: 0
      };
    }

    return {
      ...elevator,
      currentFloor,
      direction,
      progressMs: progress
    };
  }

  if (elevator.status === 'idle' && elevator.stopQueue.length > 0) {
    const target = elevator.stopQueue[0];
    if (target === elevator.currentFloor) {
      return {
        ...elevator,
        status: 'doorsOpen',
        direction: 0,
        doorRemainingMs: opts.doorOpenMs,
        progressMs: 0
      };
    }

    return {
      ...elevator,
      status: 'moving',
      direction: directionTo(elevator.currentFloor, target),
      progressMs: 0
    };
  }

  return elevator;
};

export const tick = (
  state: SimulationState,
  dtMs: number,
  opts: SimulationOptions
): SimulationState => {
  const buildings: Record<string, BuildingState> = {};

  Object.values(state.buildings).forEach((building) => {
    buildings[building.id] = {
      ...building,
      elevators: building.elevators.map((elevator) =>
        tickElevator(elevator, building.floorsCount, dtMs, opts)
      )
    };
  });

  return {
    ...state,
    nowMs: state.nowMs + dtMs,
    buildings
  };
};
