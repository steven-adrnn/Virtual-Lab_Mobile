import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { OfflineProvider } from './src/contexts/OfflineContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { NotificationService } from './src/services/notification';

const App = () => {
  useEffect(() => {
    NotificationService.configure();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <OfflineProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </OfflineProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;