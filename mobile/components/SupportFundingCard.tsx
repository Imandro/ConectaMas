import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { Crown, Heart, ShieldCheck } from 'lucide-react-native';

export const SupportFundingCard = () => {
    const handleSupport = () => {
        Linking.openURL('https://www.paypal.me/Imandrox/1').catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View style={styles.card}>
            {/* Background Decorative Element */}
            <View style={styles.backgroundIcon}>
                <Crown size={100} color="#f3b33e" style={{ opacity: 0.1, transform: [{ rotate: '15deg' }] }} />
            </View>

            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <View style={styles.avatar}>
                        <Image
                            source={{ uri: 'https://github.com/imandrox.png' }} // Fallback since local image might not be available
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.heartBadge}>
                        <Heart size={10} color="#0B1B32" fill="#0B1B32" />
                    </View>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.title}>Sustenta Conecta+</Text>
                    <Text style={styles.subtitle}>Aporta tu granito de arena por $1</Text>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.bodyText}>
                    Tu apoyo me ayuda a mantener servidores y llevar la palabra de Dios a más jóvenes.
                </Text>

                <View style={styles.featureRow}>
                    <ShieldCheck size={18} color="#f3b33e" />
                    <Text style={styles.featureText}>Sin anuncios de Google en toda la app</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSupport}>
                <Crown size={18} color="#0B1B32" />
                <Text style={styles.buttonText}>¡Ser Premium por $1 USD!</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                *Al donar, mándame tu email por PayPal para activar tu insignia.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#0B1B32',
        borderRadius: 24,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        marginTop: 20,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(243, 179, 62, 0.3)',
    },
    backgroundIcon: {
        position: 'absolute',
        top: -20,
        right: -20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    profileContainer: {
        position: 'relative',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#f3b33e',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#f3b33e',
        padding: 4,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#0B1B32',
    },
    headerText: {
        flex: 1,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    body: {
        marginBottom: 24,
    },
    bodyText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 10,
        borderRadius: 12,
        gap: 10,
    },
    featureText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#f3b33e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
        gap: 10,
    },
    buttonText: {
        color: '#0B1B32',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 15,
    }
});
