import styled from 'styled-components';
import { ElevatorState, SimulationOptions } from '../../core';

export const FLOOR_HEIGHT_PX = 48;

const ShaftWrapper = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.md}px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const ShaftGrid = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
`;

const Lane = styled.div`
  position: relative;
  border-left: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child {
    border-left: none;
  }
`;

const FloorLines = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent calc(${FLOOR_HEIGHT_PX}px - 1px),
    rgba(255, 255, 255, 0.08) calc(${FLOOR_HEIGHT_PX}px - 1px),
    rgba(255, 255, 255, 0.08) ${FLOOR_HEIGHT_PX}px
  );
  background-size: 100% ${FLOOR_HEIGHT_PX}px;
  pointer-events: none;
`;

const Car = styled.div<{ $active: boolean; $width: number }>`
  position: absolute;
  left: 10%;
  width: 80%;
  height: ${FLOOR_HEIGHT_PX - 10}px;
  border-radius: ${({ theme }) => theme.radii.sm}px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: transform 200ms linear, box-shadow 200ms ease, border-color 200ms ease;
  box-shadow: ${({ $active }) =>
    $active ? '0 0 12px rgba(246, 196, 83, 0.5)' : '0 6px 12px rgba(0, 0, 0, 0.2)'};
  border-color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.border};
`;

type ElevatorShaftProps = {
  floorsCount: number;
  elevators: ElevatorState[];
  options: SimulationOptions;
};

const getCarOffset = (elevator: ElevatorState, floorsCount: number, options: SimulationOptions) => {
  const base = (floorsCount - elevator.currentFloor) * FLOOR_HEIGHT_PX;
  if (elevator.status !== 'moving' || elevator.direction === 0) {
    return base;
  }
  const progress = Math.min(1, Math.max(0, elevator.progressMs / options.msPerFloor));
  return base - elevator.direction * progress * FLOOR_HEIGHT_PX;
};

export const ElevatorShaft = ({ floorsCount, elevators, options }: ElevatorShaftProps) => {
  const height = floorsCount * FLOOR_HEIGHT_PX;
  const laneWidth = Math.max(1, Math.floor(80 / elevators.length));

  return (
    <ShaftWrapper style={{ height }}>
      <FloorLines />
      <ShaftGrid style={{ gridTemplateColumns: `repeat(${elevators.length}, 1fr)` }}>
        {elevators.map((elevator) => {
          const offset = getCarOffset(elevator, floorsCount, options);
          return (
            <Lane key={elevator.id}>
              <Car
                $active={elevator.status === 'doorsOpen'}
                $width={laneWidth}
                style={{ transform: `translateY(${offset + 5}px)` }}
              >
                {elevator.id.split('-').pop()?.toUpperCase()}
              </Car>
            </Lane>
          );
        })}
      </ShaftGrid>
    </ShaftWrapper>
  );
};
