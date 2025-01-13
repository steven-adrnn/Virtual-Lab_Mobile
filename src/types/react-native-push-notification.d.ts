declare module 'react-native-push-notification' {
  export interface PushNotification {
    configure(options: ConfigureOptions): void;
    createChannel(channel: ChannelObject, callback: (created: boolean) => void): void;
    localNotification(details: NotificationObject): void;
    localNotificationSchedule(details: ScheduleNotificationObject): void;
    cancelAllLocalNotifications(): void;
  }

  export interface ConfigureOptions {
    onRegister?: (token: { token: string; os: string }) => void;
    onNotification?: (notification: any) => void;
    permissions?: {
      alert?: boolean;
      badge?: boolean;
      sound?: boolean;
    };
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }

  export interface ChannelObject {
    channelId: string;
    channelName: string;
    channelDescription?: string;
    importance?: number;
    vibrate?: boolean;
  }

  export interface NotificationObject {
    channelId: string;
    title?: string;
    message: string;
    playSound?: boolean;
    soundName?: string;
    vibrate?: boolean;
    data?: any;
    userInfo?: any;
  }

  export interface ScheduleNotificationObject extends NotificationObject {
    date: Date;
    allowWhileIdle?: boolean;
    repeatType?: 'week' | 'day' | 'hour' | 'minute';
  }

  export enum Importance {
    DEFAULT = 3,
    HIGH = 4,
    LOW = 2,
    MAX = 5,
    MIN = 1,
    NONE = 0,
  }

  const PushNotification: PushNotification;
  export default PushNotification;
} 