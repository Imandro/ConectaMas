import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking, Animated, Dimensions } from 'react-native';
import { X, Phone, BookHeart, Music, AlertCircle, ChevronLeft, Heart } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const TRUTHS = [
    "Dios no está enojado contigo, Él está peliando por ti.",
    "Tu identidad no está en tus errores, sino en Cristo.",
    "Ninguna condenación hay para los que están en Cristo Jesús.",
    "El amor de Dios es más grande que cualquier pecado.",
    "Tus sentimientos son reales, pero no siempre son la verdad.",
    "Eres escogido, perdonado y amado eternamente.",
    "Esta prueba es temporal, pero Su gracia es eterna.",
    "Dios perfecciona su poder en tu debilidad.",
    "No estás solo; el Espíritu Santo te consuela ahora mismo.",
    "Levántate, resplandece, porque ha venido tu luz.",
];

const EMERGENCY_PRAYERS = [
    "Padre Celestial, en este momento de angustia te necesito más que nunca. Siento que las fuerzas me abandonan, pero sé que Tú nunca me abandonas. Llena mi corazón de Tu paz que sobrepasa todo entendimiento. Ayúdame a recordar que nunca estoy solo, que Tú siempre estás conmigo, caminando a mi lado incluso en el valle más oscuro. Dame la fortaleza para dar un paso más, para resistir un minuto más. Confío en que Tú me sostienes. Amén.",
    "Señor Jesús, siento que no puedo más con esta carga. Mi mente está agitada, mis emociones están desbordadas, y necesito Tu intervención divina ahora mismo. Toma control de esta situación que me sobrepasa. Dame la serenidad que solo Tú puedes dar, esa paz que el mundo no puede ofrecer. Ayúdame a entregarTe cada pensamiento, cada emoción, cada temor. Recuérdame que Tú venciste al mundo, y que en Ti tengo la victoria. Confío plenamente en Ti. Amén.",
    "Dios de amor infinito, en este momento tan difícil clamo a Ti con todo mi corazón. Calma la tormenta que hay en mi mente, fortalece mi espíritu que se siente débil. Recuérdame Tu promesa de nunca dejarme ni abandonarme, de estar conmigo hasta el fin del mundo. Ayúdame a sentir Tu presencia ahora mismo, a saber que me escuchas, que me ves, que te importo. Dame esperanza cuando todo parece oscuro, y fe cuando no puedo ver el camino. Amén.",
    "Espíritu Santo, ven como consolador a mi corazón quebrantado. Necesito Tu guía divina en este momento de confusión. Dame sabiduría para tomar las decisiones correctas, discernimiento para ver la verdad en medio de las mentiras, y valor para enfrentar este momento sin huir. Gracias por Tu presencia constante, por ser mi ayudador, mi consejero, mi amigo fiel. Llena cada espacio vacío de mi ser con Tu amor y Tu poder. Amén.",
    "Padre Eterno, reconozco humildemente que sin Ti no puedo hacer absolutamente nada. Esta batalla es demasiado grande para mí, pero no para Ti. Ayúdame a resistir esta tentación que me acecha, a superar este momento de debilidad. Llena este vacío que siento con Tu amor infinito e incondicional. Recuérdame quién soy en Ti: amado, perdonado, libre. Dame fuerzas para decir no a lo que me destruye y sí a lo que me edifica. Confío en Tu poder transformador. Amén."
];

export default function SOSScreen() {
    const { user } = useAuth();
    const [view, setView] = useState<'main' | 'truths' | 'prayer' | 'music'>('main');
    const [randomTruths, setRandomTruths] = useState<string[]>([]);
    const [currentPrayer, setCurrentPrayer] = useState('');

    const handleShowTruths = () => {
        const shuffled = [...TRUTHS].sort(() => 0.5 - Math.random());
        setRandomTruths(shuffled.slice(0, 5));
        setView('truths');
    };

    const handleShowPrayer = () => {
        const randomIndex = Math.floor(Math.random() * EMERGENCY_PRAYERS.length);
        setCurrentPrayer(EMERGENCY_PRAYERS[randomIndex]);
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
        switch (view) {
            case 'truths':
                return (
                    <View style={styles.overlay}>
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
                    <View style={styles.overlay}>
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
                return (
                    <View style={styles.overlay}>
                        <Text style={styles.overlayTitle}>Música para el alma</Text>
                        <View style={styles.emptyMusic}>
                            <Music size={48} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>Reproductor de música próximamente en móvil</Text>
                        </View>
                        <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
                            <Text style={styles.backButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return (
                    <View style={styles.mainContent}>
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
        padding: 40,
        alignItems: 'center',
        gap: 16,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
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

