import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BookOpen, ChevronRight, Filter } from 'lucide-react-native';

const CATEGORIES = [
    'Todos', 'Identidad', 'Propósito', 'Relaciones', 'Pureza', 'Ansiedad', 'Adicciones'
];

const MOCK_DEVOTIONALS = [
    { id: '1', title: 'Identidad en Cristo', category: 'Identidad', completed: true },
    { id: '2', title: 'Venciendo la Ansiedad', category: 'Ansiedad', completed: false },
    { id: '3', title: 'Paz en la Tormenta', category: 'Ansiedad', completed: false },
    { id: '4', title: 'Tu Propósito Real', category: 'Propósito', completed: false },
];

export default function DevotionalsScreen() {
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filtered = selectedCategory === 'Todos'
        ? MOCK_DEVOTIONALS
        : MOCK_DEVOTIONALS.filter(d => d.category === selectedCategory);

    return (
        <View style={styles.container}>
            <View style={styles.categoriesContainer}>
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

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.devotionalCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <BookOpen size={20} color={item.completed ? '#2ECC71' : '#f3b33e'} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardCategory}>{item.category}</Text>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                            </View>
                            <ChevronRight size={20} color="#9BA1A6" />
                        </View>
                        {item.completed && (
                            <View style={styles.completedBadge}>
                                <Text style={styles.completedText}>Completado</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1B32',
    },
    categoriesContainer: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    categoriesScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
    },
    categoryBadgeActive: {
        backgroundColor: '#f3b33e',
        borderColor: '#f3b33e',
    },
    categoryText: {
        color: '#ECEDEE',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#0B1B32',
        fontWeight: 'bold',
    },
    listContent: {
        padding: 20,
        gap: 16,
    },
    devotionalCard: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#0B1B32',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    cardCategory: {
        fontSize: 12,
        color: '#f3b33e',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    completedBadge: {
        marginTop: 12,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    completedText: {
        color: '#2ECC71',
        fontSize: 12,
        fontWeight: '600',
    }
});
