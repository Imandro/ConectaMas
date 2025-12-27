import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ExternalLink, BookOpen } from 'lucide-react-native';
import { router } from 'expo-router';
import { verses as VERSES } from '@/lib/versesData';

export const DailyVerseCard = () => {
    const [verse, setVerse] = useState(VERSES[0]);

    useEffect(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const verseIndex = dayOfYear % VERSES.length;
        setVerse(VERSES[verseIndex]);
    }, []);

    const handlePress = () => {
        // Navigate to bible with params would be ideal, but for now just to bible
        router.push('/(tabs)/bible');
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
            {/* Decorative Circles */}
            <View style={[styles.circle, styles.circleTopRight]} />
            <View style={[styles.circle, styles.circleBottomLeft]} />

            <View style={styles.header}>
                <Text style={styles.label}>Versículo del Día</Text>
                <BookOpen size={16} color="#f3b33e" />
            </View>

            <View style={styles.content}>
                <Text style={styles.verseText}>"{verse.text}"</Text>
                <Text style={styles.reference}>{verse.reference}</Text>
            </View>

            <View style={styles.iconWrapper}>
                <ExternalLink size={14} color="rgba(255,255,255,0.5)" />
            </View>
        </TouchableOpacity>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#0B1B32',
        borderRadius: 24,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(243, 179, 62, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    circle: {
        position: 'absolute',
        borderRadius: 100,
    },
    circleTopRight: {
        width: 150,
        height: 150,
        backgroundColor: '#f3b33e',
        opacity: 0.05,
        top: -40,
        right: -40,
    },
    circleBottomLeft: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: '#f3b33e',
        opacity: 0.15,
        bottom: -30,
        left: -30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    label: {
        color: '#f3b33e',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    content: {
        alignItems: 'center',
    },
    verseText: {
        color: 'white',
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 12,
    },
    reference: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '600',
    },
    iconWrapper: {
        position: 'absolute',
        top: 15,
        right: 15,
    }
});
