import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = {
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  subText: string;
  border: string;
  primary: string;
  primaryGlow: string;
  danger: string;
  glass: string;
  glassBorder: string;
  overlay: string;
};

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const darkTheme: Theme = {
  background: '#0a0a0f',
  card: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.12)',
  text: '#f0f0f5',
  subText: 'rgba(240,240,245,0.5)',
  border: 'rgba(255,255,255,0.08)',
  primary: '#7c6aff',
  primaryGlow: 'rgba(124,106,255,0.35)',
  danger: '#ff5c6c',
  glass: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.1)',
  overlay: 'rgba(10,10,15,0.85)',
};

const lightTheme: Theme = {
  background: '#f0eff8',
  card: 'rgba(255,255,255,0.75)',
  cardBorder: 'rgba(124,106,255,0.15)',
  text: '#1a1825',
  subText: 'rgba(26,24,37,0.5)',
  border: 'rgba(124,106,255,0.12)',
  primary: '#7c6aff',
  primaryGlow: 'rgba(124,106,255,0.2)',
  danger: '#ff5c6c',
  glass: 'rgba(255,255,255,0.6)',
  glassBorder: 'rgba(124,106,255,0.2)',
  overlay: 'rgba(240,239,248,0.85)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};
