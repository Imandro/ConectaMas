import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, Filter, FeGaussianBlur, FeComposite, G } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    withSequence,
    interpolate,
    useAnimatedStyle,
    Easing
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { getLlamiMessage } from '@/lib/mascot-messages';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

interface LlamiMascotProps {
    streak: number;
    lastMood?: string;
    level?: number;
    forceStage?: 'spark' | 'flame' | 'torch' | 'sun' | 'star';
    name?: string;
}

export const LlamiMascot = ({ streak, lastMood, level = 1, forceStage, name }: LlamiMascotProps) => {
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const stage = useMemo(() => {
        if (forceStage) return forceStage;
        if (streak <= 2) return 'spark';
        if (streak <= 14) return 'flame';
        if (streak <= 60) return 'torch';
        if (streak <= 180) return 'sun';
        return 'star';
    }, [streak, forceStage]);

    const getColors = () => {
        switch (stage) {
            case 'spark': return { p: '#EAB308', s: '#FDE047' };
            case 'flame': return { p: '#CA8A04', s: '#FCD34D' };
            case 'torch': return { p: '#F59E0B', s: '#FEF3C7' };
            case 'sun': return { p: '#0F172A', s: '#38BDF8' };
            case 'star': return { p: '#1E3A8A', s: '#60A5FA' };
            default: return { p: '#EAB308', s: '#FDE047' };
        }
    };

    const c = getColors();

    // Animations
    const floatY = useSharedValue(0);
    const auraScale = useSharedValue(1);
    const coreOpacity = useSharedValue(0.4 + level * 0.05);

    useEffect(() => {
        floatY.value = withRepeat(
            withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );
        auraScale.value = withRepeat(
            withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );
        coreOpacity.value = withRepeat(
            withTiming(0.7 + level * 0.05, { duration: 750, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );

        const welcomeMsg = getLlamiMessage(streak, lastMood, false);
        setMessage(welcomeMsg);
        const timer = setTimeout(() => setShowMessage(true), 1500);
        const hideTimer = setTimeout(() => setShowMessage(false), 6500);
        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [streak, lastMood, level]);

    const animatedMascotStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: floatY.value }]
    }));

    const auraProps = useAnimatedProps(() => ({
        transform: [{ scale: auraScale.value }],
        opacity: interpolate(auraScale.value, [1, 1.15], [0.15, 0.3])
    }));

    const handleClick = () => {
        const clickMsg = getLlamiMessage(streak, lastMood, true);
        setMessage(clickMsg);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
    };

    return (
        <View style={styles.container}>
            {showMessage && (
                <View style={styles.bubbleContainer}>
                    <View style={styles.bubble}>
                        <Text style={styles.messageText}>{message}</Text>
                        <View style={styles.bubbleArrow} />
                    </View>
                </View>
            )}

            <TouchableOpacity onPress={handleClick} activeOpacity={0.9}>
                <Animated.View style={[styles.mascotWrapper, animatedMascotStyle]}>
                    <Svg viewBox="0 0 100 100" width={100} height={100}>
                        <Defs>
                            <RadialGradient id={`grad-${stage}`} cx="50%" cy="50%" r="50%">
                                <Stop offset="0%" stopColor={c.s} />
                                <Stop offset="100%" stopColor={c.p} />
                            </RadialGradient>
                        </Defs>

                        {/* Aura */}
                        <AnimatedCircle
                            cx="50" cy="55" r="40"
                            fill={`url(#grad-${stage})`}
                            animatedProps={auraProps}
                        />

                        {/* Body */}
                        <Path
                            d="M 50 10 Q 75 35, 75 65 Q 75 90, 50 90 Q 25 90, 25 65 Q 25 35, 50 10"
                            fill={`url(#grad-${stage})`}
                        />

                        {/* Eyes */}
                        <Circle cx="40" cy="62" r="3.5" fill="#2c3e50" />
                        <Circle cx="60" cy="62" r="3.5" fill="#2c3e50" />
                        <Circle cx="41" cy="60.5" r="1.2" fill="white" />
                        <Circle cx="61" cy="60.5" r="1.2" fill="white" />

                        {/* Smile */}
                        <Path
                            d="M 44 72 Q 50 76, 56 72"
                            stroke="#2c3e50"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </Svg>

                    <View style={styles.streakBadge}>
                        <Text style={styles.streakText}>{streak}</Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>

            <View style={styles.nameBadge}>
                <Sparkles size={10} color="#0B1B32" />
                <Text style={styles.nameText}>{name || 'Llami'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
        width: 120,
    },
    mascotWrapper: {
        width: 100,
        height: 100,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubbleContainer: {
        position: 'absolute',
        bottom: '100%',
        width: 160,
        zIndex: 100,
        marginBottom: 10,
    },
    bubble: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#f3b33e',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    messageText: {
        color: '#0B1B32',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bubbleArrow: {
        position: 'absolute',
        top: '100%',
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: 'transparent',
        borderTopWidth: 8,
        borderTopColor: 'white',
        marginTop: -2,
    },
    streakBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#0B1B32',
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    nameBadge: {
        marginTop: 8,
        backgroundColor: 'white',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    nameText: {
        color: '#0B1B32',
        fontSize: 11,
        fontWeight: 'bold',
    }
});
