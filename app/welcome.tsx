
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function WelcomeScreen() {
  console.log('WelcomeScreen rendered');

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView 
        style={commonStyles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ alignItems: 'center', paddingTop: 40 }}>
          {/* Logo/Icon */}
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}>
            <Icon name="shield-checkmark" size={60} color={colors.background} />
          </View>

          {/* Welcome Text */}
          <Text style={[commonStyles.title, { textAlign: 'center', marginBottom: 16 }]}>
            Welcome to SafeKeep
          </Text>
          
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 48, lineHeight: 24 }]}>
            Your reliable warranty tracking companion.{'\n'}
            Never lose track of your product warranties again.
          </Text>

          {/* Features */}
          <View style={{ width: '100%', marginBottom: 48 }}>
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
                <Icon name="camera" size={24} color={colors.primary} />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
                    Capture Receipts
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    Take photos of your receipts to keep proof of purchase
                  </Text>
                </View>
              </View>
            </View>

            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
                <Icon name="notifications" size={24} color={colors.accent} />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
                    Smart Reminders
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    Get notified 30 days before your warranties expire
                  </Text>
                </View>
              </View>
            </View>

            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
                <Icon name="cloud" size={24} color={colors.warning} />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
                    Sync Across Devices
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    Create an account to access your data anywhere
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ width: '100%', gap: 16 }}>
            <Button
              text="Create Account"
              onPress={() => router.push('/auth/signup')}
              style={buttonStyles.primary}
              textStyle={buttonStyles.text}
            />

            <Button
              text="Sign In"
              onPress={() => router.push('/auth/login')}
              style={buttonStyles.secondary}
              textStyle={buttonStyles.textSecondary}
            />

            <TouchableOpacity
              style={{ marginTop: 16, alignItems: 'center' }}
              onPress={() => router.replace('/')}
            >
              <Text style={[commonStyles.textSecondary, { textDecorationLine: 'underline' }]}>
                Continue without account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
