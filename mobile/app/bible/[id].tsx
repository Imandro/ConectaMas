import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronLeft, ChevronRight, BookOpen, Settings, List, Share2, Flame } from 'lucide-react-native';
import client from '@/api/client';

export default function BibleReaderScreen() {
    const { id: bookName } = useLocalSearchParams();
    const [chapter, setChapter] = useState(1);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showChapterSelect, setShowChapterSelect] = useState(false);

    // Heartbeat state
    const [readingTime, setReadingTime] = useState(0);
    const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);

    const fetchChapter = async (chap: number) => {
        setLoading(true);
        try {
            const response = await client.get(`/bible?book=${bookName}&chapter=${chap}`);
            setData(response.data);
            setChapter(chap);
        } catch (error) {
            console.error('Error fetching bible chapter:', error);
            Alert.alert('Error', 'No se pudo cargar el capítulo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChapter(1);
    }, [bookName]);

    // Heartbeat Logic: Send every 60s of active reading
    useEffect(() => {
        heartbeatTimer.current = setInterval(() => {
            setReadingTime(prev => {
                const newTime = prev + 1;
                if (newTime >= 60) {
                    sendHeartbeat();
                    return 0; // Reset after sending
                }
                return newTime;
            });
        }, 1000);

        return () => {
            if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
        };
    }, []);

    const sendHeartbeat = async () => {
        try {
            await client.post('/mascot/heartbeat', { type: 'BIBLE_READING' });
            // Optional: Show a subtle feedback like a floating flame icon
            console.log('Heartbeat sent!');
        } catch (error) {
            console.error('Error sending heartbeat:', error);
        }
    };

    const handleNext = () => fetchChapter(chapter + 1);
    const handlePrev = () => {
        if (chapter > 1) fetchChapter(chapter - 1);
    };

    const renderChapterSelect = () => (
        <View style={styles.chapterOverlay}>
            <View style={styles.chapterModal}>
                <Text style={styles.modalTitle}>Seleccionar Capítulo</Text>
                <ScrollView contentContainerStyle={styles.chapterGrid}>
                    {Array.from({ length: 50 }, (_, i) => i + 1).map(chap => (
                        <TouchableOpacity
                            key={chap}
                            style={[styles.chapterBtn, chapter === chap && styles.chapterBtnActive]}
                            onPress={() => {
                                fetchChapter(chap);
                                setShowChapterSelect(false);
                            }}
                        >
                            <Text style={[styles.chapterBtnText, chapter === chap && styles.chapterBtnTextActive]}>
                                {chap}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowChapterSelect(false)}>
                    <Text style={styles.closeBtnText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: `${bookName} ${chapter}`,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#0B1B32" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => setShowChapterSelect(true)} style={styles.headerIcon}>
                                <List size={20} color="#0B1B32" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#f3b33e" />
                    <Text style={styles.loadingText}>Escudriñando las escrituras...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.bibleCard}>
                        {data?.verses?.map((v: any) => (
                            <View key={v.verse} style={styles.verseRow}>
                                <Text style={styles.verseNumber}>{v.verse}</Text>
                                <Text style={styles.verseText}>{v.text}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.navigation}>
                        <TouchableOpacity
                            style={[styles.navBtn, chapter === 1 && styles.navBtnDisabled]}
                            onPress={handlePrev}
                            disabled={chapter === 1}
                        >
                            <ChevronLeft size={20} color={chapter === 1 ? "#9BA1A6" : "#0B1B32"} />
                            <Text style={[styles.navText, chapter === 1 && styles.navTextDisabled]}>Anterior</Text>
                        </TouchableOpacity>

                        <View style={styles.heartbeatIndicator}>
                            <Flame size={14} color="#f3b33e" />
                            <Text style={styles.heartbeatText}>Meditando...</Text>
                        </View>

                        <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
                            <Text style={styles.navText}>Siguiente</Text>
                            <ChevronRight size={20} color="#0B1B32" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerPadding} />
                </ScrollView>
            )}

            {showChapterSelect && renderChapterSelect()}
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
    headerRight: {
        flexDirection: 'row',
        gap: 16,
        marginRight: 16,
    },
    headerIcon: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#9BA1A6',
        fontSize: 14,
    },
    bibleCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
        marginBottom: 24,
    },
    verseRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    verseNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#f3b33e',
        width: 20,
        textAlign: 'right',
        marginTop: 3,
    },
    verseText: {
        flex: 1,
        fontSize: 17,
        color: '#0B1B32',
        lineHeight: 28,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    navBtnDisabled: {
        borderColor: 'transparent',
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    navText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    navTextDisabled: {
        color: '#9BA1A6',
    },
    heartbeatIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(243, 179, 62, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    heartbeatText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#f3b33e',
    },
    chapterOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    chapterModal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 20,
        textAlign: 'center',
    },
    chapterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        paddingBottom: 20,
    },
    chapterBtn: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    chapterBtnActive: {
        backgroundColor: '#0B1B32',
        borderColor: '#0B1B32',
    },
    chapterBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    chapterBtnTextActive: {
        color: 'white',
    },
    closeBtn: {
        marginTop: 10,
        padding: 16,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#9BA1A6',
        fontWeight: 'bold',
    },
    footerPadding: {
        height: 60,
    }
});
