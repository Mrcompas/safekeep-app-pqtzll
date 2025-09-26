
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setupErrorLogging } from '../utils/errorLogger';
import { Platform, View, Text } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { Tabs, useGlobalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { requestNotificationPermissions } from '../utils/notifications';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = 'safekeep_data';

function TabBarIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return <Ionicons size={24} name={name} color={color} />;
}

function SafeKeepHeader() {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
        marginLeft: 8,
      }}>
        🛡️ SafeKeep
      </Text>
    </View>
  );
}

export default function RootLayout() {
  const [emulate, setEmulate] = useState(false);
  const params = useGlobalSearchParams();

  useEffect(() => {
    if (params.emulate === 'true') {
      setEmulate(true);
    }
    
    setupErrorLogging();
    requestNotificationPermissions();
  }, [params.emulate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.text,
            tabBarStyle: {
              backgroundColor: colors.background,
              borderTopColor: colors.grey,
              borderTopWidth: 1,
              paddingTop: 8,
              paddingBottom: Platform.OS === 'ios' ? 20 : 8,
              height: Platform.OS === 'ios' ? 88 : 68,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginTop: 4,
            },
            headerStyle: {
              backgroundColor: colors.background,
              borderBottomColor: colors.grey,
              borderBottomWidth: 1,
            },
            headerTitleStyle: {
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
            },
            headerTitle: () => <SafeKeepHeader />,
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
            name="dashboard"
            options={{
              title: 'Analytics',
              tabBarIcon: ({ color }) => <TabBarIcon name="analytics" color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
            }}
          />
          
          {/* Hidden screens */}
          <Tabs.Screen
            name="add-item"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="item/[id]"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="edit-item/[id]"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="auth/login"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="auth/signup"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="welcome"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
