import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { LlamiMascot } from '@/components/LlamiMascot';
import { DailyVerseCard } from '@/components/DailyVerseCard';
import { DailyPrayerCard } from '@/components/DailyPrayerCard';
import { SupportFundingCard } from '@/components/SupportFundingCard';
import { Sun, AlertCircle, ShieldAlert, ChevronRight, HelpCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    setCurrentDate(date);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{currentDate}</Text>
          <ThemedText type="title" style={styles.userName}>Hola, {user?.name?.split(' ')[0] || 'Guerrero'}</ThemedText>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <HelpCircle size={28} color="#f3b33e" />
        </TouchableOpacity>
      </View>

      <DailyVerseCard />

      <View style={styles.statsSOSRow}>
        <View style={styles.streakCard}>
          <View style={styles.streakInfo}>
            <View style={styles.streakIconContainer}>
              <Sun size={24} color="#2ECC71" />
            </View>
            <View>
              <Text style={styles.streakLabel}>Días en victoria</Text>
              <Text style={styles.streakValue}>5 Días</Text>
            </View>
          </View>

          <LlamiMascot streak={5} level={1} />
        </View>

        <TouchableOpacity style={styles.sosButton}>
          <AlertCircle size={36} color="white" />
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIcon}>
            <ShieldAlert size={20} color="#f3b33e" />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Mi Seguimiento</Text>
            <Text style={styles.sectionSubtitle}>Gestiona tus planes de transformación</Text>
          </View>
        </View>
        <TouchableOpacity>
          <ChevronRight size={20} color="#9BA1A6" />
        </TouchableOpacity>
      </View>

      <View style={styles.struggleSummary}>
        <View style={styles.struggleStat}>
          <Text style={styles.struggleStatValue}>1</Text>
          <Text style={styles.struggleStatLabel}>EN PROGRESO</Text>
        </View>
        <View style={[styles.struggleStat, styles.struggleStatBorder]}>
          <Text style={styles.struggleStatValue}>0</Text>
          <Text style={styles.struggleStatLabel}>PRÓXIMOS</Text>
        </View>
      </View>

      <DailyPrayerCard />

      <View style={styles.checkinSection}>
        <Text style={styles.checkinTitle}>Tu corazón hoy</Text>
        <View style={styles.checkinCard}>
          <Text style={styles.checkinQuestion}>¿Cómo te sientes en este momento?</Text>
          <View style={styles.emojiRow}>
            {['😔', '😐', '🙂', '😄', '🙌'].map((emoji, idx) => (
              <TouchableOpacity key={idx} style={styles.emojiButton}>
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <SupportFundingCard />

      <View style={styles.footerSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // El fondo del dashboard es blanco en el web? No, el web tiene fondo gris claro f8f9fa
  },
  content: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateText: {
    fontSize: 12,
    color: '#9BA1A6',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  userName: {
    color: '#0B1B32',
    fontSize: 28,
  },
  helpButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsSOSRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    height: 120,
  },
  streakCard: {
    flex: 2,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  streakInfo: {
    flex: 1,
  },
  streakIconContainer: {
    backgroundColor: '#E8F5E9',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 10,
    color: '#9BA1A6',
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1B32',
  },
  sosButton: {
    flex: 1,
    backgroundColor: '#FF4444',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sosText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    backgroundColor: 'rgba(11, 27, 50, 0.05)',
    padding: 10,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1B32',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#9BA1A6',
  },
  struggleSummary: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  struggleStat: {
    flex: 1,
    alignItems: 'center',
  },
  struggleStatBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F3F5',
  },
  struggleStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B1B32',
  },
  struggleStatLabel: {
    fontSize: 9,
    color: '#9BA1A6',
    fontWeight: 'bold',
    marginTop: 4,
  },
  checkinSection: {
    marginBottom: 24,
  },
  checkinTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1B32',
    marginBottom: 12,
  },
  checkinCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  checkinQuestion: {
    color: '#9BA1A6',
    marginBottom: 20,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  emojiButton: {
    backgroundColor: '#F8F9FA',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  footerSpace: {
    height: 40,
  }
});

