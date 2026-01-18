import { ElevatorStatus } from '../../core';
import { SoundName } from './SoundProvider';

export type ElevatorStatusSnapshot = {
  id: string;
  status: ElevatorStatus;
};

export const getElevatorSoundEvents = (
  prev: ElevatorStatusSnapshot | undefined,
  next: ElevatorStatusSnapshot
): SoundName[] => {
  if (!prev) {
    return [];
  }

  if (prev.status === 'moving' && next.status === 'doorsOpen') {
    return ['arrival', 'doorOpen'];
  }

  if (prev.status === 'doorsOpen' && next.status !== 'doorsOpen') {
    return ['doorClose'];
  }

  return [];
};
