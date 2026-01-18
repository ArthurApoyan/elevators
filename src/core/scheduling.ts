import {
    BuildingState,
    CallRequest, ElevatorId,
    ElevatorState,
    SimulationOptions,
    SimulationState
} from './types';

const directionTo = (from: number, to: number): -1 | 0 | 1 => {
    if (to > from) return 1;
    if (to < from) return -1;
    return 0;
};

export const estimateETA = (
    elevator: ElevatorState,
    targetFloor: number,
    opts: SimulationOptions
): number => {
    if (targetFloor === elevator.currentFloor && elevator.status === 'doorsOpen') {
        return 0;
    }

    let timeMs = 0;
    let currentFloor = elevator.currentFloor;
    let progressMs = elevator.progressMs;
    let queue = [...elevator.stopQueue];

    if (elevator.status === 'doorsOpen') {
        timeMs += elevator.doorRemainingMs;
        if (queue[0] === currentFloor) {
            queue = queue.slice(1);
        }
    }

    if (elevator.status === 'moving' && queue.length > 0) {
        const nextTarget = queue[0];
        const direction = directionTo(currentFloor, nextTarget);
        if (direction !== 0) {
            const remainingStep = Math.max(0, opts.msPerFloor - progressMs);
            timeMs += remainingStep;
            currentFloor += direction;
        }

        if (currentFloor === nextTarget) {
            timeMs += opts.doorOpenMs;
            queue = queue.slice(1);
            if (currentFloor === targetFloor) {
                return timeMs;
            }
        }
    }

    while (true) {
        if (queue.length > 0) {
            const stop = queue[0];
            timeMs += Math.abs(stop - currentFloor) * opts.msPerFloor;
            currentFloor = stop;
            timeMs += opts.doorOpenMs;
            queue = queue.slice(1);
            if (currentFloor === targetFloor) {
                return timeMs;
            }
        } else {
            timeMs += Math.abs(targetFloor - currentFloor) * opts.msPerFloor;
            timeMs += opts.doorOpenMs;
            return timeMs;
        }
    }
};

export const chooseElevator = (
    building: BuildingState,
    targetFloor: number,
    opts: SimulationOptions
): ElevatorId => {
    const ranked = building.elevators
        .map((elevator) => ({
            elevator,
            eta: estimateETA(elevator, targetFloor, opts),
            queueLength: elevator.stopQueue.length,
            distance: Math.abs(elevator.currentFloor - targetFloor)
        }))
        .sort((a, b) => {
            if (a.eta !== b.eta) return a.eta - b.eta;
            if (a.queueLength !== b.queueLength) return a.queueLength - b.queueLength;
            if (a.distance !== b.distance) return a.distance - b.distance;
            return a.elevator.id.localeCompare(b.elevator.id);
        });

    return (ranked[0]?.elevator.id ?? building.elevators[0].id) as ElevatorId;
};

export const assignCall = (
    state: SimulationState,
    call: CallRequest,
    opts: SimulationOptions
): SimulationState => {
    const building = state.buildings[call.buildingId];
    if (!building) {
        return state;
    }

    const chosenId = chooseElevator(building, call.floor, opts);
    const elevators = building.elevators.map((elevator) => {
        if (elevator.id !== chosenId) {
            return elevator;
        }

        if (
            elevator.status === 'idle' &&
            elevator.stopQueue.length === 0 &&
            elevator.currentFloor === call.floor
        ) {
            return {
                ...elevator,
                status: 'doorsOpen',
                direction: 0 as const,
                doorRemainingMs: opts.doorOpenMs,
                progressMs: 0
            } satisfies ElevatorState;
        }

        const nextQueue = elevator.stopQueue.slice();
        if (nextQueue[nextQueue.length - 1] !== call.floor) {
            nextQueue.push(call.floor);
        }

        return {
            ...elevator,
            stopQueue: nextQueue
        };
    });

    return {
        ...state,
        buildings: {
            ...state.buildings,
            [building.id]: {
                ...building,
                elevators
            }
        }
    };
};
