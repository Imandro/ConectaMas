import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronLeft, Send, Shield, Sparkles } from 'lucide-react-native';
import client from '@/api/client';

export default function CreatePostScreen() {
    const { categoryId: initialCategoryId } = useLocalSearchParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState(initialCategoryId as string || '');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await client.get('/forums/categories');
                setCategories(response.data);
                if (!categoryId && response.data.length > 0) {
                    setCategoryId(response.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || !categoryId || isSubmitting) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await client.post('/forums/posts', {
                title: title.trim(),
                content: content.trim(),
                categoryId,
                isAnonymous
            });

            Alert.alert('¡Éxito!', 'Tu publicación ha sido creada.');
            router.replace({
                pathname: '/forum/post/[id]',
                params: { id: response.data.id }
            });
        } catch (error: any) {
            console.error('Error creating post:', error);
            if (error.response?.status === 429) {
                Alert.alert('Límite alcanzado', 'Has alcanzado tu límite de 3 publicaciones por día.');
            } else {
                Alert.alert('Error', 'No se pudo crear la publicación. Intenta de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Nueva Publicación',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#0B1B32" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!title.trim() || !content.trim() || isSubmitting}
                            style={[styles.sendButton, (!title.trim() || !content.trim() || isSubmitting) && styles.sendButtonDisabled]}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#f3b33e" />
                            ) : (
                                <Text style={styles.sendText}>Publicar</Text>
                            )}
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Sparkles size={18} color="#f3b33e" />
                    <Text style={styles.infoText}>Comparte una duda, un testimonio o pide oración. Estamos para apoyarnos.</Text>
                </View>

                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.titleInput}
                    placeholder="¿De qué trata tu publicación?"
                    placeholderTextColor="#9BA1A6"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                />

                <Text style={styles.label}>Categoría</Text>
                <View style={styles.categoryGrid}>
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.categoryBtn, categoryId === cat.id && styles.categoryBtnActive]}
                            onPress={() => setCategoryId(cat.id)}
                        >
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                            <Text style={[styles.categoryName, categoryId === cat.id && styles.categoryNameActive]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Contenido</Text>
                <TextInput
                    style={styles.contentInput}
                    placeholder="Escribe aquí lo quieras compartir..."
                    placeholderTextColor="#9BA1A6"
                    multiline
                    numberOfLines={8}
                    value={content}
                    onChangeText={setContent}
                    maxLength={3000}
                    textAlignVertical="top"
                />

                <View style={styles.anonymousSection}>
                    <TouchableOpacity
                        style={styles.toggleRow}
                        onPress={() => setIsAnonymous(!isAnonymous)}
                    >
                        <View style={[styles.toggleBackground, isAnonymous && styles.toggleActive]}>
                            <View style={[styles.toggleCircle, isAnonymous && styles.toggleCircleActive]} />
                        </View>
                        <View style={styles.toggleTextContainer}>
                            <Text style={styles.toggleTitle}>Publicar de forma anónima</Text>
                            <Text style={styles.toggleSubtitle}>Tu nombre no será visible para los demás.</Text>
                        </View>
                        <Shield size={20} color={isAnonymous ? '#f3b33e' : '#9BA1A6'} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    sendButton: {
        marginRight: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendText: {
        color: '#f3b33e',
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        padding: 24,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F1F3F5',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#495057',
        lineHeight: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    titleInput: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#0B1B32',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    categoryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    categoryBtnActive: {
        borderColor: '#f3b33e',
        backgroundColor: 'rgba(243, 179, 62, 0.1)',
    },
    categoryIcon: {
        fontSize: 16,
    },
    categoryName: {
        fontSize: 12,
        color: '#687076',
    },
    categoryNameActive: {
        color: '#0B1B32',
        fontWeight: 'bold',
    },
    contentInput: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#0B1B32',
        height: 200,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        marginBottom: 24,
    },
    anonymousSection: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    toggleBackground: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E9ECEF',
        padding: 2,
    },
    toggleActive: {
        backgroundColor: '#0B1B32',
    },
    toggleCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    toggleCircleActive: {
        transform: [{ translateX: 20 }],
    },
    toggleTextContainer: {
        flex: 1,
    },
    toggleTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    toggleSubtitle: {
        fontSize: 11,
        color: '#9BA1A6',
        marginTop: 2,
    },
});
