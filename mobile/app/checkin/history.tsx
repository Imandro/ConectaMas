import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Calendar, Smile, Meh, Frown, Heart } from 'lucide-react-native';
import client from '@/api/client';

const MOOD_ICONS: any = {
    'Mal': { icon: <Frown size={20} color="#E74C1C" />, color: '#E74C1C' },
    'Regular': { icon: <Meh size={20} color="#F39C12" />, color: '#F39C12' },
    'Bien': { icon: <Smile size={20} color="#2ECC71" />, color: '#2ECC71' },
    'Excelente': { icon: <Heart size={20} color="#E91E63" />, color: '#E91E63' },
};

export default function CheckinHistoryScreen() {
    const [checkins, setCheckins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const response = await client.get('/checkin/history');
            setCheckins(response.data.checkins || []);
        } catch (error) {
            console.error('Error fetching checkin history:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Mi Seguimiento',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#0B1B32" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: '#0B1B32',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.infoCard}>
                    <Calendar size={20} color="#f3b33e" />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>Registro Mensual</Text>
                        <Text style={styles.infoSubtitle}>Aquí puedes ver tus registros históricos de este mes.</Text>
                    </View>
                </View>

                {loading && !refreshing ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#f3b33e" />
                        <Text style={styles.loadingText}>Cargando historial...</Text>
                    </View>
                ) : checkins.length === 0 ? (
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>Aún no tienes registros este mes.</Text>
                        <TouchableOpacity style={styles.startBtn} onPress={() => router.back()}>
                            <Text style={styles.startBtnText}>Hacer mi primer check-in</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.timeline}>
                        {checkins.map((item, index) => {
                            const moodInfo = MOOD_ICONS[item.mood] || MOOD_ICONS['Bien'];
                            const date = new Date(item.createdAt);
                            const formattedDate = date.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'short'
                            });

                            return (
                                <View key={item.id} style={styles.timelineItem}>
                                    <View style={styles.timelineSidebar}>
                                        <View style={[styles.dot, { backgroundColor: moodInfo.color }]} />
                                        {index < checkins.length - 1 && <View style={styles.line} />}
                                    </View>
                                    <View style={styles.card}>
                                        <View style={styles.cardHeader}>
                                            <View style={styles.moodBadge}>
                                                {moodInfo.icon}
                                                <Text style={[styles.moodLabel, { color: moodInfo.color }]}>{item.mood}</Text>
                                            </View>
                                            <Text style={styles.dateText}>{formattedDate}</Text>
                                        </View>
                                        {item.note && (
                                            <Text style={styles.noteText}>"{item.note}"</Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    backButton: {
        marginLeft: 8,
    },
    content: {
        padding: 20,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    infoSubtitle: {
        fontSize: 12,
        color: '#9BA1A6',
        marginTop: 2,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    loadingText: {
        marginTop: 12,
        color: '#9BA1A6',
    },
    emptyText: {
        color: '#9BA1A6',
        fontSize: 14,
        marginBottom: 20,
    },
    startBtn: {
        backgroundColor: '#0B1B32',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    startBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    timeline: {
        paddingLeft: 4,
    },
    timelineItem: {
        flexDirection: 'row',
    },
    timelineSidebar: {
        width: 24,
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 10,
        zIndex: 2,
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: '#E9ECEF',
        marginTop: -10,
    },
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        marginLeft: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    moodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    moodLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 11,
        color: '#9BA1A6',
    },
    noteText: {
        fontSize: 13,
        color: '#687076',
        fontStyle: 'italic',
        lineHeight: 18,
    }
});
