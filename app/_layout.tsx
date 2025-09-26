
import { Tabs, useGlobalSearchParams } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';

const STORAGE_KEY = 'emulated_device';

function TabBarIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return <Ionicons size={24} name={name} color={color} />;
}

function SafeKeepHeader() {
  return (
    <View style={commonStyles.header}>
      <Text style={commonStyles.logo}>SafeKeep</Text>
    </View>
  );
}

export default function RootLayout() {
  const { emulate } = useGlobalSearchParams<{ emulate?: string }>();
  const [storedEmulate, setStoredEmulate] = useState<string | null>(null);

  useEffect(() => {
    // Set up global error logging
    setupErrorLogging();

    if (Platform.OS === 'web') {
      // If there's a new emulate parameter, store it
      if (emulate) {
        localStorage.setItem(STORAGE_KEY, emulate);
        setStoredEmulate(emulate);
      } else {
        // If no emulate parameter, try to get from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setStoredEmulate(stored);
        }
      }
    }
  }, [emulate]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeKeepHeader />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              backgroundColor: colors.tabBar,
              borderTopColor: colors.tabBarBorder,
              borderTopWidth: 1,
              paddingTop: 8,
              paddingBottom: Platform.OS === 'ios' ? 20 : 8,
              height: Platform.OS === 'ios' ? 88 : 64,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginTop: 4,
            },
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
        </Tabs>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
