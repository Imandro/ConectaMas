import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BookHeart } from 'lucide-react-native';
import client from '@/api/client';

export const DailyPrayerCard = () => {
    const [prayer, setPrayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd fetch from API
        // For now, let's mock it to match the web's style
        const mockPrayer = {
            content: "Señor, hoy deposito mis cargas ante ti. Ayúdame a confiar en tu proceso y a caminar en fe, sabiendo que tú tienes el control de mi vida.",
            theme: "Confianza en Dios"
        };
        setPrayer(mockPrayer);
        setLoading(false);
    }, []);

    if (loading || !prayer) return null;

    return (
        <View style={styles.card}>
            {/* Soft Decorative Elements */}
            <View style={[styles.circle, styles.circleTopRight]} />
            <View style={[styles.circle, styles.circleBottomLeft]} />

            <View style={styles.header}>
                <BookHeart size={20} color="#0066CC" style={{ opacity: 0.7 }} />
                <Text style={styles.label}>Oración del Día</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.prayerText}>"{prayer.content}"</Text>
                {prayer.theme && (
                    <Text style={styles.themeBadge}>Enfoque: {prayer.theme}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F0F7FF', // Light blue to match the web gradient
        borderRadius: 24,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 102, 204, 0.1)',
    },
    circle: {
        position: 'absolute',
        borderRadius: 100,
    },
    circleTopRight: {
        width: 120,
        height: 120,
        backgroundColor: '#0066CC',
        opacity: 0.05,
        top: -20,
        right: -20,
    },
    circleBottomLeft: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#00BFFF',
        opacity: 0.1,
        bottom: -20,
        left: -20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    label: {
        color: '#0066CC',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    content: {
        alignItems: 'center',
    },
    prayerText: {
        color: '#334155',
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 12,
        fontWeight: '500',
    },
    themeBadge: {
        color: '#0066CC',
        fontSize: 12,
        fontWeight: 'bold',
        opacity: 0.8,
    }
});
