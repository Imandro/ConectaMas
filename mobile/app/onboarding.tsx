import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { CustomButton } from '../components/common/CustomButton';
import { Colors } from '@/constants/theme';
import { useAuth } from '../context/AuthContext';
import { Check } from 'lucide-react-native';

const STEPS = [
    { id: 1, title: 'Tu Género', subtitle: 'Queremos conocerte mejor' },
    { id: 2, title: 'Estado Espiritual', subtitle: '¿En qué punto te encuentras?' },
    { id: 3, title: 'Luchas Actuales', subtitle: 'Selecciona las que enfrentas' },
    { id: 4, title: 'Problemas', subtitle: '¿Qué te preocupa hoy?' },
    { id: 5, title: 'Conexión', subtitle: '¿Cómo prefieres conectar con Dios?' },
];

export default function OnboardingScreen() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        gender: '',
        spiritualStatus: '',
        sins: [] as string[],
        problems: [] as string[],
        methods: [] as string[],
    });
    const { user } = useAuth();

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        } else {
            // Finalizar onboarding y guardar en backend
            console.log('Finalizando onboarding', formData);
        }
    };

    const toggleSelection = (key: 'sins' | 'problems' | 'methods', value: string) => {
        setFormData(prev => {
            const current = prev[key];
            if (current.includes(value)) {
                return { ...prev, [key]: current.filter(i => i !== value) };
            }
            return { ...prev, [key]: [...current, value] };
        });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <OptionCard
                            title="Masculino"
                            selected={formData.gender === 'MALE'}
                            onPress={() => setFormData({ ...formData, gender: 'MALE' })}
                        />
                        <OptionCard
                            title="Femenino"
                            selected={formData.gender === 'FEMALE'}
                            onPress={() => setFormData({ ...formData, gender: 'FEMALE' })}
                        />
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        {['Aceptar a Cristo', 'Renovar compromiso', 'Profundizar fe', 'No estoy seguro'].map(status => (
                            <OptionCard
                                key={status}
                                title={status}
                                selected={formData.spiritualStatus === status}
                                onPress={() => setFormData({ ...formData, spiritualStatus: status })}
                            />
                        ))}
                    </View>
                );
            case 3:
                return (
                    <View style={styles.stepContainer}>
                        {['Pornografía', 'Ansiedad', 'Ira', 'Mentira', 'Orgullo', 'Envidia'].map(sin => (
                            <OptionCard
                                key={sin}
                                title={sin}
                                selected={formData.sins.includes(sin)}
                                onPress={() => toggleSelection('sins', sin)}
                            />
                        ))}
                    </View>
                );
            default:
                return <Text style={{ color: 'white' }}>Próximamente...</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(currentStep / 5) * 100}%` }]} />
                </View>
                <Text style={styles.stepTitle}>{STEPS[currentStep - 1].title}</Text>
                <Text style={styles.stepSubtitle}>{STEPS[currentStep - 1].subtitle}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {renderStep()}
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title={currentStep === 5 ? "Comenzar" : "Siguiente"}
                    onPress={handleNext}
                    disabled={currentStep === 1 && !formData.gender}
                />
            </View>
        </View>
    );
}

const OptionCard = ({ title, selected, onPress }: { title: string, selected: boolean, onPress: () => void }) => (
    <TouchableOpacity
        style={[styles.optionCard, selected && styles.optionCardSelected]}
        onPress={onPress}
    >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{title}</Text>
        {selected && <Check size={20} color="#f3b33e" />}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1B32',
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 30,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#1E293B',
        borderRadius: 2,
        marginBottom: 20,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#f3b33e',
        borderRadius: 2,
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 16,
        color: '#9BA1A6',
    },
    content: {
        paddingHorizontal: 24,
    },
    stepContainer: {
        gap: 12,
    },
    optionCard: {
        backgroundColor: '#1E293B',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    optionCardSelected: {
        borderColor: '#f3b33e',
        backgroundColor: '#162338',
    },
    optionText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    optionTextSelected: {
        color: '#f3b33e',
        fontWeight: '600',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    }
});
