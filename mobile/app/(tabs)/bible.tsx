import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Search, Book as BookIcon, ChevronRight } from 'lucide-react-native';

const BOOKS = [
    // Antiguo Testamento
    { id: 'Genesis', name: 'Génesis', testamento: 'Antiguo' },
    { id: 'Exodo', name: 'Éxodo', testamento: 'Antiguo' },
    { id: 'Levitico', name: 'Levítico', testamento: 'Antiguo' },
    { id: 'Numeros', name: 'Números', testamento: 'Antiguo' },
    { id: 'Deuteronomio', name: 'Deuteronomio', testamento: 'Antiguo' },
    { id: 'Josue', name: 'Josué', testamento: 'Antiguo' },
    { id: 'Jueces', name: 'Jueces', testamento: 'Antiguo' },
    { id: 'Rut', name: 'Rut', testamento: 'Antiguo' },
    { id: '1 Samuel', name: '1 Samuel', testamento: 'Antiguo' },
    { id: '2 Samuel', name: '2 Samuel', testamento: 'Antiguo' },
    { id: '1 Reyes', name: '1 Reyes', testamento: 'Antiguo' },
    { id: '2 Reyes', name: '2 Reyes', testamento: 'Antiguo' },
    { id: '1 Cronicas', name: '1 Crónicas', testamento: 'Antiguo' },
    { id: '2 Cronicas', name: '2 Crónicas', testamento: 'Antiguo' },
    { id: 'Esdras', name: 'Esdras', testamento: 'Antiguo' },
    { id: 'Nehemias', name: 'Nehemías', testamento: 'Antiguo' },
    { id: 'Ester', name: 'Ester', testamento: 'Antiguo' },
    { id: 'Job', name: 'Job', testamento: 'Antiguo' },
    { id: 'Salmos', name: 'Salmos', testamento: 'Antiguo' },
    { id: 'Proverbios', name: 'Proverbios', testamento: 'Antiguo' },
    { id: 'Eclesiastes', name: 'Eclesiastés', testamento: 'Antiguo' },
    { id: 'Cantares', name: 'Cantares', testamento: 'Antiguo' },
    { id: 'Isaias', name: 'Isaías', testamento: 'Antiguo' },
    { id: 'Jeremias', name: 'Jeremías', testamento: 'Antiguo' },
    { id: 'Lamentaciones', name: 'Lamentaciones', testamento: 'Antiguo' },
    { id: 'Ezequiel', name: 'Ezequiel', testamento: 'Antiguo' },
    { id: 'Daniel', name: 'Daniel', testamento: 'Antiguo' },
    { id: 'Oseas', name: 'Oseas', testamento: 'Antiguo' },
    { id: 'Joel', name: 'Joel', testamento: 'Antiguo' },
    { id: 'Amos', name: 'Amós', testamento: 'Antiguo' },
    { id: 'Abdias', name: 'Abdías', testamento: 'Antiguo' },
    { id: 'Jonas', name: 'Jonás', testamento: 'Antiguo' },
    { id: 'Miqueas', name: 'Miqueas', testamento: 'Antiguo' },
    { id: 'Nahum', name: 'Nahúm', testamento: 'Antiguo' },
    { id: 'Habacuc', name: 'Habacuc', testamento: 'Antiguo' },
    { id: 'Sofonias', name: 'Sofonías', testamento: 'Antiguo' },
    { id: 'Hageo', name: 'Hageo', testamento: 'Antiguo' },
    { id: 'Zacarias', name: 'Zacarías', testamento: 'Antiguo' },
    { id: 'Malaquias', name: 'Malaquías', testamento: 'Antiguo' },
    // Nuevo Testamento
    { id: 'Mateo', name: 'Mateo', testamento: 'Nuevo' },
    { id: 'Marcos', name: 'Marcos', testamento: 'Nuevo' },
    { id: 'Lucas', name: 'Lucas', testamento: 'Nuevo' },
    { id: 'Juan', name: 'Juan', testamento: 'Nuevo' },
    { id: 'Hechos', name: 'Hechos', testamento: 'Nuevo' },
    { id: 'Romanos', name: 'Romanos', testamento: 'Nuevo' },
    { id: '1 Corintios', name: '1 Corintios', testamento: 'Nuevo' },
    { id: '2 Corintios', name: '2 Corintios', testamento: 'Nuevo' },
    { id: 'Galatas', name: 'Gálatas', testamento: 'Nuevo' },
    { id: 'Efesios', name: 'Efesios', testamento: 'Nuevo' },
    { id: 'Filipenses', name: 'Filipenses', testamento: 'Nuevo' },
    { id: 'Colosenses', name: 'Colosenses', testamento: 'Nuevo' },
    { id: '1 Tesalonicenses', name: '1 Tesalonicenses', testamento: 'Nuevo' },
    { id: '2 Tesalonicenses', name: '2 Tesalonicenses', testamento: 'Nuevo' },
    { id: '1 Timoteo', name: '1 Timoteo', testamento: 'Nuevo' },
    { id: '2 Timoteo', name: '2 Timoteo', testamento: 'Nuevo' },
    { id: 'Tito', name: 'Tito', testamento: 'Nuevo' },
    { id: 'Filemon', name: 'Filemón', testamento: 'Nuevo' },
    { id: 'Hebreos', name: 'Hebreos', testamento: 'Nuevo' },
    { id: 'Santiago', name: 'Santiago', testamento: 'Nuevo' },
    { id: '1 Pedro', name: '1 Pedro', testamento: 'Nuevo' },
    { id: '2 Pedro', name: '2 Pedro', testamento: 'Nuevo' },
    { id: '1 Juan', name: '1 Juan', testamento: 'Nuevo' },
    { id: '2 Juan', name: '2 Juan', testamento: 'Nuevo' },
    { id: '3 Juan', name: '3 Juan', testamento: 'Nuevo' },
    { id: 'Judas', name: 'Judas', testamento: 'Nuevo' },
    { id: 'Apocalipsis', name: 'Apocalipsis', testamento: 'Nuevo' },
];

import { router } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BibleScreen() {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');

    const filtered = BOOKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 10 }]}>
                <Text style={styles.title}>La Biblia</Text>
                <View style={styles.searchInputWrapper}>
                    <Search size={20} color="#9BA1A6" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar libro..."
                        placeholderTextColor="#9BA1A6"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.bookItem}
                        onPress={() => router.push({
                            pathname: '/bible/[id]',
                            params: { id: item.name }
                        })}
                    >
                        <View style={styles.bookIconContainer}>
                            <BookIcon size={20} color="#0B1B32" />
                        </View>
                        <View style={styles.bookInfo}>
                            <Text style={styles.bookName}>{item.name}</Text>
                            <Text style={styles.testamentoText}>{item.testamento}</Text>
                        </View>
                        <ChevronRight size={18} color="#9BA1A6" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 16,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F3F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchInput: {
        flex: 1,
        color: '#0B1B32',
        marginLeft: 10,
        fontSize: 16,
    },
    listContent: {
        padding: 20,
    },
    bookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    bookIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F1F3F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bookInfo: {
        flex: 1,
    },
    bookName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    testamentoText: {
        fontSize: 12,
        color: '#9BA1A6',
        marginTop: 2,
    }
});

