import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MessageCircle, ChevronLeft, Calendar, Send, User as UserIcon, Trash2, ShieldCheck, Heart } from 'lucide-react-native';
import client from '@/api/client';
import { useAuth } from '@/context/AuthContext';

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams();
    const { user: currentUser } = useAuth();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const fetchPost = async () => {
        try {
            const response = await client.get(`/forums/posts/${id}`);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post detail:', error);
            Alert.alert('Error', 'No se pudo cargar la publicación.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPost();
    };

    const handleSendReply = async () => {
        if (!replyContent.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await client.post(`/forums/posts/${id}/replies`, {
                content: replyContent.trim(),
                isAnonymous
            });

            // Add reply to list locally for instant feedback
            const newReply = response.data;
            setPost((prev: any) => ({
                ...prev,
                replies: [...prev.replies, {
                    ...newReply,
                    isOwner: true // The current user just created this
                }]
            }));
            setReplyContent('');
            setIsAnonymous(false);
        } catch (error) {
            console.error('Error sending reply:', error);
            Alert.alert('Error', 'No se pudo enviar la respuesta.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = () => {
        Alert.alert(
            'Eliminar Publicación',
            '¿Estás seguro de que quieres eliminar esta publicación?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await client.delete(`/forums/posts/${id}`);
                            router.back();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la publicación.');
                        }
                    }
                }
            ]
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#f3b33e" />
            </View>
        );
    }

    if (!post) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>No se encontró la publicación.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Volver a la comunidad</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: post.category?.name || 'Publicación',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#0B1B32" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => post.isOwner ? (
                        <TouchableOpacity onPress={handleDeletePost} style={styles.deleteButton}>
                            <Trash2 size={20} color="#FF4444" />
                        </TouchableOpacity>
                    ) : null,
                }}
            />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Main Post */}
                <View style={styles.mainPostCard}>
                    <View style={styles.authorRow}>
                        <View style={styles.avatarLarge}>
                            <UserIcon size={24} color="#0B1B32" />
                        </View>
                        <View style={styles.authorInfo}>
                            <Text style={styles.authorName}>
                                {post.isAnonymous ? 'Usuario Anónimo' : post.user?.name}
                                {post.user?.isCounselor && <Text style={styles.counselorBadge}> • Consejero</Text>}
                            </Text>
                            <View style={styles.metaRow}>
                                <Calendar size={12} color="#9BA1A6" />
                                <Text style={styles.dateText}>{new Date(post.createdAt).toLocaleDateString()}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.postTitle}>{post.title}</Text>
                    <Text style={styles.postContent}>{post.content}</Text>
                </View>

                {/* Replies Section */}
                <View style={styles.repliesHeader}>
                    <MessageCircle size={18} color="#0B1B32" />
                    <Text style={styles.repliesCount}>{post.replies?.length || 0} Respuestas</Text>
                </View>

                {post.replies?.map((reply: any) => (
                    <View key={reply.id} style={[styles.replyCard, reply.user?.isCounselor && styles.counselorReply]}>
                        <View style={styles.replyAuthorRow}>
                            <View style={styles.avatarSmall}>
                                <UserIcon size={14} color="#0B1B32" />
                            </View>
                            <Text style={styles.replyAuthorName}>
                                {reply.isAnonymous ? 'Anónimo' : reply.user?.name}
                                {reply.user?.isCounselor && <ShieldCheck size={14} color="#2ECC71" style={{ marginLeft: 4 }} />}
                            </Text>
                            <Text style={styles.replyDate}>{new Date(reply.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <Text style={styles.replyContentText}>{reply.content}</Text>
                    </View>
                ))}

                {(!post.replies || post.replies.length === 0) && (
                    <View style={styles.noReplies}>
                        <Text style={styles.noRepliesText}>Sé el primero en responder</Text>
                    </View>
                )}

                <View style={styles.footerSpace} />
            </ScrollView>

            {/* Reply Input */}
            <View style={styles.inputContainer}>
                <View style={styles.anonymousToggle}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, isAnonymous && styles.toggleBtnActive]}
                        onPress={() => setIsAnonymous(!isAnonymous)}
                    >
                        <View style={[styles.toggleCircle, isAnonymous && styles.toggleCircleActive]} />
                        <Text style={[styles.toggleText, isAnonymous && styles.toggleTextActive]}>Publicar como anónimo</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe tu respuesta..."
                        placeholderTextColor="#9BA1A6"
                        multiline
                        maxLength={1500}
                        value={replyContent}
                        onChangeText={setReplyContent}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!replyContent.trim() || isSubmitting) && styles.sendBtnDisabled]}
                        disabled={!replyContent.trim() || isSubmitting}
                        onPress={handleSendReply}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Send size={20} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        padding: 16,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        marginLeft: 8,
    },
    deleteButton: {
        marginRight: 16,
    },
    mainPostCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarLarge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F3F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    counselorBadge: {
        color: '#f3b33e',
        fontSize: 13,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#9BA1A6',
    },
    postTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 12,
    },
    postContent: {
        fontSize: 16,
        color: '#495057',
        lineHeight: 24,
    },
    repliesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    repliesCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    replyCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    counselorReply: {
        borderLeftWidth: 4,
        borderLeftColor: '#2ECC71',
        backgroundColor: '#F0FFF4',
    },
    replyAuthorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F1F3F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    replyAuthorName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0B1B32',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyDate: {
        fontSize: 11,
        color: '#9BA1A6',
    },
    replyContentText: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    noReplies: {
        padding: 40,
        alignItems: 'center',
    },
    noRepliesText: {
        color: '#9BA1A6',
        fontSize: 14,
    },
    footerSpace: {
        height: 100,
    },
    inputContainer: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    },
    anonymousToggle: {
        marginBottom: 12,
    },
    toggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    toggleBtnActive: {
        // Optional active style
    },
    toggleCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#CED4DA',
        backgroundColor: 'white',
    },
    toggleCircleActive: {
        borderColor: '#f3b33e',
        backgroundColor: '#f3b33e',
    },
    toggleText: {
        fontSize: 12,
        color: '#9BA1A6',
    },
    toggleTextActive: {
        color: '#0B1B32',
        fontWeight: 'bold',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        maxHeight: 120,
        fontSize: 14,
        color: '#0B1B32',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0B1B32',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        opacity: 0.5,
    },
    errorText: {
        color: '#FF4444',
        marginBottom: 12,
    },
    backLink: {
        color: '#0B1B32',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
