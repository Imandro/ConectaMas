import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/common/CustomButton';
import { CustomInput } from '../../components/common/CustomInput';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';

export default function LoginScreen() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!identifier || !password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await login(identifier, password);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Error al iniciar sesión');
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
                    <Text style={styles.title}>Conecta+</Text>
                    <Text style={styles.subtitle}>Tu espacio de crecimiento espiritual</Text>
                </View>

                <View style={styles.form}>
                    <CustomInput
                        label="Email o Usuario"
                        placeholder="Introduce tu email o @usuario"
                        value={identifier}
                        onChangeText={setIdentifier}
                        autoCapitalize="none"
                    />
                    <CustomInput
                        label="Contraseña"
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <CustomButton
                        title="Iniciar Sesión"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.button}
                    />

                    <TouchableOpacity
                        onPress={() => router.push('/auth/register')}
                        style={styles.linkContainer}
                    >
                        <Text style={styles.linkText}>
                            ¿No tienes cuenta? <Text style={styles.linkHighlight}>Regístrate</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.forgotPassword}
                    >
                        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
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
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#f3b33e',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#ECEDEE',
        textAlign: 'center',
        opacity: 0.8,
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 10,
    },
    errorText: {
        color: '#FF4444',
        textAlign: 'center',
        marginBottom: 10,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#ECEDEE',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#f3b33e',
        fontWeight: 'bold',
    },
    forgotPassword: {
        marginTop: 15,
        alignItems: 'center',
    },
    forgotText: {
        color: '#9BA1A6',
        fontSize: 14,
    }
});
