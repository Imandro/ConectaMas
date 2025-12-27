import { Tabs, router } from 'expo-router';
import React from 'react';
import { Home, BookOpen, Book, Users, Heart, AlertCircle, User } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'dark'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: '#9BA1A6',
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'dark'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'dark'].text,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'dark'].background,
          borderTopColor: '#2C3E50',
          height: 60,
          paddingBottom: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={{ marginRight: 20 }}
            >
              <User size={24} color={tintColor} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="devotionals"
        options={{
          title: 'Devocionales',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: 'Biblia',
          tabBarIcon: ({ color }) => <Book size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forums"
        options={{
          title: 'Comunidad',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color }) => <AlertCircle size={24} color="#FF4444" />,
        }}
      />
    </Tabs>
  );
}
