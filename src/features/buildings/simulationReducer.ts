import { assignCall, tick } from '../../core';
import { CallRequest, SimulationOptions, SimulationState } from '../../core';

export type SimulationAction =
  | { type: 'CALL_FLOOR'; buildingId: string; floor: number }
  | { type: 'TICK'; dtMs: number };

export const createSimulationReducer =
  (opts: SimulationOptions) =>
  (state: SimulationState, action: SimulationAction): SimulationState => {
    switch (action.type) {
      case 'CALL_FLOOR': {
        const call: CallRequest = {
          id: `${action.buildingId}-${action.floor}-${state.nowMs}`,
          buildingId: action.buildingId,
          floor: action.floor,
          createdAt: state.nowMs
        };
        return assignCall(state, call, opts);
      }
      case 'TICK':
        return tick(state, action.dtMs, opts);
      default:
        return state;
    }
  };
