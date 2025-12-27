import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MessageCircle, ChevronLeft, Plus, Users, Calendar } from 'lucide-react-native';
import client from '@/api/client';

export default function CategoryPostsScreen() {
    const { id, name } = useLocalSearchParams();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = async () => {
        try {
            const response = await client.get(`/forums/posts?categoryId=${id}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching category posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: name as string || 'Publicaciones',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#0B1B32" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: '#0B1B32',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {loading && !refreshing ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#f3b33e" />
                        <Text style={styles.loadingText}>Cargando conversaciones...</Text>
                    </View>
                ) : posts.length === 0 ? (
                    <View style={styles.center}>
                        <Users size={48} color="#9BA1A6" />
                        <Text style={styles.emptyText}>Aún no hay publicaciones en esta categoría.</Text>
                        <TouchableOpacity style={styles.createFirstBtn} onPress={() => { }}>
                            <Text style={styles.createFirstBtnText}>Sé el primero en publicar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    posts.map(post => (
                        <TouchableOpacity
                            key={post.id}
                            style={styles.postCard}
                            onPress={() => router.push({
                                pathname: '/forum/post/[id]',
                                params: { id: post.id }
                            })}
                        >
                            <View style={styles.postHeader}>
                                <View style={styles.avatarMini}>
                                    <Text style={styles.avatarText}>
                                        {post.user ? post.user.name.charAt(0).toUpperCase() : 'A'}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>
                                        {post.isAnonymous ? 'Anónimo' : post.user?.name}
                                        {post.user?.isCounselor && <Text style={styles.counselorBadge}> • Consejero</Text>}
                                    </Text>
                                    <View style={styles.postMeta}>
                                        <Calendar size={12} color="#9BA1A6" />
                                        <Text style={styles.dateText}>{new Date(post.createdAt).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.postTitle}>{post.title}</Text>
                            <Text style={styles.postSnippet} numberOfLines={2}>{post.content}</Text>

                            <View style={styles.postFooter}>
                                <View style={styles.replyCount}>
                                    <MessageCircle size={16} color="#9BA1A6" />
                                    <Text style={styles.replyText}>{post._count.replies} respuestas</Text>
                                </View>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryBadgeText}>{post.category.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push({
                    pathname: '/forum/create',
                    params: { categoryId: id }
                })}
            >
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
    backButton: {
        marginLeft: 8,
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    loadingText: {
        marginTop: 12,
        color: '#9BA1A6',
    },
    emptyText: {
        marginTop: 16,
        color: '#9BA1A6',
        textAlign: 'center',
        fontSize: 16,
    },
    createFirstBtn: {
        marginTop: 24,
        backgroundColor: '#f3b33e',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    createFirstBtnText: {
        color: '#0B1B32',
        fontWeight: 'bold',
    },
    postCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarMini: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F3F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    counselorBadge: {
        color: '#f3b33e',
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    dateText: {
        fontSize: 12,
        color: '#9BA1A6',
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 8,
    },
    postSnippet: {
        fontSize: 14,
        color: '#687076',
        lineHeight: 20,
        marginBottom: 12,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
        paddingTop: 12,
    },
    replyCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    replyText: {
        fontSize: 12,
        color: '#9BA1A6',
    },
    categoryBadge: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    categoryBadgeText: {
        fontSize: 10,
        color: '#9BA1A6',
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0B1B32',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
});
