import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';
import { User } from '../types';
import { router } from 'expo-router';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    async function loadStorageData() {
        try {
            const storedToken = await SecureStore.getItemAsync('userToken');
            const storedUser = await SecureStore.getItemAsync('userData');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                client.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (e) {
            console.error('Failed to load auth data', e);
        } finally {
            setIsLoading(false);
        }
    }

    const login = async (identifier: string, password: string) => {
        try {
            // NOTE: In a real scenario, you'd call /api/auth/mobile/login
            // For now, we simulate success if identifier is provided
            // const response = await client.post('/auth/login', { identifier, password });
            // const { user, token } = response.data;

            // Simulation for now
            const mockUser: User = {
                id: '1',
                name: 'Usuario Conecta',
                username: 'usuario',
                role: 'USER',
                spiritualLevel: 'Explorador',
                hasCompletedOnboarding: false,
                hasSeenLlamiTutorial: false,
                isPremium: false,
                isCounselor: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const mockToken = 'mock-jwt-token';

            setUser(mockUser);
            setToken(mockToken);

            await SecureStore.setItemAsync('userToken', mockToken);
            await SecureStore.setItemAsync('userData', JSON.stringify(mockUser));

            client.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

            if (mockUser.hasCompletedOnboarding) {
                router.replace('/(tabs)');
            } else {
                router.replace('/onboarding');
            }
        } catch (error) {
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            // const response = await client.post('/auth/register', data);
            // login(data.email || data.username, data.password);
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        delete client.defaults.headers.common['Authorization'];
        router.replace('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
