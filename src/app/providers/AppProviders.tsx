import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';
import { SoundProvider } from '../../features/sound/SoundProvider';

type AppProvidersProps = {
  children: React.ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SoundProvider>{children}</SoundProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};
