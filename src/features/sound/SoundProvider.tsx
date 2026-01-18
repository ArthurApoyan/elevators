import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import arrivalSound from '../../assets/sounds/arrival.mp3';

export type SoundName = 'arrival' | 'doorOpen' | 'doorClose';

type SoundContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const SOUND_STORAGE_KEY = 'elevator:soundEnabled';

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabledState] = useState(() => {
    const stored = window.localStorage.getItem(SOUND_STORAGE_KEY);
    return stored ? stored === 'true' : true;
  });
  const [unlocked, setUnlocked] = useState(false);

  const audios = useMemo(
    () => ({
      arrival: new Audio(arrivalSound),
    }),
    []
  );

  useEffect(() => {
    Object.values(audios).forEach((audio) => {
      audio.preload = 'auto';
    });
  }, [audios]);

  useEffect(() => {
    window.localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  }, [enabled]);

  useEffect(() => {
    if (unlocked) {
      return;
    }

    const unlock = () => {
      setUnlocked(true);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [unlocked]);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    if (next) {
      setUnlocked(true);
    }
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled || !unlocked) {
        return;
      }
      const audio = audios[name as keyof typeof audios];
      if (!audio) {
        return;
      }
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
    },
    [audios, enabled, unlocked]
  );

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      play
    }),
    [enabled, play, setEnabled]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
};
