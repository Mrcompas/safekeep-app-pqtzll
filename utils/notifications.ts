
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, NotificationSettings } from '../types/item';

const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';
const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

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
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('warranty-alerts', {
        name: 'Warranty Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.log('Error requesting notification permissions:', error);
    return false;
  }
};

export const getNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.log('Error getting notifications enabled:', error);
    return false;
  }
};

export const setNotificationsEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled.toString());
  } catch (error) {
    console.log('Error setting notifications enabled:', error);
  }
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (settings) {
      return JSON.parse(settings);
    }
    // Default settings
    return {
      enabled: true,
      thirtyDayAlert: true,
      sevenDayAlert: true,
      expirationDayAlert: true,
    };
  } catch (error) {
    console.log('Error getting notification settings:', error);
    return {
      enabled: true,
      thirtyDayAlert: true,
      sevenDayAlert: true,
      expirationDayAlert: true,
    };
  }
};

export const setNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.log('Error setting notification settings:', error);
  }
};

export const scheduleWarrantyNotification = async (item: Item): Promise<void> => {
  try {
    const settings = await getNotificationSettings();
    if (!settings.enabled) {
      return;
    }

    const purchaseDate = new Date(item.purchaseDate);
    const expirationDate = new Date(purchaseDate);
    expirationDate.setMonth(expirationDate.getMonth() + item.warrantyLength);

    const now = new Date();

    // Cancel existing notifications for this item
    await cancelWarrantyNotification(item.id);

    // Schedule 30-day notification
    if (settings.thirtyDayAlert) {
      const thirtyDaysBefore = new Date(expirationDate);
      thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 30);

      if (thirtyDaysBefore > now) {
        await Notifications.scheduleNotificationAsync({
          identifier: `${item.id}_30days`,
          content: {
            title: '⚠️ Warranty Expiring Soon',
            body: `${item.productName} warranty expires in 30 days`,
            data: { itemId: item.id, type: '30days' },
          },
          trigger: {
            date: thirtyDaysBefore,
          },
        });
      }
    }

    // Schedule 7-day notification
    if (settings.sevenDayAlert) {
      const sevenDaysBefore = new Date(expirationDate);
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);

      if (sevenDaysBefore > now) {
        await Notifications.scheduleNotificationAsync({
          identifier: `${item.id}_7days`,
          content: {
            title: '🚨 Warranty Expiring This Week',
            body: `${item.productName} warranty expires in 7 days`,
            data: { itemId: item.id, type: '7days' },
          },
          trigger: {
            date: sevenDaysBefore,
          },
        });
      }
    }

    // Schedule expiration day notification
    if (settings.expirationDayAlert) {
      if (expirationDate > now) {
        await Notifications.scheduleNotificationAsync({
          identifier: `${item.id}_expiry`,
          content: {
            title: '❌ Warranty Expired',
            body: `${item.productName} warranty has expired today`,
            data: { itemId: item.id, type: 'expiry' },
          },
          trigger: {
            date: expirationDate,
          },
        });
      }
    }

    console.log('Scheduled notifications for item:', item.productName);
  } catch (error) {
    console.log('Error scheduling warranty notification:', error);
  }
};

export const cancelWarrantyNotification = async (itemId: string): Promise<void> => {
  try {
    const identifiers = [
      `${itemId}_30days`,
      `${itemId}_7days`,
      `${itemId}_expiry`,
    ];
    
    // Use the correct method name for canceling multiple notifications
    for (const identifier of identifiers) {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    }
    
    console.log('Cancelled notifications for item:', itemId);
  } catch (error) {
    console.log('Error cancelling warranty notification:', error);
  }
};

export const snoozeNotification = async (itemId: string, type: string, hours: number = 24): Promise<void> => {
  try {
    const snoozeDate = new Date();
    snoozeDate.setHours(snoozeDate.getHours() + hours);

    await Notifications.scheduleNotificationAsync({
      identifier: `${itemId}_${type}_snooze`,
      content: {
        title: '🔔 Warranty Reminder (Snoozed)',
        body: `Don't forget about your ${type} warranty reminder`,
        data: { itemId, type: `${type}_snooze` },
      },
      trigger: {
        date: snoozeDate,
      },
    });

    console.log(`Snoozed notification for ${hours} hours`);
  } catch (error) {
    console.log('Error snoozing notification:', error);
  }
};

export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.log('Error getting scheduled notifications:', error);
    return [];
  }
};

export const rescheduleAllNotifications = async (items: Item[]): Promise<void> => {
  try {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Reschedule for all items
    for (const item of items) {
      await scheduleWarrantyNotification(item);
    }
    
    console.log('Rescheduled all notifications');
  } catch (error) {
    console.log('Error rescheduling notifications:', error);
  }
};
