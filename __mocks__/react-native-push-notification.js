import { NativeEventEmitter } from 'react-native';

const mockPushNotification = {
  localNotification: jest.fn(),
  configure: jest.fn(),
  requestPermissions: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  createChannel: jest.fn(),
  deleteChannel: jest.fn(),
  getChannels: jest.fn(),
  getDeliveredNotifications: jest.fn(),
  popInitialNotification: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  onNotification: jest.fn(),
  onRegister: jest.fn(),
  onAction: jest.fn(),
  onRegistrationError: jest.fn(),
};

const mockNativeEventEmitter = new NativeEventEmitter(mockPushNotification);

export default {
  ...mockPushNotification,
  NativeEventEmitter: jest.fn(() => mockNativeEventEmitter),
};
