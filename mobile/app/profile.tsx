import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { CustomButton } from '@/components/common/CustomButton';
import { User as UserIcon, Settings, Phone, Calendar, LogOut, ChevronRight, ShieldCheck, HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <UserIcon size={50} color="#f3b33e" />
                </View>
                <Text style={styles.name}>{user?.name || 'Guerrero'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{user?.spiritualLevel || 'Explorador'}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mi Cuenta</Text>

                <ProfileItem
                    icon={<UserIcon size={20} color="#0B1B32" />}
                    label="Nombre de usuario"
                    value={`@${user?.username || 'usuario'}`}
                />
                <ProfileItem
                    icon={<Calendar size={20} color="#0B1B32" />}
                    label="Edad"
                    value={user?.age?.toString() || 'No especificada'}
                />
                <ProfileItem
                    icon={<Phone size={20} color="#0B1B32" />}
                    label="Teléfono del Líder"
                    value={user?.leaderPhone || 'No configurado'}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Legal y Soporte</Text>

                <ProfileItem
                    icon={<ShieldCheck size={20} color="#0B1B32" />}
                    label="Términos y Condiciones"
                    onPress={() => { }}
                />
                <ProfileItem
                    icon={<HelpCircle size={20} color="#0B1B32" />}
                    label="Centro de Ayuda"
                    onPress={() => { }}
                />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <LogOut size={20} color="#FF4444" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <View style={styles.footerSpace} />
        </ScrollView>
    );
}

const ProfileItem = ({ icon, label, value, onPress }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={styles.itemLeft}>
            <View style={styles.iconContainer}>
                {icon}
            </View>
            <View>
                <Text style={styles.itemLabel}>{label}</Text>
                {value && <Text style={styles.itemValue}>{value}</Text>}
            </View>
        </View>
        <ChevronRight size={18} color="#9BA1A6" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#f3b33e',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#9BA1A6',
        marginBottom: 12,
    },
    levelBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    levelText: {
        color: '#1976D2',
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0B1B32',
        marginBottom: 16,
        paddingLeft: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        backgroundColor: '#F1F3F5',
        padding: 10,
        borderRadius: 12,
    },
    itemLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0B1B32',
    },
    itemValue: {
        fontSize: 12,
        color: '#9BA1A6',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 16,
        marginTop: 8,
    },
    logoutText: {
        color: '#FF4444',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerSpace: {
        height: 60,
    }
});

