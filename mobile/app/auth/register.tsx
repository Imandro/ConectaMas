import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/common/CustomButton';
import { CustomInput } from '../../components/common/CustomInput';
import { router } from 'expo-router';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        securityAnswer: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleRegister = async () => {
        const { name, email, username, password, securityAnswer } = formData;
        if (!name || !email || !username || !password || !securityAnswer) {
            setError('Por favor, completa todos los campos');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await register(formData);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nueva Cuenta</Text>
                    <Text style={styles.subtitle}>Únete a la comunidad de Conecta+</Text>
                </View>

                <View style={styles.form}>
                    <CustomInput
                        label="Nombre Completo"
                        placeholder="Ej: Mario Alvarez"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                    <CustomInput
                        label="Correo Electrónico"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <CustomInput
                        label="Nombre de Usuario"
                        placeholder="@usuario"
                        value={formData.username}
                        onChangeText={(text) => setFormData({ ...formData, username: text })}
                        autoCapitalize="none"
                    />
                    <CustomInput
                        label="Contraseña"
                        placeholder="********"
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        secureTextEntry
                    />
                    <CustomInput
                        label="Pregunta de Seguridad: ¿Cómo se llama tu primera mascota?"
                        placeholder="Respuesta"
                        value={formData.securityAnswer}
                        onChangeText={(text) => setFormData({ ...formData, securityAnswer: text })}
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <CustomButton
                        title="Crear Cuenta"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.button}
                    />

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.linkContainer}
                    >
                        <Text style={styles.linkText}>
                            ¿Ya tienes cuenta? <Text style={styles.linkHighlight}>Inicia Sesión</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1B32',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#f3b33e',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#ECEDEE',
        opacity: 0.8,
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 20,
    },
    errorText: {
        color: '#FF4444',
        textAlign: 'center',
        marginTop: 10,
    },
    linkContainer: {
        marginTop: 24,
        alignItems: 'center',
        marginBottom: 40,
    },
    linkText: {
        color: '#ECEDEE',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#f3b33e',
        fontWeight: 'bold',
    }
});
