import { Tabs, router } from 'expo-router';
import React from 'react';
import { Home, BookOpen, Book, Users, Heart, AlertCircle, User } from 'lucide-react-native';
import { View, Platform, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  // Forzamos el tema claro para que coincida con el dashboard web
  const tintColor = '#0B1B32';
  const inactiveColor = '#9BA1A6';
  const backgroundColor = '#FFFFFF';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false, // Ocultamos el header nativo para usar headers personalizados como en el web
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 4,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="devotionals"
        options={{
          title: 'Devocionales',
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: 'Biblia',
          tabBarIcon: ({ color }) => <Book size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forums"
        options={{
          title: 'Comunidad',
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => <Heart size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color }) => (
            <View style={styles.sosIconContainer}>
              <AlertCircle size={22} color="white" />
            </View>
          ),
          tabBarLabelStyle: {
            color: '#FF4444',
            fontWeight: 'bold',
            fontSize: 10,
            marginTop: 4,
          }
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sosIconContainer: {
    backgroundColor: '#FF4444',
    padding: 8,
    borderRadius: 14,
    marginTop: -4,
  }
});
