'use client';

import { useState, useEffect } from 'react';
import { useBackground } from './BackgroundProvider';

export default function BackgroundSelector() {
  const { background, setBackground } = useBackground();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const backgroundOptions = [
    { id: 'none', name: 'No Background' },
    { id: 'space', name: 'Space' },
    { id: 'matrix', name: 'Matrix Grid' },
    { id: 'synthwave', name: 'Synthwave' },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectBackground = (
    type: 'none' | 'space' | 'matrix' | 'synthwave'
  ) => {
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
        className="bg-primary text-primary-foreground py-2 px-4 rounded-md flex items-center justify-between min-w-40"
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
        <div className="absolute mt-1 w-full rounded-md bg-primary-foreground text-primary shadow-lg z-20">
          <ul className="py-1">
            {backgroundOptions.map((option) => (
              <li key={option.id}>
                <button
                  onClick={() => selectBackground(option.id as any)}
                  className={`block w-full text-left px-4 py-2 hover:bg-primary hover:text-primary-foreground ${
                    background === option.id ? 'bg-primary bg-opacity-20' : ''
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
