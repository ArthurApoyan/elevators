import { BuildingState, ElevatorState, SimulationConfig, SimulationState } from './types';

const createElevator = (id: string, startFloor: number): ElevatorState => ({
  id,
  currentFloor: startFloor,
  status: 'idle',
  direction: 0,
  stopQueue: [],
  doorRemainingMs: 0,
  progressMs: 0
});

export const createInitialStateFromConfig = (config: SimulationConfig): SimulationState => {
  const buildings: Record<string, BuildingState> = {};

  config.buildings.forEach((building) => {
    const elevators: ElevatorState[] = [];
    const startFloor = 1;

    for (let index = 0; index < building.elevatorsCount; index += 1) {
      const elevatorId = `${building.id}-e${index + 1}`;
      elevators.push(createElevator(elevatorId, startFloor));
    }

    buildings[building.id] = {
      id: building.id,
      floorsCount: building.floorsCount,
      elevators
    };
  });

  return {
    buildings,
    nowMs: 0
  };
};
