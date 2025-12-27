import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Platform, ActivityIndicator } from 'react-native';
import { CustomButton } from '@/components/common/CustomButton';
import { Smile, Meh, Frown, Heart, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import client from '@/api/client';

const MOODS = [
    { id: '1', icon: <Frown />, label: 'Mal', color: '#E74C1C' },
    { id: '2', icon: <Meh />, label: 'Regular', color: '#F39C12' },
    { id: '3', icon: <Smile />, label: 'Bien', color: '#2ECC71' },
    { id: '4', icon: <Heart />, label: 'Excelente', color: '#E91E63' },
];

export default function CheckinScreen() {
    const [selectedMood, setSelectedMood] = useState('');
    const [anxietyLevel, setAnxietyLevel] = useState(0);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedMood) {
            alert('Por favor selecciona cómo te sientes');
            return;
        }

        setLoading(true);
        try {
            const mood = MOODS.find(m => m.id === selectedMood)?.label || 'Bien';
            const response = await client.post('/checkin', {
                mood,
                note: note.trim()
            });

            if (response.status === 201) {
                alert('¡Check-in guardado exitosamente!');
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            console.error('Checkin submit error:', error);
            if (error.response?.status === 429) {
                alert('Ya has realizado tu check-in de hoy. ¡Vuelve mañana!');
                router.replace('/(tabs)');
            } else {
                alert('No se pudo guardar el check-in. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Salud Espiritual</Text>
                    <Text style={styles.subtitle}>¿Cómo te sientes hoy?</Text>
                </View>
                <TouchableOpacity
                    style={styles.historyBtn}
                    onPress={() => router.push('/checkin/history')}
                >
                    <Calendar size={20} color="#0B1B32" />
                    <Text style={styles.historyBtnText}>Historial</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.question}>Estado de ánimo</Text>
                <View style={styles.moodGrid}>
                    {MOODS.map(mood => (
                        <TouchableOpacity
                            key={mood.id}
                            onPress={() => setSelectedMood(mood.id)}
                            style={[
                                styles.moodCard,
                                selectedMood === mood.id && { borderColor: mood.color, backgroundColor: mood.color + '10' }
                            ]}
                        >
                            {React.cloneElement(mood.icon as any, {
                                color: selectedMood === mood.id ? mood.color : '#9BA1A6',
                                size: 32
                            })}
                            <Text style={[
                                styles.moodLabel,
                                selectedMood === mood.id && { color: mood.color }
                            ]}>
                                {mood.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.question}>Nivel de Ansiedad (1-5)</Text>
                <View style={styles.ratingBar}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setAnxietyLevel(i)}
                            style={[styles.ratingCircle, anxietyLevel === i && styles.ratingCircleActive]}
                        >
                            <Text style={[styles.ratingText, anxietyLevel === i && styles.ratingTextActive]}>{i}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.question}>Motivo de Gratitud</Text>
                <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder="Hoy agradezco por..."
                    placeholderTextColor="#9BA1A6"
                    value={note}
                    onChangeText={setNote}
                />

                <CustomButton
                    title={loading ? "Guardando..." : "Guardar Check-in"}
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.button}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    historyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    historyBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    subtitle: {
        fontSize: 16,
        color: '#687076',
        marginTop: 4,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    question: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 16,
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    moodGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    moodCard: {
        backgroundColor: '#F8F9FA',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        width: '22%',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    moodLabel: {
        fontSize: 10,
        color: '#9BA1A6',
        marginTop: 8,
        fontWeight: 'bold',
    },
    ratingBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    ratingCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    ratingCircleActive: {
        backgroundColor: '#0B1B32',
        borderColor: '#0B1B32',
    },
    ratingText: {
        color: '#687076',
        fontWeight: 'bold',
        fontSize: 16,
    },
    ratingTextActive: {
        color: 'white',
    },
    textArea: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        color: '#0B1B32',
        height: 120,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#F1F3F5',
        marginBottom: 24,
    },
    button: {
        marginTop: 8,
    }
});

