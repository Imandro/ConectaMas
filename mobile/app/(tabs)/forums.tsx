import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Users, Plus, MessageCircle, ChevronRight } from 'lucide-react-native';
import client from '@/api/client';

interface ForumCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    _count: {
        posts: number;
    };
}

export default function ForumsScreen() {
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await client.get('/forums/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCategories();
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Comunidad</Text>
                    <Text style={styles.subtitle}>Comparte, aprende y crece junto a otros</Text>
                </View>

                {loading && categories.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Cargando categorías...</Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {categories.map(category => (
                            <TouchableOpacity key={category.id} style={styles.categoryCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                                    <View style={styles.categoryInfo}>
                                        <Text style={styles.categoryName}>{category.name}</Text>
                                        <Text style={styles.categoryDesc} numberOfLines={1}>{category.description}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardFooter}>
                                    <View style={styles.postCount}>
                                        <MessageCircle size={14} color="#9BA1A6" />
                                        <Text style={styles.postCountText}>{category._count.posts} publicaciones</Text>
                                    </View>
                                    <ChevronRight size={16} color="#9BA1A6" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {categories.length === 0 && !loading && (
                    <View style={styles.emptyContainer}>
                        <Users size={48} color="#9BA1A6" />
                        <Text style={styles.emptyText}>No hay categorías disponibles aún.</Text>
                    </View>
                )}

                <View style={styles.footerSpace} />
            </ScrollView>

            <TouchableOpacity style={styles.fab}>
                <Plus size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#9BA1A6',
    },
    grid: {
        gap: 16,
    },
    categoryCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    categoryIcon: {
        fontSize: 32,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    categoryDesc: {
        fontSize: 12,
        color: '#9BA1A6',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
        paddingTop: 16,
    },
    postCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    postCountText: {
        fontSize: 12,
        color: '#9BA1A6',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0B1B32',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#9BA1A6',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        color: '#9BA1A6',
        textAlign: 'center',
    },
    footerSpace: {
        height: 80,
    }
});

