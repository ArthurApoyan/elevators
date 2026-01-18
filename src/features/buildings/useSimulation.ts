import { useEffect, useMemo, useReducer } from 'react';
import { createInitialStateFromConfig, SimulationConfig, SimulationOptions } from '../../core';
import { createSimulationReducer } from './simulationReducer';

export const useSimulation = (config: SimulationConfig, opts: SimulationOptions) => {
  const initialState = useMemo(() => createInitialStateFromConfig(config), [config]);
  const reducer = useMemo(() => createSimulationReducer(opts), [opts]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', dtMs: 100 });
    }, 100);

    return () => window.clearInterval(id);
  }, []);

  return { state, dispatch };
};
