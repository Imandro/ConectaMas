import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { LlamiMascot } from '@/components/LlamiMascot';
import { DailyVerseCard } from '@/components/DailyVerseCard';
import { DailyPrayerCard } from '@/components/DailyPrayerCard';
import { SupportFundingCard } from '@/components/SupportFundingCard';
import { Sun, AlertCircle, ShieldAlert, ChevronRight, HelpCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import client from '@/api/client';

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState("");
  const [stats, setStats] = useState<any>({ streak: 0, mascot: null });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await client.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  useEffect(() => {
    const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    setCurrentDate(date);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 24) + 10 }
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{currentDate}</Text>
          <ThemedText type="title" style={styles.userName}>Hola, {user?.name?.split(' ')[0] || 'Guerrero'}</ThemedText>
        </View>
        <TouchableOpacity
          style={styles.profileCircle}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.profileInitial}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <DailyVerseCard />
      </View>

      <View style={styles.statsSOSRow}>
        <View style={styles.streakCard}>
          <View style={styles.streakInfo}>
            <View style={styles.streakIconContainer}>
              <Sun size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={styles.streakLabel}>Días en victoria</Text>
              <Text style={styles.streakValue}>{stats?.streak || 0} Días</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => { }}
            style={styles.mascotContainer}
          >
            <LlamiMascot
              streak={stats?.streak || 0}
              level={stats?.mascot?.level || 1}
              name={stats?.mascot?.name}
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Nivel {stats?.mascot?.level || 1}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => router.push('/sos')}
        >
          <AlertCircle size={32} color="white" />
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.followUpCard}
        onPress={() => router.push('/checkin')}
      >
        <View style={styles.followUpHeader}>
          <View style={styles.followUpIconTitle}>
            <View style={styles.followUpIcon}>
              <ShieldAlert size={24} color="#0B1B32" />
            </View>
            <View>
              <Text style={styles.followUpTitle}>Mi Seguimiento</Text>
              <Text style={styles.followUpSubtitle}>Gestiona tus planes</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9BA1A6" />
        </View>

        <View style={styles.followUpStats}>
          <View style={styles.followUpStat}>
            <Text style={styles.followUpStatValue}>{stats?.struggles?.length || 0}</Text>
            <Text style={styles.followUpStatLabel}>ACTIVOS</Text>
          </View>
          <View style={[styles.followUpStat, styles.followUpStatBorder]}>
            <Text style={styles.followUpStatValue}>
              {stats?.struggles?.filter((s: any) => s.currentDay >= 7).length || 0}
            </Text>
            <Text style={styles.followUpStatLabel}>COMPLETADOS</Text>
          </View>
        </View>
        <View style={styles.decorativeBar} />
      </TouchableOpacity>

      <View style={styles.section}>
        <DailyPrayerCard />
      </View>

      <View style={styles.checkinSection}>
        <Text style={styles.sectionHeading}>Tu corazón hoy</Text>
        <View style={styles.checkinCard}>
          <Text style={styles.checkinQuestion}>¿Cómo te sientes en este momento?</Text>
          <View style={styles.emojiRow}>
            {['😔', '😐', '🙂', '😄', '🙌'].map((emoji, idx) => (
              <TouchableOpacity key={idx} style={styles.emojiButton} onPress={() => router.push('/checkin')}>
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SupportFundingCard />
      </View>

      <View style={{ height: insets.bottom + 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
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
    fontWeight: 'bold',
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B1B32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  statsSOSRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  streakCard: {
    flex: 2,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  streakInfo: {
    flex: 1,
  },
  streakIconContainer: {
    backgroundColor: '#E8F5E9',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 10,
    color: '#9BA1A6',
    fontWeight: '600',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B1B32',
  },
  mascotContainer: {
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  levelText: {
    fontSize: 9,
    color: '#0B1B32',
    fontWeight: 'bold',
  },
  sosButton: {
    flex: 1,
    backgroundColor: '#FF4444',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    paddingVertical: 12,
  },
  sosText: {
    color: 'white',
    fontWeight: '900',
    marginTop: 4,
    fontSize: 12,
  },
  followUpCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  followUpHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followUpIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  followUpIcon: {
    backgroundColor: '#F0F4F8',
    padding: 12,
    borderRadius: 16,
  },
  followUpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1B32',
  },
  followUpSubtitle: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  followUpStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  followUpStat: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  followUpStatBorder: {
    // borderLeftWidth: 1,
    // borderLeftColor: '#F1F3F5',
  },
  followUpStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B1B32',
  },
  followUpStatLabel: {
    fontSize: 9,
    color: '#9BA1A6',
    fontWeight: 'bold',
    marginTop: 2,
  },
  decorativeBar: {
    height: 4,
    backgroundColor: '#0B1B32',
    width: '100%',
  },
  checkinSection: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1B32',
    marginBottom: 12,
    marginLeft: 4,
  },
  checkinCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  checkinQuestion: {
    color: '#9BA1A6',
    fontSize: 14,
    marginBottom: 24,
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
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  emojiText: {
    fontSize: 24,
  }
});

