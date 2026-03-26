import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import {useColorScheme as useNativeColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LightTheme, DarkTheme, ThemeColors} from './colors';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextProps {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'system',
  isDark: false,
  colors: LightTheme,
  setMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const systemScheme = useNativeColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then(saved => {
      if (saved === 'light' || saved === 'dark') {
        setModeState(saved as ThemeMode);
      }
    });
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem('themeMode', newMode);
  };

  const toggleTheme = () => {
    const currentIsDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
    setMode(currentIsDark ? 'light' : 'dark');
  };

  const isDark = useMemo(() => {
    if (mode === 'system') return systemScheme === 'dark';
    return mode === 'dark';
  }, [mode, systemScheme]);

  const colors = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{mode, isDark, colors, setMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
