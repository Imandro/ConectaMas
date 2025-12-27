import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { CustomButton } from '@/components/common/CustomButton';
import { Star, Smile, Meh, Frown, Heart } from 'lucide-react-native';

const MOODS = [
    { id: '1', icon: <Frown />, label: 'Mal' },
    { id: '2', icon: <Meh />, label: 'Regular' },
    { id: '3', icon: <Smile />, label: 'Bien' },
    { id: '4', icon: <Heart />, label: 'Excelente' },
];

export default function CheckinScreen() {
    const [selectedMood, setSelectedMood] = useState('');
    const [note, setNote] = useState('');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.question}>¿Cómo te sientes espiritualmente hoy?</Text>

            <View style={styles.moodGrid}>
                {MOODS.map(mood => (
                    <TouchableOpacity
                        key={mood.id}
                        onPress={() => setSelectedMood(mood.id)}
                        style={[styles.moodCard, selectedMood === mood.id && styles.moodCardSelected]}
                    >
                        {React.cloneElement(mood.icon as any, {
                            color: selectedMood === mood.id ? '#f3b33e' : '#9BA1A6',
                            size: 32
                        })}
                        <Text style={[styles.moodLabel, selectedMood === mood.id && styles.moodLabelSelected]}>
                            {mood.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Nivel de Ansiedad (1-10)</Text>
                <View style={styles.ratingBar}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <TouchableOpacity key={i} style={styles.ratingCircle}>
                            <Text style={{ color: '#9BA1A6' }}>{i}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Motivo de Gratitud</Text>
                <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder="Hoy agradezco por..."
                    placeholderTextColor="#687076"
                    value={note}
                    onChangeText={setNote}
                />

                <CustomButton title="Guardar Check-in" onPress={() => alert('¡Guardado!')} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1B32',
    },
    content: {
        padding: 24,
        paddingTop: 30,
    },
    question: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 30,
        textAlign: 'center',
    },
    moodGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    moodCard: {
        backgroundColor: '#1E293B',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        width: '22%',
        borderWidth: 1,
        borderColor: '#334155',
    },
    moodCardSelected: {
        borderColor: '#f3b33e',
        backgroundColor: '#162338',
    },
    moodLabel: {
        fontSize: 10,
        color: '#9BA1A6',
        marginTop: 8,
        fontWeight: 'bold',
    },
    moodLabelSelected: {
        color: '#f3b33e',
    },
    form: {
        gap: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    ratingBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    ratingCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    textArea: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        color: '#FFFFFF',
        height: 120,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#334155',
    }
});
