import * as Select from '@radix-ui/react-select';
import styled from 'styled-components';
import { useT } from './useT';
import { Lang } from './types';

const SelectTrigger = styled(Select.Trigger)`
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm}px;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  font-size: 14px;
  gap: 8px;
  padding: 8px 12px;
`;

const SelectContent = styled(Select.Content)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm}px;
  padding: 6px;
`;

const SelectItem = styled(Select.Item)`
  border-radius: ${({ theme }) => theme.radii.sm}px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 14px;
  padding: 6px 10px;

  &[data-highlighted] {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    outline: none;
  }
`;

const SelectViewport = styled(Select.Viewport)`
  padding: 4px;
`;

const SelectValue = styled(Select.Value)`
  font-weight: 600;
`;

const options: { value: Lang; labelKey: string }[] = [
  { value: 'en', labelKey: 'language.english' },
  { value: 'hy', labelKey: 'language.armenian' },
  { value: 'es', labelKey: 'language.spanish' }
];

export const LanguageSelect = () => {
  const { t, lang, setLang } = useT();

  return (
    <Select.Root value={lang} onValueChange={(value) => setLang(value as Lang)}>
      <SelectTrigger aria-label={t('app.language')}>
        <SelectValue />
        <Select.Icon>▾</Select.Icon>
      </SelectTrigger>
      <Select.Portal>
        <SelectContent position="popper" sideOffset={4}>
          <SelectViewport>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <Select.ItemText>{t(option.labelKey)}</Select.ItemText>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </Select.Portal>
    </Select.Root>
  );
};
