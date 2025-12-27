import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking, Animated, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { X, Phone, BookHeart, Music, Heart, ChevronLeft, Play, Pause, SkipForward, Volume2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import client from '@/api/client';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

const TRUTHS = [
    "Dios no está enojado contigo, Él está de tu lado.",
    "Tus errores no definen tu futuro, Su gracia sí.",
    "No tienes que ser perfecto para ser amado.",
    "Esta tentación es temporal, pero Su amor es eterno.",
    "Eres un hijo amado, comprado por sangre.",
    "Él te levanta aunque caigas siete veces.",
    "Tu valor no depende de tus éxitos o fracasos.",
    "Él es tu pronto auxilio en las tribulaciones.",
    "Su poder se perfecciona en tu debilidad.",
    "Él peleará por ti, tú solo quédate tranquilo."
];

const PRAYERS = [
    "Padre, mi mente grita y mi carne es débil, pero Tú eres mi roca. Ven y aquieta esta tormenta ahora mismo. Te necesito intensamente.",
    "Jesús, rindo mi voluntad a Ti. No puedo con esto solo, pero sé que Tú ya venciste. Dame la fuerza para este minuto.",
    "Espíritu Santo, lléname ahora. Expulsa todo pensamiento que no sea Tuyo. Trae Tu paz que sobrepasa todo entendimiento.",
    "Señor, aunque ande en valle de sombra, no temeré. Tú estás conmigo. Líbrame del lazo del cazador.",
    "Dios mío, renuevo mis fuerzas en Ti. Dame la salida que prometiste en Tu Palabra. No me dejes caer, sostenme fuerte."
];

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SOSScreen() {
    const insets = useSafeAreaInsets();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songs, setSongs] = useState<any[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    const { user } = useAuth();
    const [view, setView] = useState<'main' | 'truths' | 'prayer' | 'music'>('main');
    const [randomTruths, setRandomTruths] = useState<string[]>([]);
    const [currentPrayer, setCurrentPrayer] = useState('');

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    useEffect(() => {
        if (view === 'music' && songs.length === 0) {
            fetchSongs();
        }
    }, [view]);

    const fetchSongs = async () => {
        try {
            const response = await client.get('/songs');
            setSongs(response.data);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const playSound = async (index: number) => {
        if (!songs[index]) return;

        try {
            if (sound) {
                await sound.unloadAsync();
            }

            const songUrl = songs[index].url.startsWith('http')
                ? songs[index].url
                : `${client.defaults.baseURL?.replace('/api', '')}${songs[index].url}`;

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: songUrl },
                { shouldPlay: true }
            );
            setSound(newSound);
            setIsPlaying(true);
            setCurrentSongIndex(index);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    handleNext();
                }
            });
        } catch (error) {
            console.error('Error playing sound:', error);
            Alert.alert('Error', 'No se pudo reproducir la música.');
        }
    };

    const togglePlay = async () => {
        if (!sound) {
            if (songs.length > 0) {
                await playSound(currentSongIndex);
            }
            return;
        }

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = async () => {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        await playSound(nextIndex);
    };

    const handleShowTruths = () => {
        const shuffled = [...TRUTHS].sort(() => 0.5 - Math.random());
        setRandomTruths(shuffled.slice(0, 5));
        setView('truths');
    };

    const handleShowPrayer = () => {
        const randomIndex = Math.floor(Math.random() * PRAYERS.length);
        setCurrentPrayer(PRAYERS[randomIndex]);
        setView('prayer');
    };

    const handleCall = () => {
        const phone = user?.leaderPhone;
        if (phone) {
            Linking.openURL(`tel:${phone}`).catch(err => alert('No se pudo realizar la llamada'));
        } else {
            alert('No has configurado el número de tu líder en tu perfil.');
        }
    };

    const renderContent = () => {
        const topPadding = Math.max(insets.top, 24) + 10;
        switch (view) {
            case 'truths':
                return (
                    <View style={[styles.overlay, { paddingTop: topPadding }]}>
                        <Text style={styles.overlayTitle}>5 Verdades para ti hoy:</Text>
                        {randomTruths.map((truth, idx) => (
                            <View key={idx} style={styles.truthCard}>
                                <Text style={styles.truthIndex}>{idx + 1}.</Text>
                                <Text style={styles.truthText}>{truth}</Text>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
                            <Text style={styles.backButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'prayer':
                return (
                    <View style={[styles.overlay, { paddingTop: topPadding }]}>
                        <Text style={styles.overlayTitle}>Oración de Emergencia</Text>
                        <View style={styles.prayerCard}>
                            <Text style={styles.prayerText}>"{currentPrayer}"</Text>
                        </View>
                        <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
                            <Text style={styles.backButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'music':
                const currentSong = songs[currentSongIndex];
                return (
                    <View style={[styles.overlay, { paddingTop: topPadding }]}>
                        <Text style={styles.overlayTitle}>Música para el alma</Text>

                        {songs.length > 0 ? (
                            <View style={styles.playerCard}>
                                <View style={styles.musicIconCircle}>
                                    <Music size={48} color="#f3b33e" />
                                </View>
                                <Text style={styles.songTitle}>{currentSong?.title || 'Seleccionar canción'}</Text>
                                <Text style={styles.songArtist}>{currentSong?.artist || 'Conecta+'}</Text>

                                <View style={styles.controls}>
                                    <TouchableOpacity style={styles.controlBtn} onPress={togglePlay}>
                                        {isPlaying ? (
                                            <Pause size={48} color="white" fill="white" />
                                        ) : (
                                            <Play size={48} color="white" fill="white" />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                                        <SkipForward size={32} color="rgba(255,255,255,0.8)" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.volumeHint}>
                                    <Volume2 size={16} color="rgba(255,255,255,0.5)" />
                                    <Text style={styles.volumeText}>Ajusta tu volumen para un ambiente de paz</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyMusic}>
                                <ActivityIndicator size="large" color="#f3b33e" />
                                <Text style={styles.emptyText}>Buscando música de paz...</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
                            <Text style={styles.backButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return (
                    <View style={[styles.mainContent, { paddingTop: topPadding }]}>
                        <Text style={styles.respira}>Respira.</Text>
                        <Text style={styles.intro}>
                            No has fallado todavía. Y aunque lo hicieras, Él te sigue amando. Pero hagamos una pausa de 1 minuto juntos.
                        </Text>

                        <TouchableOpacity style={styles.sosAction} onPress={handleShowTruths}>
                            <View style={styles.actionIcon}>
                                <BookHeart color="#f3b33e" size={24} />
                            </View>
                            <View>
                                <Text style={styles.actionTitle}>Leer una promesa</Text>
                                <Text style={styles.actionSubtitle}>Rompe la mentira con verdad</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sosAction} onPress={handleShowPrayer}>
                            <View style={styles.actionIcon}>
                                <Heart color="#f3b33e" size={24} />
                            </View>
                            <View>
                                <Text style={styles.actionTitle}>Oración de Emergencia</Text>
                                <Text style={styles.actionSubtitle}>Palabras para clamar juntos</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sosAction} onPress={() => setView('music')}>
                            <View style={styles.actionIcon}>
                                <Music color="#f3b33e" size={24} />
                            </View>
                            <View>
                                <Text style={styles.actionTitle}>Escuchar música</Text>
                                <Text style={styles.actionSubtitle}>Cambia la atmósfera</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.sosAction, styles.callAction]} onPress={handleCall}>
                            <View style={styles.callIcon}>
                                <Phone color="white" size={24} />
                            </View>
                            <View>
                                <Text style={[styles.actionTitle, { color: 'white' }]}>Llamar a un líder</Text>
                                <Text style={[styles.actionSubtitle, { color: 'rgba(255,255,255,0.7)' }]}>No pelees solo</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <X size={32} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderContent()}

                <View style={styles.footer}>
                    <Text style={styles.footerVerse}>
                        "Fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir..." - 1 Cor 10:13
                    </Text>
                    <View style={styles.disclaimerBox}>
                        <Text style={styles.disclaimerText}>
                            AVISO: Conecta+ es una herramienta espiritual. En caso de emergencia grave o riesgo para tu vida, llama a las autoridades (911).
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1B32',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 24,
        paddingTop: 50,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    mainContent: {
        marginTop: 20,
    },
    respira: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    intro: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 26,
        marginBottom: 40,
    },
    sosAction: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    callAction: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
    },
    actionIcon: {
        backgroundColor: 'rgba(243, 179, 62, 0.1)',
        padding: 12,
        borderRadius: 15,
    },
    callIcon: {
        padding: 12,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#9BA1A6',
    },
    overlay: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 30,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    overlayTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 24,
        textAlign: 'center',
    },
    truthCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 12,
    },
    truthIndex: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f3b33e',
    },
    truthText: {
        fontSize: 16,
        color: 'white',
        flex: 1,
        lineHeight: 22,
    },
    backButton: {
        backgroundColor: 'white',
        paddingVertical: 16,
        borderRadius: 30,
        marginTop: 24,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#0B1B32',
        fontWeight: 'bold',
        fontSize: 16,
    },
    prayerCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    prayerText: {
        fontSize: 18,
        color: 'white',
        fontStyle: 'italic',
        lineHeight: 28,
        textAlign: 'center',
    },
    emptyMusic: {
        height: 300,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginBottom: 40,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
    },
    playerCard: {
        height: 400,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 40,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    musicIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(243, 179, 62, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    songTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    songArtist: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginBottom: 40,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40,
        marginBottom: 40,
    },
    controlBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f3b33e',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#f3b33e',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    nextBtn: {
        padding: 10,
    },
    volumeHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    volumeText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerVerse: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    disclaimerBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 12,
    },
    disclaimerText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
    }
});

