import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, FlatList, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { BookOpen, ChevronRight, Filter, Sparkles } from 'lucide-react-native';
import client from '@/api/client';
import { router, useFocusEffect } from 'expo-router';

const CATEGORIES = [
    'Para ti', 'Identidad', 'Propósito', 'Relaciones', 'Pureza', 'Ansiedad', 'Adicciones', 'Oración', 'Integridad', 'Soledad', 'Culpa', 'Ira', 'Envidia', 'Comunidad'
];

export default function DevotionalsScreen() {
    const [selectedCategory, setSelectedCategory] = useState('Para ti');
    const [devotionals, setDevotionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDevotionals = async () => {
        try {
            const isRecommended = selectedCategory === 'Para ti';
            const url = `/devotionals?${isRecommended ? 'recommended=true' : `categoryId=${selectedCategory}`}`;
            const response = await client.get(url);
            setDevotionals(response.data);
        } catch (error) {
            console.error('Error fetching devotionals:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDevotionals();
        }, [selectedCategory])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchDevotionals();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Devocionales</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            style={[styles.categoryBadge, selectedCategory === cat && styles.categoryBadgeActive]}
                        >
                            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#f3b33e" />
                    <Text style={styles.loadingText}>Buscando inspiración...</Text>
                </View>
            ) : (
                <FlatList
                    data={devotionals}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No se encontraron devocionales en esta categoría.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.devotionalCard}
                            onPress={() => router.push({
                                pathname: '/devotional/[id]',
                                params: { id: item.id }
                            })}
                        >
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconContainer, item.completed && styles.iconContainerCompleted]}>
                                    {selectedCategory === 'Para ti' ? (
                                        <Sparkles size={20} color={item.completed ? '#2ECC71' : '#f3b33e'} />
                                    ) : (
                                        <BookOpen size={20} color={item.completed ? '#2ECC71' : '#0B1B32'} />
                                    )}
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardCategory}>{item.category}</Text>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardMeta}>{item.time} de lectura</Text>
                                </View>
                                <ChevronRight size={18} color="#9BA1A6" />
                            </View>
                            {item.completed && (
                                <View style={styles.completedBadge}>
                                    <Text style={styles.completedText}>Completado</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginLeft: 24,
        marginBottom: 16,
    },
    categoriesScroll: {
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 10,
    },
    categoryBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F3F5',
    },
    categoryBadgeActive: {
        backgroundColor: '#0B1B32',
    },
    categoryText: {
        color: '#687076',
        fontWeight: '600',
        fontSize: 13,
    },
    categoryTextActive: {
        color: 'white',
    },
    listContent: {
        padding: 24,
        gap: 16,
    },
    devotionalCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F1F3F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconContainerCompleted: {
        backgroundColor: '#E8F5E9',
    },
    cardInfo: {
        flex: 1,
    },
    cardCategory: {
        fontSize: 11,
        color: '#9BA1A6',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        color: '#0B1B32',
        fontWeight: 'bold',
    },
    completedBadge: {
        marginTop: 12,
        alignSelf: 'flex-start',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    completedText: {
        color: '#2ECC71',
        fontSize: 11,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 12,
        color: '#9BA1A6',
        fontSize: 14,
    },
    emptyText: {
        color: '#9BA1A6',
        fontSize: 14,
        textAlign: 'center',
    },
    cardMeta: {
        fontSize: 12,
        color: '#9BA1A6',
        marginTop: 4,
    },
});

