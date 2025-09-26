
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors } from '../styles/commonStyles';
import { 
  getNotificationsEnabled, 
  setNotificationsEnabled, 
  requestNotificationPermissions,
  getScheduledNotifications 
} from '../utils/notifications';
import { useAuth } from '../hooks/useAuth';
import { router } from 'expo-router';
import Icon from '../components/Icon';

export default function SettingsScreen() {
  console.log('SettingsScreen rendered');

  const { authState, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const enabled = await getNotificationsEnabled();
      setNotificationsEnabledState(enabled);
      
      const scheduled = await getScheduledNotifications();
      setScheduledCount(scheduled.length);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    try {
      if (value) {
        // Request permissions when enabling
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive warranty reminders.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      await setNotificationsEnabled(value);
      setNotificationsEnabledState(value);
      
      // Refresh scheduled count
      const scheduled = await getScheduledNotifications();
      setScheduledCount(scheduled.length);

      console.log('Notifications toggled:', value);
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your data will remain on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Signed Out', 'You have been signed out successfully.');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderSettingCard = (
    iconName: string,
    title: string,
    description: string,
    iconColor: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => {
    const CardComponent = onPress ? TouchableOpacity : View;
    
    return (
      <CardComponent 
        style={[commonStyles.card, { width: '100%' }]}
        onPress={onPress}
      >
        <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Icon name={iconName} size={24} color={iconColor} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
                {title}
              </Text>
              <Text style={commonStyles.textSecondary}>
                {description}
              </Text>
            </View>
          </View>
          {rightComponent && (
            <View style={{ marginLeft: 12 }}>
              {rightComponent}
            </View>
          )}
        </View>
      </CardComponent>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={commonStyles.textSecondary}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 40 }}>
          <Text style={[commonStyles.title, { marginBottom: 8 }]}>
            Settings
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 32 }]}>
            Customize your SafeKeep experience and manage your preferences.
          </Text>

          {/* Account Section */}
          {authState.isAuthenticated && authState.user ? (
            <>
              <Text style={[commonStyles.subtitle, { marginBottom: 16, color: colors.textSecondary }]}>
                Account
              </Text>
              
              {renderSettingCard(
                'person-circle',
                'Signed in as',
                authState.user.email,
                colors.primary
              )}

              {renderSettingCard(
                'log-out',
                'Sign Out',
                'Sign out of your SafeKeep account',
                colors.error,
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />,
                handleLogout
              )}
            </>
          ) : (
            <>
              <Text style={[commonStyles.subtitle, { marginBottom: 16, color: colors.textSecondary }]}>
                Account
              </Text>
              
              {renderSettingCard(
                'person-add',
                'Create Account',
                'Sign up to sync your data across devices',
                colors.primary,
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />,
                () => router.push('/auth/signup')
              )}

              {renderSettingCard(
                'log-in',
                'Sign In',
                'Sign in to your existing SafeKeep account',
                colors.accent,
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />,
                () => router.push('/auth/login')
              )}
            </>
          )}

          {/* Notifications Section */}
          <Text style={[commonStyles.subtitle, { marginBottom: 16, color: colors.textSecondary }]}>
            Notifications
          </Text>
          
          {renderSettingCard(
            'notifications',
            'Warranty Reminders',
            notificationsEnabled 
              ? `Get notified 30 days before warranties expire. ${scheduledCount} reminder${scheduledCount !== 1 ? 's' : ''} scheduled.`
              : 'Enable notifications to get reminded before warranties expire.',
            notificationsEnabled ? colors.primary : colors.textSecondary,
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.grey, true: colors.primary }}
              thumbColor={colors.background}
            />
          )}

          {/* App Information Section */}
          <Text style={[commonStyles.subtitle, { marginTop: 32, marginBottom: 16, color: colors.textSecondary }]}>
            Information
          </Text>

          {renderSettingCard(
            'shield-checkmark',
            'About SafeKeep',
            'Version 1.0.0 - Your reliable warranty tracking companion.',
            colors.accent
          )}

          {renderSettingCard(
            'help-circle',
            'Help & Support',
            'Get help with using SafeKeep and managing your warranties.',
            colors.warning,
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />,
            () => {
              Alert.alert(
                'Help & Support',
                'For support, please contact us at support@safekeep.app or visit our help center.',
                [{ text: 'OK' }]
              );
            }
          )}

          {/* Future Features Section */}
          <Text style={[commonStyles.subtitle, { marginTop: 32, marginBottom: 16, color: colors.textSecondary }]}>
            Coming Soon
          </Text>

          {renderSettingCard(
            'cloud',
            'Backup & Sync',
            'Keep your warranty data safe with cloud backup and sync across devices.',
            colors.textSecondary
          )}

          {renderSettingCard(
            'star',
            'Premium Features',
            'Unlock advanced features like unlimited storage, export options, and priority support.',
            colors.textSecondary
          )}

          {renderSettingCard(
            'document-text',
            'Receipt Scanning',
            'Automatically extract warranty information from receipt photos using AI.',
            colors.textSecondary
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
