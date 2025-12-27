import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Share } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronLeft, BookOpen, Clock, Heart, Share2, CheckCircle2, Sparkles, BookMarked } from 'lucide-react-native';
import client from '@/api/client';

export default function DevotionalDetailScreen() {
    const { id } = useLocalSearchParams();
    const [devotional, setDevotional] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        const fetchDevotional = async () => {
            try {
                // Since our /api/devotionals returns the full array, 
                // we can just find it or create a specific endpoint.
                // For now, let's fetch all and find the one.
                const response = await client.get('/devotionals');
                const data = response.data.find((d: any) => d.id === id);
                setDevotional(data);
            } catch (error) {
                console.error('Error fetching devotional detail:', error);
                Alert.alert('Error', 'No se pudo cargar el devocional.');
            } finally {
                setLoading(false);
            }
        };
        fetchDevotional();
    }, [id]);

    const handleComplete = async () => {
        if (devotional?.completed || isCompleting) return;

        setIsCompleting(true);
        try {
            await client.post('/devotionals/complete', {
                devotionalId: id
            });
            setDevotional({ ...devotional, completed: true });
            Alert.alert('¡Felicidades!', 'Has completado este devocional. Sigue así, guerrero.');
        } catch (error) {
            console.error('Error completing devotional:', error);
            Alert.alert('Error', 'No se pudo marcar como completado.');
        } finally {
            setIsCompleting(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Mira este devocional en Conecta+: "${devotional.title}"\n\n${devotional.bibleReference}: ${devotional.bibleVerse}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#f3b33e" />
            </View>
        );
    }

    if (!devotional) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>No se encontró el devocional.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: devotional.category,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#0B1B32" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                            <Share2 size={20} color="#0B1B32" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>{devotional.title}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Clock size={14} color="#9BA1A6" />
                            <Text style={styles.metaText}>{devotional.time} min</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <BookMarked size={14} color="#9BA1A6" />
                            <Text style={styles.metaText}>{devotional.author}</Text>
                        </View>
                    </View>
                </View>

                {/* Scripture Card */}
                <View style={styles.scriptureCard}>
                    <Sparkles size={20} color="#f3b33e" style={styles.sparkleIcon} />
                    <Text style={styles.scriptureVerse}>"{devotional.bibleVerse}"</Text>
                    <Text style={styles.scriptureRef}>{devotional.bibleReference}</Text>
                </View>

                {/* Content */}
                <View style={styles.contentSection}>
                    {devotional.content.map((para: string, idx: number) => (
                        <Text key={idx} style={styles.paragraph}>{para}</Text>
                    ))}
                </View>

                {/* Application Section */}
                <View style={styles.applicationSection}>
                    <View style={styles.sectionHeader}>
                        <CheckCircle2 size={20} color="#0B1B32" />
                        <Text style={styles.sectionTitle}>Pasos Prácticos</Text>
                    </View>
                    {devotional.applicationSteps.map((step: string, idx: number) => (
                        <View key={idx} style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>{idx + 1}</Text>
                            </View>
                            <Text style={styles.stepText}>{step}</Text>
                        </View>
                    ))}
                </View>

                {/* Prayer Section */}
                <View style={styles.prayerCard}>
                    <Heart size={20} color="#E91E63" fill="#E91E63" />
                    <Text style={styles.prayerTitle}>Oración sugerida</Text>
                    <Text style={styles.prayerText}>{devotional.prayer}</Text>
                </View>

                {/* Complete Button */}
                <TouchableOpacity
                    style={[styles.completeBtn, devotional.completed && styles.completeBtnDisabled]}
                    onPress={handleComplete}
                    disabled={devotional.completed || isCompleting}
                >
                    {isCompleting ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            {devotional.completed ? (
                                <CheckCircle2 size={20} color="white" />
                            ) : (
                                <BookOpen size={20} color="white" />
                            )}
                            <Text style={styles.completeBtnText}>
                                {devotional.completed ? "Devocional Completado" : "Marcar como Leído"}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.footerPadding} />
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
    shareButton: {
        marginRight: 16,
    },
    content: {
        padding: 24,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSection: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0B1B32',
        lineHeight: 34,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 13,
        color: '#9BA1A6',
    },
    scriptureCard: {
        backgroundColor: '#0B1B32',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    sparkleIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        opacity: 0.5,
    },
    scriptureVerse: {
        fontSize: 18,
        color: 'white',
        fontStyle: 'italic',
        lineHeight: 28,
        textAlign: 'center',
        marginBottom: 16,
    },
    scriptureRef: {
        fontSize: 14,
        color: '#f3b33e',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentSection: {
        marginBottom: 32,
    },
    paragraph: {
        fontSize: 16,
        color: '#495057',
        lineHeight: 26,
        marginBottom: 16,
    },
    applicationSection: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f3b33e',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    stepNumberText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    prayerCard: {
        backgroundColor: '#FFF0F3',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD1DC',
    },
    prayerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E91E63',
        marginTop: 12,
        marginBottom: 8,
    },
    prayerText: {
        fontSize: 14,
        color: '#0B1B32',
        textAlign: 'center',
        lineHeight: 22,
        fontStyle: 'italic',
    },
    completeBtn: {
        backgroundColor: '#2ECC71',
        borderRadius: 20,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#2ECC71',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    completeBtnDisabled: {
        backgroundColor: '#9BA1A6',
        shadowOpacity: 0,
    },
    completeBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#FF4444',
        marginBottom: 12,
    },
    backLink: {
        color: '#0B1B32',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    footerPadding: {
        height: 40,
    }
});
