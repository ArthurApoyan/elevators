export type BuildingConfig = {
  id: string;
  nameKey: string;
  floorsCount: number;
  elevatorsCount: number;
};

export const buildings: BuildingConfig[] = [
  { id: 'alpha', nameKey: 'buildings.alpha', floorsCount: 8, elevatorsCount: 2 },
  { id: 'bravo', nameKey: 'buildings.bravo', floorsCount: 5, elevatorsCount: 1 },
  { id: 'charlie', nameKey: 'buildings.charlie', floorsCount: 12, elevatorsCount: 3 },
];

export const appOptions = {
  msPerFloor: 900,
  doorOpenMs: 2000
};
