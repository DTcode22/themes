'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import SpaceBackground from '../backgrounds/SpaceBackground';
import MatrixBackground from '../backgrounds/MatrixBackground';
import SynthwaveBackground from '../backgrounds/SynthwaveBackground';

export type BackgroundType = 'none' | 'space' | 'matrix' | 'synthwave';

interface BackgroundContextProps {
  background: BackgroundType;
  setBackground: (type: BackgroundType) => void;
}

const BackgroundContext = createContext<BackgroundContextProps>({
  background: 'none',
  setBackground: () => {},
});

export const useBackground = () => useContext(BackgroundContext);

interface BackgroundProviderProps {
  children: React.ReactNode;
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
  const [background, setBackground] = useState<BackgroundType>('none');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedBackground = localStorage.getItem(
      'preferredBackground'
    ) as BackgroundType;
    if (savedBackground) {
      setBackground(savedBackground);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('preferredBackground', background);
    }
  }, [background, mounted]);

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      <div className="background-container relative w-full min-h-[100svh]">
        {mounted && background === 'space' && <SpaceBackground />}
        {mounted && background === 'matrix' && <MatrixBackground />}
        {mounted && background === 'synthwave' && <SynthwaveBackground />}
        <div className="relative z-10">{children}</div>
      </div>
    </BackgroundContext.Provider>
  );
}
