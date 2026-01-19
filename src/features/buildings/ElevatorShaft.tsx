import styled, {keyframes} from 'styled-components';
import {ElevatorState, SimulationOptions} from '../../core';
import elevatorCar from '../../assets/images/elevator-car.svg';

export const FLOOR_HEIGHT_PX = 48;

const ShaftWrapper = styled.div`
    position: relative;
    border-radius: ${({theme}) => theme.radii.md}px;
    background: linear-gradient(180deg, rgba(20, 27, 38, 0.9) 0%, rgba(16, 21, 30, 0.9) 100%);
    border: 1px solid ${({theme}) => theme.colors.border};
    overflow: hidden;
`;

const ShaftGrid = styled.div`
    display: grid;
    height: 100%;
    width: 100%;
`;

const Lane = styled.div`
    position: relative;
    border-left: 1px solid ${({theme}) => theme.colors.border};
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 60%);

    &:first-child {
        border-left: none;
    }

    &::after {
        content: '';
        position: absolute;
        inset: 8px 12%;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        opacity: 0.5;
        pointer-events: none;
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

const glow = keyframes`
    0% {
        box-shadow: 0 0 0 rgba(112, 189, 23, 0.2), 0 10px 20px rgba(0, 0, 0, 0.35);
    }
    100% {
        box-shadow: 0 0 18px rgba(112, 189, 23, 0.5), 0 10px 20px rgba(0, 0, 0, 0.35);
    }
`;

const CarShell = styled.div<{ $active: boolean; $assigned: boolean }>`
    position: absolute;
    left: 50%;
    width: 78%;
    height: ${FLOOR_HEIGHT_PX - 6}px;
    border-radius: ${({theme}) => theme.radii.sm}px;
    background-image: url(${elevatorCar});
    background-size: cover;
    background-position: center;
    border: 1px solid ${({theme}) => theme.colors.border};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: ${({theme}) => theme.colors.text};
    transition: transform 260ms ease, box-shadow 200ms ease, border-color 200ms ease;
    box-shadow: ${({$assigned}) =>
            $assigned ? '0 0 0 1px rgba(112, 189, 23, 0.35), 0 10px 18px rgba(0, 0, 0, 0.35)' : '0 10px 18px rgba(0, 0, 0, 0.35)'};
    border-color: ${({theme, $active}) =>
            $active ? theme.colors.accent : theme.colors.border};
    animation: ${({$active}) => ($active ? glow : 'none')} 0.9s ease-in-out infinite alternate;

    &::after {
        content: '';
        position: absolute;
        inset: 4px;
        border-radius: ${({theme}) => theme.radii.sm}px;
        background: radial-gradient(circle at top, rgba(255, 255, 255, 0.2), transparent 55%);
        opacity: 0.35;
        pointer-events: none;
    }
`;

const CarLabel = styled.div`
    position: relative;
    z-index: 1;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(10, 14, 21, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
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

export const ElevatorShaft = ({floorsCount, elevators, options}: ElevatorShaftProps) => {
    const height = floorsCount * FLOOR_HEIGHT_PX;

    return (
        <ShaftWrapper style={{height}}>
            <FloorLines/>
            <ShaftGrid style={{gridTemplateColumns: `repeat(${elevators.length}, 1fr)`}}>
                {elevators.map((elevator) => {
                    const offset = getCarOffset(elevator, floorsCount, options);
                    const isOpen = elevator.status === 'doorsOpen';
                    const isAssigned = elevator.stopQueue.length > 0;
                    return (
                        <Lane key={elevator.id}>
                            <CarShell
                                $active={isOpen}
                                $assigned={isAssigned}
                                title={`Elevator ${elevator.id} • Floor ${elevator.currentFloor} • ${elevator.status}`}
                                style={{transform: `translate(-50%, ${offset + 4}px)`}}
                            >
                                <CarLabel>{elevator.id.split('-').pop()?.toUpperCase()}</CarLabel>
                            </CarShell>
                        </Lane>
                    );
                })}
            </ShaftGrid>
        </ShaftWrapper>
    );
};
