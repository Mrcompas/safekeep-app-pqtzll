
import { commonStyles, colors } from '../styles/commonStyles';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { router } from 'expo-router';
import { 
  getNotificationSettings, 
  setNotificationSettings,
  requestNotificationPermissions,
  getScheduledNotifications,
  rescheduleAllNotifications
} from '../utils/notifications';
import { exportToCSV, exportToPDF, shareExportFile, createBackup } from '../utils/backup';
import { useWarrantyItems } from '../hooks/useWarrantyItems';
import { NotificationSettings, SuggestedItem } from '../types/item';
import Icon from '../components/Icon';
import EmailReceiptParser from '../components/EmailReceiptParser';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [notificationSettings, setNotificationSettingsState] = useState<NotificationSettings>({
    enabled: true,
    thirtyDayAlert: true,
    sevenDayAlert: true,
    expirationDayAlert: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [showEmailParser, setShowEmailParser] = useState(false);
  
  const { user, logout } = useAuth();
  const { items, addItem } = useWarrantyItems();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      setNotificationSettingsState(settings);
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const handleNotificationToggle = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      if (key === 'enabled' && value) {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive warranty alerts.'
          );
          return;
        }
      }

      const newSettings = { ...notificationSettings, [key]: value };
      setNotificationSettingsState(newSettings);
      await setNotificationSettings(newSettings);

      // Reschedule all notifications with new settings
      if (key !== 'enabled' || value) {
        await rescheduleAllNotifications(items);
      }

      console.log('Updated notification settings:', newSettings);
    } catch (error) {
      console.log('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleEmailItemsSelected = async (suggestedItems: SuggestedItem[]) => {
    try {
      for (const suggestedItem of suggestedItems) {
        const newItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          productName: suggestedItem.productName,
          purchaseDate: suggestedItem.purchaseDate,
          warrantyLength: suggestedItem.warrantyLength,
          storeName: suggestedItem.storeName,
          userId: user?.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          price: suggestedItem.price,
        };
        
        await addItem(newItem);
      }
      
      Alert.alert(
        'Success', 
        `Added ${suggestedItems.length} item${suggestedItems.length > 1 ? 's' : ''} from email receipts!`
      );
    } catch (error) {
      console.log('Error adding email items:', error);
      Alert.alert('Error', 'Failed to add items from email receipts');
    }
  };

  const handleExportCSV = async () => {
    if (items.length === 0) {
      Alert.alert('No Data', 'You don\'t have any items to export yet.');
      return;
    }

    setIsExporting(true);
    try {
      const fileUri = await exportToCSV(items);
      await shareExportFile(fileUri);
    } catch (error) {
      console.log('Error exporting CSV:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (items.length === 0) {
      Alert.alert('No Data', 'You don\'t have any items to export yet.');
      return;
    }

    setIsExporting(true);
    try {
      const fileUri = await exportToPDF(items);
      await shareExportFile(fileUri);
    } catch (error) {
      console.log('Error exporting PDF:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackupNow = async () => {
    if (items.length === 0) {
      Alert.alert('No Data', 'You don\'t have any items to backup yet.');
      return;
    }

    setIsBackingUp(true);
    try {
      await createBackup(items);
      Alert.alert('Success', 'Backup created successfully!');
    } catch (error) {
      console.log('Error creating backup:', error);
      Alert.alert('Error', 'Failed to create backup. Please try again.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/welcome');
          }
        }
      ]
    );
  };

  const renderSettingCard = (iconName: string, title: string, description: string, iconColor: string) => (
    <View style={styles.settingCard}>
      <View style={styles.settingIcon}>
        <Icon name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
    </View>
  );

  const renderSwitchSetting = (
    iconName: string, 
    title: string, 
    description: string, 
    iconColor: string,
    value: boolean,
    onToggle: (value: boolean) => void,
    disabled: boolean = false
  ) => (
    <View style={[styles.settingCard, disabled && styles.disabledSetting]}>
      <View style={styles.settingIcon}>
        <Icon name={iconName} size={24} color={disabled ? colors.textSecondary : iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, disabled && styles.disabledText]}>{title}</Text>
        <Text style={[styles.settingDescription, disabled && styles.disabledText]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: colors.grey, true: colors.primary + '40' }}
        thumbColor={value ? colors.primary : colors.background}
      />
    </View>
  );

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.title, { marginBottom: 24 }]}>Settings</Text>

          {/* User Info */}
          {user && (
            <View style={styles.userCard}>
              <View style={styles.userIcon}>
                <Icon name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.email}</Text>
                <Text style={styles.userStatus}>Signed in</Text>
              </View>
            </View>
          )}

          {/* Email Integration Section */}
          <Text style={styles.sectionTitle}>Email Integration</Text>
          
          <TouchableOpacity 
            style={styles.settingCard} 
            onPress={() => setShowEmailParser(true)}
          >
            <View style={styles.settingIcon}>
              <Icon name="mail" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Connect Email</Text>
              <Text style={styles.settingDescription}>Parse receipts from Gmail/Outlook</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Notifications Section */}
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {renderSwitchSetting(
            'notifications',
            'Enable Notifications',
            'Receive warranty expiration alerts',
            colors.primary,
            notificationSettings.enabled,
            (value) => handleNotificationToggle('enabled', value)
          )}

          {renderSwitchSetting(
            'time',
            '30-Day Alert',
            'Notify 30 days before expiration',
            colors.warning,
            notificationSettings.thirtyDayAlert,
            (value) => handleNotificationToggle('thirtyDayAlert', value),
            !notificationSettings.enabled
          )}

          {renderSwitchSetting(
            'warning',
            '7-Day Alert',
            'Notify 7 days before expiration',
            colors.warning,
            notificationSettings.sevenDayAlert,
            (value) => handleNotificationToggle('sevenDayAlert', value),
            !notificationSettings.enabled
          )}

          {renderSwitchSetting(
            'alert-circle',
            'Expiration Day Alert',
            'Notify on the day warranty expires',
            colors.error,
            notificationSettings.expirationDayAlert,
            (value) => handleNotificationToggle('expirationDayAlert', value),
            !notificationSettings.enabled
          )}

          {/* Export & Backup Section */}
          <Text style={styles.sectionTitle}>Export & Backup</Text>

          <TouchableOpacity 
            style={styles.settingCard} 
            onPress={handleExportCSV}
            disabled={isExporting}
          >
            <View style={styles.settingIcon}>
              <Icon name="document-text" size={24} color={colors.success} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export to CSV</Text>
              <Text style={styles.settingDescription}>
                {isExporting ? 'Exporting...' : 'Export your data as a spreadsheet'}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingCard} 
            onPress={handleExportPDF}
            disabled={isExporting}
          >
            <View style={styles.settingIcon}>
              <Icon name="document" size={24} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export to PDF</Text>
              <Text style={styles.settingDescription}>
                {isExporting ? 'Exporting...' : 'Export your data as a PDF report'}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingCard} 
            onPress={handleBackupNow}
            disabled={isBackingUp}
          >
            <View style={styles.settingIcon}>
              <Icon name="cloud-upload" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Backup Now</Text>
              <Text style={styles.settingDescription}>
                {isBackingUp ? 'Creating backup...' : 'Create a backup of your data'}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Analytics */}
          <Text style={styles.sectionTitle}>Analytics</Text>
          
          <TouchableOpacity 
            style={styles.settingCard} 
            onPress={() => router.push('/dashboard')}
          >
            <View style={styles.settingIcon}>
              <Icon name="analytics" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>View Dashboard</Text>
              <Text style={styles.settingDescription}>See insights about your warranties</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Account Section */}
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingCard} onPress={handleLogout}>
            <View style={styles.settingIcon}>
              <Icon name="log-out" size={24} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.error }]}>Logout</Text>
              <Text style={styles.settingDescription}>Sign out of your account</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EmailReceiptParser
        visible={showEmailParser}
        onClose={() => setShowEmailParser(false)}
        onItemsSelected={handleEmailItemsSelected}
      />
    </SafeAreaView>
  );
}

const styles = {
  userCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  userStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 16,
    marginTop: 24,
  },
  settingCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledSetting: {
    opacity: 0.5,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grey + '30',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  disabledText: {
    color: colors.textSecondary,
  },
};
