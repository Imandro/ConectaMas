import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '@/constants/theme';

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const CustomInput = ({ label, error, ...props }: CustomInputProps) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                {...props}
                style={[styles.input, error ? styles.inputError : null, props.style]}
                placeholderTextColor="#687076"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        color: '#ECEDEE',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        height: 56,
        backgroundColor: '#1E293B',
        borderRadius: 12,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    inputError: {
        borderColor: '#FF4444',
    },
    errorText: {
        color: '#FF4444',
        fontSize: 12,
        marginTop: 4,
    },
});
