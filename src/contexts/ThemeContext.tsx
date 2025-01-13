import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Tema Light
const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#02a9f7',
    secondary: '#4CAF50',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
    error: '#f44336',
    warning: '#FFA726',
    success: '#4CAF50',
    white: '#ffffff',
    comparing: '#ff9800',
    swapping: '#f44336',
    sorted: '#4caf50',
  }
};

// Tema Dark
const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#02a9f7',
    secondary: '#66bb6a',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333',
    error: '#ef5350',
    warning: '#FFB74D',
    success: '#66bb6a',
    white: '#ffffff',
    comparing: '#ffa726',
    swapping: '#ef5350',
    sorted: '#66bb6a',
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>('system');
  
  const [theme, setTheme] = useState<Theme>(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  });

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    }
  }, [systemColorScheme, themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem('themeMode');
      if (savedThemeMode) {
        setThemeModeState(savedThemeMode as 'light' | 'dark' | 'system');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeModeState(mode);
      
      if (mode === 'system') {
        setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
      } else {
        setTheme(mode === 'dark' ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = theme.dark ? 'light' : 'dark';
    await setThemeMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark: theme.dark, 
      toggleTheme,
      setThemeMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};