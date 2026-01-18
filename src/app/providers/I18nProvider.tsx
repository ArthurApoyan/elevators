import React from 'react';
import { I18nProvider as CoreI18nProvider } from '../../features/i18n/I18nProvider';

type I18nProviderProps = {
  children: React.ReactNode;
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  return <CoreI18nProvider>{children}</CoreI18nProvider>;
};
