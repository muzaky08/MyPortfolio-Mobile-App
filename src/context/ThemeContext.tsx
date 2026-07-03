import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../theme';

const DARK_MODE_KEY = '@myportfolio_dark_mode';

type ThemeContextValue = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  paperTheme: typeof lightTheme;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DARK_MODE_KEY)
      .then((value) => {
        if (value !== null) {
          setIsDarkMode(value === 'true');
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem(DARK_MODE_KEY, String(next)).catch(() => {});
      return next;
    });
  };

  const value = useMemo(
    () => ({
      isDarkMode,
      toggleDarkMode,
      paperTheme: isDarkMode ? darkTheme : lightTheme,
    }),
    [isDarkMode]
  );

  if (!loaded) {
    return (
      <ThemeContext.Provider
        value={{
          isDarkMode: false,
          toggleDarkMode: () => {},
          paperTheme: lightTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
}
