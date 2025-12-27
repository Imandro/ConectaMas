import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { CustomButton } from '../components/common/CustomButton';
import { Colors } from '@/constants/theme';
import { useAuth } from '../context/AuthContext';
import { Check, ArrowRight, Shield, Heart, User, Sparkles, RefreshCw, Zap, X } from 'lucide-react-native';
import { router } from 'expo-router';
import client from '@/api/client';
import { LlamiMascot } from '@/components/LlamiMascot';

const STEPS = [
    { id: 1, title: 'Bienvenido', subtitle: '¿Dónde te encuentras hoy?' },
    { id: 2, title: 'Luchas', subtitle: 'Pecados que quieres dejar' },
    { id: 3, title: 'Problemas', subtitle: '¿Qué te preocupa hoy?' },
    { id: 4, title: 'Conexión', subtitle: '¿Cómo quieres crecer?' },
    { id: 5, title: 'Género', subtitle: 'Queremos conocerte mejor' },
    { id: 6, title: 'Tu Edad', subtitle: 'Personalicemos tu experiencia' },
    { id: 7, title: 'Compañera', subtitle: 'Dale un nombre a tu mascota' },
    { id: 8, title: 'Seguridad', subtitle: 'Contacto de tu líder' },
    { id: 9, title: 'Crecimiento', subtitle: 'Ayúdanos a crecer' },
    { id: 10, title: 'Todo Listo', subtitle: '¡Empecemos el camino!' },
];

const SPIRITUAL_STATUS_OPTIONS = [
    { id: "ACCEPT", title: "Aceptar a Jesús por Primera Vez", icon: Sparkles, color: "#2ECC71" },
    { id: "RENEW", title: "Reconciliar y Renovar mi Fe", icon: RefreshCw, color: "#F39C12" },
    { id: "DEEPEN", title: "Conectar Más Profundamente", icon: Zap, color: "#3498DB" },
    { id: "UNSURE", title: "No Estoy Seguro / Omitir", icon: X, color: "#95A5A6" },
];

const SIN_OPTIONS = [
    "Pornografía / Contenido Sexual",
    "Mentira",
    "Enojo / Ira",
    "Orgullo",
    "Envidia",
    "Pereza Espiritual",
    "Chisme / Murmuración",
    "Adicciones (alcohol, drogas, etc.)",
    "Relaciones Tóxicas",
    "Otros"
];

const PROBLEM_OPTIONS = [
    "Ansiedad / Estrés",
    "Depresión / Tristeza",
    "Soledad",
    "Baja autoestima",
    "Problemas familiares",
    "Presión de grupo",
    "Dudas sobre mi fe",
    "Tentación constante",
    "Falta de propósito",
    "Otros"
];

const CONNECTION_OPTIONS = [
    "Orar más consistentemente",
    "Leer la Biblia diariamente",
    "Ayunar y buscar a Dios",
    "Unirme a un grupo pequeño",
    "Servir en la iglesia",
    "Compartir mi fe con otros",
    "Adorar más (música, alabanza)",
    "Estudiar la Palabra más profundo"
];

