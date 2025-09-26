
import { Platform, View, Text } from 'react-native';
import { setupErrorLogging } from '../utils/errorLogger';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { Tabs, useGlobalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { requestNotificationPermissions } from '../utils/notifications';

const STORAGE_KEY = 'emulate_device';

function TabBarIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}

function SafeKeepHeader() {
  return (
    <View style={commonStyles.header}>
      <Text style={commonStyles.logo}>SafeKeep</Text>
    </View>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { emulate } = useGlobalSearchParams();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing SafeKeep app...');
        
        // Setup error logging
        setupErrorLogging();
        
        // Request notification permissions on app start
        try {
          await requestNotificationPermissions();
          console.log('Notification permissions requested');
        } catch (error) {
          console.error('Error requesting notification permissions:', error);
        }
        
        console.log('App initialization complete');
      } catch (error) {
        console.error('Error during app initialization:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, [emulate]);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={commonStyles.logo}>SafeKeep</Text>
          <Text style={[commonStyles.textSecondary, { marginTop: 16 }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.text,
            tabBarStyle: {
              backgroundColor: colors.tabBar,
              borderTopColor: colors.tabBarBorder,
              borderTopWidth: 1,
              paddingTop: 8,
              paddingBottom: Platform.OS === 'ios' ? 20 : 8,
              height: Platform.OS === 'ios' ? 88 : 68,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginTop: 4,
            },
            header: () => <SafeKeepHeader />,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            }}
          />
          <Tabs.Screen
            name="add"
            options={{
              title: 'Add',
              tabBarIcon: ({ color }) => <TabBarIcon name="add-circle" color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
            }}
          />
          <Tabs.Screen
            name="add-item"
            options={{
              href: null, // Hide from tab bar
            }}
          />
          <Tabs.Screen
            name="item"
            options={{
              href: null, // Hide from tab bar
            }}
          />
          <Tabs.Screen
            name="edit-item"
            options={{
              href: null, // Hide from tab bar
            }}
          />
          <Tabs.Screen
            name="auth"
            options={{
              href: null, // Hide from tab bar
            }}
          />
          <Tabs.Screen
            name="welcome"
            options={{
              href: null, // Hide from tab bar
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
