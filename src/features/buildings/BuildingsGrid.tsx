import { BuildingConfig } from '../../app/config/buildings';
import { SimulationOptions, SimulationState } from '../../core';
import { Grid } from '../../ui/components/Grid';
import { BuildingCard } from './BuildingCard';

type BuildingsGridProps = {
  buildings: BuildingConfig[];
  simulation: SimulationState;
  options: SimulationOptions;
  onCall: (buildingId: string, floor: number) => void;
};

export const BuildingsGrid = ({ buildings, simulation, options, onCall }: BuildingsGridProps) => {
  return (
    <Grid
      gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
      gridGap={4}
    >
      {buildings.map((building) => (
        <BuildingCard
          key={building.id}
          building={building}
          state={simulation.buildings[building.id]}
          options={options}
          onCall={onCall}
        />
      ))}
    </Grid>
  );
};
