import styled from 'styled-components';
import { ElevatorState } from '../../core';
import { useT } from '../i18n/useT';

const Panel = styled.div`
  display: grid;
  gap: 12px;
`;

const PanelCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm}px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const PanelTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;

const PanelMeta = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  display: grid;
  gap: 4px;
`;

type ElevatorPanelProps = {
  elevators: ElevatorState[];
};

export const ElevatorPanel = ({ elevators }: ElevatorPanelProps) => {
  const { t } = useT();

  return (
    <Panel>
      {elevators.map((elevator) => (
        <PanelCard key={elevator.id}>
          <PanelTitle>
            {t('elevator.label')} {elevator.id}
          </PanelTitle>
          <PanelMeta>
            <span>
              {t('elevator.currentFloor')}: {elevator.currentFloor}
            </span>
            <span>{t(`elevator.status.${elevator.status}`)}</span>
            <span>
              {t('elevator.queue')}: {elevator.stopQueue.length ? elevator.stopQueue.join(' \u2192 ') : '-'}
            </span>
          </PanelMeta>
        </PanelCard>
      ))}
    </Panel>
  );
};