export default function OnboardingScreen() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        spiritualStatus: '',
        sins: [] as string[],
        problems: [] as string[],
        methods: [] as string[],
        gender: '',
        age: '',
        mascotName: 'Llami',
        leaderPhone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (step < 10) {
            setStep(step + 1);
        } else {
            handleSubmit();
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

    const { user, refreshUser } = useAuth();

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await client.post('/onboarding', {
                spiritualStatus: formData.spiritualStatus,
                sinsToOvercome: formData.sins,
                problemsFaced: formData.problems,
                connectionMethods: formData.methods,
                gender: formData.gender,
                age: Number(formData.age),
                mascotName: formData.mascotName,
                leaderPhone: formData.leaderPhone,
            });
            await refreshUser();
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Onboarding submit error:', error);
            Alert.alert('Error', 'No se pudo guardar la configuración. Intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        {SPIRITUAL_STATUS_OPTIONS.map(opt => {
                            const Icon = opt.icon;
                            return (
                                <TouchableOpacity
                                    key={opt.id}
                                    style={[styles.optionCard, formData.spiritualStatus === opt.id && styles.optionCardSelected]}
                                    onPress={() => setFormData({ ...formData, spiritualStatus: opt.id })}
                                >
                                    <View style={[styles.iconBox, { backgroundColor: opt.color + '20' }]}>
                                        <Icon size={24} color={opt.color} />
                                    </View>
                                    <Text style={[styles.optionText, formData.spiritualStatus === opt.id && styles.optionTextSelected]}>{opt.title}</Text>
                                    {formData.spiritualStatus === opt.id && <Check size={20} color="#f3b33e" />}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        {SIN_OPTIONS.map(opt => (
                            <OptionCard
                                key={opt}
                                title={opt}
                                selected={formData.sins.includes(opt)}
                                onPress={() => toggleSelection('sins', opt)}
                            />
                        ))}
                    </View>
                );
            case 3:
                return (
                    <View style={styles.stepContainer}>
                        {PROBLEM_OPTIONS.map(opt => (
                            <OptionCard
                                key={opt}
                                title={opt}
                                selected={formData.problems.includes(opt)}
                                onPress={() => toggleSelection('problems', opt)}
                            />
                        ))}
                    </View>
                );
            case 4:
                return (
                    <View style={styles.stepContainer}>
                        {CONNECTION_OPTIONS.map(opt => (
                            <OptionCard
                                key={opt}
                                title={opt}
                                selected={formData.methods.includes(opt)}
                                onPress={() => toggleSelection('methods', opt)}
                            />
                        ))}
                    </View>
                );
            case 5:
                return (
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.genderCard, formData.gender === 'MALE' && styles.optionCardSelected]}
                            onPress={() => setFormData({ ...formData, gender: 'MALE' })}
                        >
                            <Text style={styles.genderEmoji}>👨</Text>
                            <Text style={styles.genderText}>Hombre</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.genderCard, formData.gender === 'FEMALE' && styles.optionCardSelected]}
                            onPress={() => setFormData({ ...formData, gender: 'FEMALE' })}
                        >
                            <Text style={styles.genderEmoji}>👩</Text>
                            <Text style={styles.genderText}>Mujer</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 6:
                return (
                    <View style={styles.stepContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. 25"
                            placeholderTextColor="#9BA1A6"
                            keyboardType="numeric"
                            value={formData.age}
                            onChangeText={(val) => setFormData({ ...formData, age: val })}
                        />
                    </View>
                );
            case 7:
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.mascotPreview}>
                            <LlamiMascot streak={1} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de tu mascota"
                            placeholderTextColor="#9BA1A6"
                            value={formData.mascotName}
                            onChangeText={(val) => setFormData({ ...formData, mascotName: val })}
                        />
                    </View>
                );
            case 8:
                return (
                    <View style={styles.stepContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="WhatsApp de tu líder (Opcional)"
                            placeholderTextColor="#9BA1A6"
                            keyboardType="phone-pad"
                            value={formData.leaderPhone}
                            onChangeText={(val) => setFormData({ ...formData, leaderPhone: val })}
                        />
                    </View>
                );
            case 9:
                return (
                    <View style={styles.adCard}>
                        <Heart size={40} color="#f3b33e" />
                        <Text style={styles.adTitle}>¡Ayúdanos a Crecer!</Text>
                        <Text style={styles.adText}>
                            Conecta+ es gratuito. Queremos llegar a más jóvenes. Considera apoyarnos.
                        </Text>
                        <View style={styles.progressBarSm}>
                            <View style={[styles.progressFillSm, { width: '48%' }]} />
                        </View>
                    </View>
                );
            case 10:
                return (
                    <View style={styles.finalCard}>
                        <Sparkles size={48} color="#f3b33e" />
                        <Text style={styles.finalTitle}>¡Todo Listo!</Text>
                        <Text style={styles.finalText}>
                            "Mira que te mando que te esfuerces y seas valiente..." - Josué 1:9
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(step / 10) * 100}%` }]} />
                </View>
                <Text style={styles.stepTitle}>{STEPS[step - 1].title}</Text>
                <Text style={styles.stepSubtitle}>{STEPS[step - 1].subtitle}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {renderStep()}
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title={step === 10 ? (isSubmitting ? "Guardando..." : "¡Empezar mi Camino!") : "Siguiente"}
                    onPress={handleNext}
                    disabled={isSubmitting || (step === 1 && !formData.spiritualStatus) || (step === 5 && !formData.gender) || (step === 6 && !formData.age)}
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
        paddingBottom: 40,
    },
    stepContainer: {
        gap: 12,
    },
    optionCard: {
        backgroundColor: '#1E293B',
        padding: 16,
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
        fontSize: 15,
        color: '#FFFFFF',
        flex: 1,
    },
    optionTextSelected: {
        color: '#f3b33e',
        fontWeight: '600',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    genderCard: {
        flex: 1,
        backgroundColor: '#1E293B',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    genderEmoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    genderText: {
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#1E293B',
        padding: 20,
        borderRadius: 16,
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    mascotPreview: {
        alignItems: 'center',
        marginBottom: 20,
    },
    adCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    adTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },
    adText: {
        color: '#9BA1A6',
        textAlign: 'center',
        marginBottom: 20,
    },
    progressBarSm: {
        height: 6,
        width: '100%',
        backgroundColor: '#1E293B',
        borderRadius: 3,
    },
    progressFillSm: {
        height: '100%',
        backgroundColor: '#f3b33e',
        borderRadius: 3,
    },
    finalCard: {
        alignItems: 'center',
        padding: 40,
    },
    finalTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
    },
    finalText: {
        color: '#9BA1A6',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    }
});
