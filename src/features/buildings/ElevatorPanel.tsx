import styled from 'styled-components';
import { ElevatorState } from '../../core';
import { useT } from '../i18n/useT';

const Panel = styled.div`
  display: grid;
  gap: 12px;
`;

const PanelCard = styled.div<{ $assigned: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm}px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  box-shadow: ${({ $assigned }) =>
    $assigned ? '0 0 0 1px rgba(112, 189, 23, 0.25)' : 'none'};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
`;

const PanelTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelMeta = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  display: grid;
  gap: 4px;
`;

const StatusPill = styled.span<{ $active: boolean }>`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

type ElevatorPanelProps = {
  elevators: ElevatorState[];
};

export const ElevatorPanel = ({ elevators }: ElevatorPanelProps) => {
  const { t } = useT();

  return (
    <Panel>
      {elevators.map((elevator) => (
        <PanelCard key={elevator.id} $assigned={elevator.stopQueue.length > 0}>
          <PanelTitle>
            {t('elevator.label')} {elevator.id}
            <StatusPill $active={elevator.status === 'doorsOpen'}>
              {t(`elevator.status.${elevator.status}`)}
            </StatusPill>
          </PanelTitle>
          <PanelMeta>
            <span>
              {t('elevator.currentFloor')}: {elevator.currentFloor}
            </span>
            <span>
              {t('elevator.queue')}: {elevator.stopQueue.length ? elevator.stopQueue.join(' \u2192 ') : '-'}
            </span>
          </PanelMeta>
        </PanelCard>
      ))}
    </Panel>
  );
};
