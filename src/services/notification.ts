import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform, NativeModules, PlatformOSType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { NotificationModule } = NativeModules;

interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  data?: any;
}

const isIOS = (platform: PlatformOSType): platform is 'ios' => platform === 'ios';

export const NotificationService = {
  async configure() {
    if (isIOS(Platform.OS)) {
      try {
        const granted = await NotificationModule.requestPermission();
        console.log('Notification permission granted:', granted);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    } else {
      PushNotification.configure({
        onRegister: async (token) => {
          await AsyncStorage.setItem('pushToken', token.token);
        },
        onNotification: (notification) => {
          console.log('NOTIFICATION:', notification);
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: isIOS(Platform.OS),
      });

      this.createDefaultChannel();
    }
  },

  createDefaultChannel() {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'virtual-lab-default',
          channelName: 'Virtual Lab',
          channelDescription: 'Virtual Lab notification channel',
          importance: Importance.HIGH,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );
    }
  },

  async scheduleNotification(notification: ScheduledNotification) {
    if (Platform.OS === 'ios') {
      try {
        await NotificationModule.scheduleLocalNotification(notification);
      } catch (error) {
        console.error('Error scheduling iOS notification:', error);
      }
    } else {
      PushNotification.localNotificationSchedule({
        channelId: 'virtual-lab-default',
        title: notification.title,
        message: notification.message,
        date: new Date(notification.timestamp),
        allowWhileIdle: true,
        userInfo: notification.data,
      });
    }

    await this.saveScheduledNotification(notification);
  },

  async saveScheduledNotification(notification: ScheduledNotification) {
    try {
      const existingNotifications = await this.getScheduledNotifications();
      existingNotifications.push(notification);
      await AsyncStorage.setItem(
        'scheduledNotifications',
        JSON.stringify(existingNotifications)
      );
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  },

  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const notifications = await AsyncStorage.getItem('scheduledNotifications');
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  async cancelAllNotifications() {
    if (Platform.OS === 'ios') {
      try {
        await NotificationModule.cancelAllNotifications();
      } catch (error) {
        console.error('Error canceling iOS notifications:', error);
      }
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
    await AsyncStorage.removeItem('scheduledNotifications');
  },

  // Metode helper untuk notifikasi spesifik
  async notifyAchievement(achievement: string) {
    const notification = {
      id: `achievement_${Date.now()}`,
      title: 'Selamat! 🎉',
      message: `Anda telah mencapai ${achievement}`,
      timestamp: Date.now(),
      data: { type: 'achievement' }
    };
    
    await this.scheduleNotification(notification);
  },

  async notifyNewQuiz(quizData: any) {
    const notification = {
      id: `quiz_${Date.now()}`,
      title: 'Quiz Baru Tersedia!',
      message: `Quiz baru tentang ${quizData.topic} telah tersedia. Uji pemahaman Anda sekarang!`,
      timestamp: Date.now(),
      data: { type: 'quiz', quizData }
    };
    
    await this.scheduleNotification(notification);
  },

  async requestPermission(): Promise<boolean> {
    if (isIOS(Platform.OS)) {
      try {
        return await NotificationModule.requestPermission();
      } catch (error) {
        console.error('Error requesting iOS notification permission:', error);
        return false;
      }
    } else {
      // Android permissions are handled in configure()
      return true;
    }
  },
};