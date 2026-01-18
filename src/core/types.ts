export type BuildingId = string;
export type ElevatorId = string;

export type CallRequest = {
  id: string;
  buildingId: BuildingId;
  floor: number;
  createdAt: number;
};

export type ElevatorStatus = 'idle' | 'moving' | 'doorsOpen';
export type Direction = -1 | 0 | 1;

export type ElevatorState = {
  id: ElevatorId;
  currentFloor: number;
  status: ElevatorStatus;
  direction: Direction;
  stopQueue: number[];
  doorRemainingMs: number;
  progressMs: number;
};

export type BuildingState = {
  id: BuildingId;
  floorsCount: number;
  elevators: ElevatorState[];
};

export type SimulationState = {
  buildings: Record<BuildingId, BuildingState>;
  nowMs: number;
};

export type SimulationOptions = {
  msPerFloor: number;
  doorOpenMs: number;
};

export type BuildingConfigInput = {
  id: BuildingId;
  floorsCount: number;
  elevatorsCount: number;
};

export type SimulationConfig = {
  buildings: BuildingConfigInput[];
};
