import { useContext } from 'react';
import { I18nContextValue } from './types';
import { I18nContext } from './I18nProvider';

export const useT = (): I18nContextValue => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useT must be used within I18nProvider');
  }

  return context;
};
