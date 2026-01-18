import styled from 'styled-components';
import { useSound } from './SoundProvider';
import { useT } from '../i18n/useT';

const ToggleButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm}px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  gap: 8px;
  padding: 8px 12px;
`;

const Badge = styled.span<{ $on: boolean }>`
  background: ${({ theme, $on }) => ($on ? theme.colors.accent : theme.colors.border)};
  border-radius: 999px;
  color: ${({ theme, $on }) => ($on ? theme.colors.background : theme.colors.text)};
  font-size: 12px;
  padding: 2px 8px;
`;

export const SoundToggle = () => {
  const { enabled, setEnabled } = useSound();
  const { t } = useT();

  return (
    <ToggleButton type="button" onClick={() => setEnabled(!enabled)}>
      {t('sound.label')}
      <Badge $on={enabled}>{enabled ? t('sound.on') : t('sound.off')}</Badge>
    </ToggleButton>
  );
};
