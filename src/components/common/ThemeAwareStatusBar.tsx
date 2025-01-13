import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeAwareStatusBar: React.FC = () => {
  const { theme } = useTheme();

  return (
    <StatusBar
      barStyle={theme.dark ? 'light-content' : 'dark-content'}
      backgroundColor={theme.colors.background}
      animated={true}
    />
  );
}; 