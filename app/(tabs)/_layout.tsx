import { Tabs } from 'expo-router';
import React from 'react';
import { Home } from '@tamagui/lucide-icons';

import { useTheme } from 'tamagui';
import { HapticTab } from '@/components/HapticTab';
import { AuthGuard } from '@/components/AuthGuard';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: theme.background?.val,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 60,
            paddingBottom: 8,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarActiveTintColor: theme.accentColor?.val,
          tabBarInactiveTintColor: theme.accentBackground?.val,
          tabBarButton: HapticTab,

        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}