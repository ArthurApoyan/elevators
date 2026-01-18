import { useMemo } from 'react';
import styled from 'styled-components';
import { appOptions, buildings } from './config/buildings';
import { BuildingsGrid } from '../features/buildings/BuildingsGrid';
import { LanguageSelect } from '../features/i18n/LanguageSelect';
import { useT } from '../features/i18n/useT';
import { Container } from '../ui/components/Container';
import { useSimulation } from '../features/buildings/useSimulation';
import { SoundToggle } from '../features/sound/SoundToggle';
import { useElevatorSounds } from '../features/sound/useElevatorSounds';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Subtle = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 24px;
`;

export const App = () => {
  const { t } = useT();
  const simulationConfig = useMemo(
    () => ({
      buildings: buildings.map(({ id, floorsCount, elevatorsCount }) => ({
        id,
        floorsCount,
        elevatorsCount
      }))
    }),
    []
  );
  const { state, dispatch } = useSimulation(simulationConfig, appOptions);
  useElevatorSounds(state);

  return (
    <Container px={[3, 4, 5]} py={[4, 5, 6]}>
      <Header>
        <Title>{t('app.title')}</Title>
        <HeaderControls>
          <SoundToggle />
          <LanguageSelect />
        </HeaderControls>
      </Header>
      <Subtle>{t('app.subtitle')}</Subtle>
      <BuildingsGrid
        buildings={buildings}
        simulation={state}
        options={appOptions}
        onCall={(buildingId, floor) => dispatch({ type: 'CALL_FLOOR', buildingId, floor })}
      />
    </Container>
  );
};
