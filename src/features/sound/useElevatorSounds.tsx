import { useEffect } from 'react';
import { SimulationState } from '../../core';
import { usePrevious } from './usePrevious';
import { getElevatorSoundEvents } from './soundTransitions';
import { useSound } from './SoundProvider';

export const useElevatorSounds = (state: SimulationState) => {
  const previous = usePrevious(state);
  const { play } = useSound();

  useEffect(() => {
    if (!previous) {
      return;
    }

    Object.values(state.buildings).forEach((building) => {
      const prevBuilding = previous.buildings[building.id];
      building.elevators.forEach((elevator) => {
        const prevElevator = prevBuilding?.elevators.find((item) => item.id === elevator.id);
        const events = getElevatorSoundEvents(prevElevator, elevator);
        events.forEach((eventName) => play(eventName));
      });
    });
  }, [play, previous, state]);
};
