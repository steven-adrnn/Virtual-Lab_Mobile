import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { LogBox, AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Ignore specific warnings
// LogBox.ignoreLogs([
//   // Ignore timer warning from reanimated
//   'Setting a timer',
//   // Ignore Metro warning
//   'Metro is initializing.',
//   // Ignore AsyncStorage warning
//   'AsyncStorage has been extracted from react-native',
//   // Ignore ViewPropTypes warning
//   'ViewPropTypes will be removed',
//   // Ignore Reanimated warning
//   "Reanimated 2 failed to create a worklet",
//   // Ignore websocket warning
//   'Warning: WebSocket connection',
// ]);

// Enable Hermes engine
if (typeof global.HermesInternal === 'object') {
  console.log('Hermes is enabled');
}

// Configure performance monitoring
if (__DEV__) {
  import('./src/utils/reactotron').then(() => console.log('Reactotron Configured'));
}

// Configure error boundary
if (!__DEV__) {
  // Initialize error reporting service (e.g., Sentry)
  import('./src/utils/errorReporting').then(({ initErrorReporting }) => {
    initErrorReporting();
  });
}

// Initialize analytics
import('./src/services/analytics').then(({ initAnalytics }) => {
  initAnalytics();
});

// Initialize notifications
import('./src/services/notifications').then(({ initNotifications }) => {
  initNotifications();
});

// Initialize database
import('./src/services/database').then(({ initDatabase }) => {
  initDatabase();
});

// Initialize theme
import('./src/utils/theme').then(({ initTheme }) => {
  initTheme();
});

// Initialize localization
import('./src/utils/i18n').then(({ initI18n }) => {
  initI18n();
});

// Performance monitoring
const withPerformanceMonitoring = (AppComponent) => {
  return class PerformanceMonitoring extends React.Component {
    componentDidMount() {
      if (!__DEV__) {
        // Start performance monitoring
        import('./src/utils/performance').then(({ startPerformanceMonitoring }) => {
          startPerformanceMonitoring();
        });
      }
    }

    render() {
      return <AppComponent {...this.props} />;
    }
  };
};

// Deep linking configuration
const linking = {
  prefixes: ['virtuallab://', 'https://virtuallab.com'],
  config: {
    screens: {
      Home: 'home',
      Course: {
        path: 'course/:id',
        parse: {
          id: (id) => `${id}`,
        },
      },
      Simulation: {
        path: 'simulation/:type',
        parse: {
          type: (type) => `${type}`,
        },
      },
      Quiz: {
        path: 'quiz/:id',
        parse: {
          id: (id) => `${id}`,
        },
      },
      Profile: 'profile',
      Settings: 'settings',
    },
  },
};

// Configure persistence
import { persistCache } from '@apollo/client/cache/inmemory/persistence';
import AsyncStorage from '@react-native-async-storage/async-storage';

const setupPersistence = async () => {
  try {
    await persistCache({
      cache,
      storage: AsyncStorage,
    });
  } catch (error) {
    console.error('Error setting up persistence:', error);
  }
};

setupPersistence();

// Configure app
const AppWithConfiguration = withPerformanceMonitoring(App);

// Register app
if (Platform.OS === 'web') {
  AppRegistry.registerComponent(appName, () => AppWithConfiguration);
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
} else {
  registerRootComponent(AppWithConfiguration);
}

// Export for testing
export default App;