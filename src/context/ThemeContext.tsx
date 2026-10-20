/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Global Theme Context
 * Supports the Silver-Ice Luminescent Light Theme (from user reference image)
 * and the Obsidian Cyber Dark Theme.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CockpitTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: CockpitTheme;
  toggleTheme: () => void;
  setTheme: (theme: CockpitTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to 'light' per user's explicit request to adopt the theme from the uploaded image
  const [theme, setThemeState] = useState<CockpitTheme>(() => {
    try {
      const saved = localStorage.getItem('ishmin_cockpit_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ishmin_cockpit_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
        document.documentElement.classList.remove('theme-dark');
      } else {
        document.documentElement.classList.add('theme-dark');
        document.documentElement.classList.remove('theme-light');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: CockpitTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
