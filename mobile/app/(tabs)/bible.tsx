import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Search, Book as BookIcon, ChevronRight } from 'lucide-react-native';

const BOOKS = [
    { id: '1', name: 'Génesis', testamento: 'Antiguo' },
    { id: '2', name: 'Éxodo', testamento: 'Antiguo' },
    { id: '3', name: 'Levítico', testamento: 'Antiguo' },
    { id: '4', name: 'Números', testamento: 'Antiguo' },
    { id: '5', name: 'Deuteronomio', testamento: 'Antiguo' },
    { id: '6', name: 'Josué', testamento: 'Antiguo' },
    { id: '7', name: 'Jueces', testamento: 'Antiguo' },
    { id: '8', name: 'Rut', testamento: 'Antiguo' },
    { id: '40', name: 'Mateo', testamento: 'Nuevo' },
    { id: '41', name: 'Marcos', testamento: 'Nuevo' },
    { id: '42', name: 'Lucas', testamento: 'Nuevo' },
    { id: '43', name: 'Juan', testamento: 'Nuevo' },
];

export default function BibleScreen() {
    const [search, setSearch] = useState('');

    const filtered = BOOKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
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
                    <TouchableOpacity style={styles.bookItem}>
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

