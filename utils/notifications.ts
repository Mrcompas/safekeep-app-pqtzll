
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';

export const cancelWarrantyNotification = async (itemId: string): Promise<void> => {
  try {
    console.log('Canceling notification for item:', itemId);
    await Notifications.cancelScheduledNotificationAsync(itemId);
    console.log('Notification canceled successfully');
  } catch (error) {
    console.error('Error canceling notification:', error);
    throw error;
  }
};

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    console.log('Requesting notification permissions...');
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('warranty-alerts', {
        name: 'Warranty Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2196F3',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    console.log('Notification permission status:', finalStatus);
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleWarrantyNotification = async (
  itemId: string,
  productName: string,
  expirationDate: Date
): Promise<string | null> => {
  try {
    const notificationsEnabled = await getNotificationsEnabled();
    if (!notificationsEnabled) {
      console.log('Notifications disabled, skipping scheduling');
      return null;
    }

    // Calculate notification date (30 days before expiration)
    const notificationDate = new Date(expirationDate);
    notificationDate.setDate(notificationDate.getDate() - 30);

    // Don't schedule if notification date is in the past
    if (notificationDate <= new Date()) {
      console.log('Notification date is in the past, skipping');
      return null;
    }

    console.log(`Scheduling notification for ${productName} on ${notificationDate}`);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Warranty Expiring Soon',
        body: `⚠️ ${productName} warranty expires in 30 days`,
        data: { itemId, productName, type: 'warranty_expiring' },
        sound: true,
      },
      trigger: {
        date: notificationDate,
      },
    });

    console.log('Scheduled notification with ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Cancelled notification:', notificationId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all notifications');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

export const setNotificationsEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(enabled));
    console.log('Notifications enabled set to:', enabled);
    
    if (!enabled) {
      await cancelAllNotifications();
    }
  } catch (error) {
    console.error('Error setting notifications enabled:', error);
  }
};

export const getNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return value ? JSON.parse(value) : true; // Default to enabled
  } catch (error) {
    console.error('Error getting notifications enabled:', error);
    return true;
  }
};

export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', notifications.length);
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};
