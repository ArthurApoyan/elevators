import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import styled from 'styled-components';
import { BuildingConfig } from '../../app/config/buildings';
import { BuildingState, SimulationOptions } from '../../core';
import { Card } from '../../ui/components/Card';
import { useT } from '../i18n/useT';
import { ElevatorPanel } from './ElevatorPanel';
import { ElevatorShaft } from './ElevatorShaft';
import { FloorList } from './FloorList';

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

const Name = styled.h2`
  font-size: 20px;
  margin: 0;
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

const Body = styled.div`
  display: grid;
  gap: 16px;
`;

const Visualization = styled.div`
  display: grid;
  gap: 16px;
  align-items: start;
  grid-template-columns: 1fr;

  @media (min-width: 64em) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  }
`;

const ShaftColumn = styled.div`
  display: grid;
  gap: 12px;
`;

const FloorHeader = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.muted};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm}px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 13px;
  padding: 6px 10px;
`;

const SnapshotError = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 12px;
`;

type BuildingCardProps = {
  building: BuildingConfig;
  state?: BuildingState;
  options: SimulationOptions;
  onCall: (buildingId: string, floor: number) => void;
};

export const BuildingCard = ({ building, state, options, onCall }: BuildingCardProps) => {
  const { t } = useT();
  const [activeFloor, setActiveFloor] = useState<number | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const snapshotRef = useRef<HTMLDivElement | null>(null);
  const floors = Array.from(
    { length: building.floorsCount },
    (_, index) => building.floorsCount - index
  );
  const queuedFloors = useMemo(() => {
    if (!state) {
      return new Set<number>();
    }
    return new Set(state.elevators.flatMap((elevator) => elevator.stopQueue));
  }, [state]);

  const handleCall = (floor: number) => {
    setActiveFloor(floor);
    onCall(building.id, floor);
    window.setTimeout(() => setActiveFloor((current) => (current === floor ? null : current)), 250);
  };

  const handleSnapshot = async () => {
    if (!snapshotRef.current) {
      return;
    }

    setSnapshotError(null);
    try {
      const dataUrl = await toPng(snapshotRef.current, {
        cacheBust: true,
        backgroundColor: '#0f1219',
        pixelRatio: 2,
        filter: (node) => !(node instanceof HTMLElement) || !node.dataset.snapshotIgnore
      });
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .replace('T', '-')
        .slice(0, 15);
      const filename = `building-${building.id}-${timestamp}.png`;
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      setSnapshotError(t('snapshot.error'));
    }
  };

  return (
    <Card data-testid="building-card">
      <div ref={snapshotRef}>
        <Header>
          <Name>{t(building.nameKey)}</Name>
          <Meta>
            {t('building.floors')}: {building.floorsCount} | {t('building.elevators')}:{' '}
            {building.elevatorsCount}
          </Meta>
        </Header>
        <Body>
          {state && (
            <Visualization>
              <ShaftColumn>
                <ElevatorShaft
                  floorsCount={building.floorsCount}
                  elevators={state.elevators}
                  options={options}
                />
                <FloorHeader>{t('building.floors')}</FloorHeader>
              </ShaftColumn>
              <FloorList
                floors={floors}
                queuedFloors={queuedFloors}
                activeFloor={activeFloor}
                onCall={handleCall}
                renderLabel={(floor) => t('building.floorLabel', { n: floor })}
              />
            </Visualization>
          )}
          {state && <ElevatorPanel elevators={state.elevators} />}
        </Body>
      </div>
      <Actions data-snapshot-ignore>
        <ActionButton type="button" onClick={handleSnapshot}>
          {t('snapshot.download')}
        </ActionButton>
        {snapshotError && <SnapshotError>{snapshotError}</SnapshotError>}
      </Actions>
    </Card>
  );
};
