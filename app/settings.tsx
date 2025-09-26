
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

export default function SettingsScreen() {
  console.log('SettingsScreen rendered');

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.emptyState}>
          <Icon 
            name="settings" 
            size={80} 
            color={colors.textSecondary}
            style={{ marginBottom: 24 }}
          />
          <Text style={commonStyles.emptyStateText}>
            Settings & Preferences
          </Text>
          <Text style={commonStyles.emptyStateSubtext}>
            Customize your SafeKeep experience and manage your account preferences.
          </Text>
          
          <View style={[commonStyles.card, { marginTop: 32, width: '100%' }]}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Icon name="notifications" size={24} color={colors.primary} />
              <Text style={[commonStyles.subtitle, { marginBottom: 0, marginLeft: 12 }]}>
                Notifications
              </Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Configure when and how you want to be reminded about expiring warranties.
            </Text>
          </View>

          <View style={[commonStyles.card, { width: '100%' }]}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Icon name="cloud" size={24} color={colors.accent} />
              <Text style={[commonStyles.subtitle, { marginBottom: 0, marginLeft: 12 }]}>
                Backup & Sync
              </Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Keep your warranty data safe with cloud backup and sync across devices.
            </Text>
          </View>

          <View style={[commonStyles.card, { width: '100%' }]}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Icon name="star" size={24} color={colors.warning} />
              <Text style={[commonStyles.subtitle, { marginBottom: 0, marginLeft: 12 }]}>
                Premium Features
              </Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Unlock advanced features like unlimited storage, export options, and priority support.
            </Text>
          </View>

          <View style={[commonStyles.card, { width: '100%' }]}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Icon name="information-circle" size={24} color={colors.textSecondary} />
              <Text style={[commonStyles.subtitle, { marginBottom: 0, marginLeft: 12 }]}>
                About SafeKeep
              </Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Version 1.0.0{'\n'}
              Your reliable warranty tracking companion.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
