'use client';

import { useState, useEffect } from 'react';
import { useBackground, type BackgroundType } from './BackgroundProvider';

export default function BackgroundSelector() {
  const { background, setBackground } = useBackground();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const backgroundOptions = [
    { id: 'none' as const, name: 'No Background' },
    { id: 'space' as const, name: 'Space' },
    { id: 'matrix' as const, name: 'Matrix Grid' },
    { id: 'synthwave' as const, name: 'Synthwave' },
  ] as const;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectBackground = (type: BackgroundType) => {
    setBackground(type);
    setIsOpen(false);
  };

  const getCurrentBackgroundName = () => {
    return (
      backgroundOptions.find((option) => option.id === background)?.name ||
      'Select Background'
    );
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-primary font-medium text-primary-foreground py-2 px-4 rounded-md flex items-center justify-between min-w-40"
      >
        <span>{getCurrentBackgroundName()}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full font-medium rounded-md bg-slate-100 dark:bg-slate-800 shadow-lg z-20 border border-slate-300 dark:border-slate-700">
          <ul>
            {backgroundOptions.map((option) => (
              <li key={option.id}>
                <button
                  onClick={() => selectBackground(option.id)}
                  className={`block w-full text-left px-4 py-2 transition-colors duration-200 
                    ${
                      background === option.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                  {option.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
