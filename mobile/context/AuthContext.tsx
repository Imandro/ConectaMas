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
    refreshUser: () => Promise<void>;
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
            const response = await client.post('/auth/mobile/login', { identifier, password });
            const { user, token } = response.data;

            setUser(user);
            setToken(token);

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(user));

            client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (user.hasCompletedOnboarding) {
                router.replace('/(tabs)');
            } else {
                router.replace('/onboarding');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            const response = await client.post('/auth/register', data);
            if (response.status === 201) {
                await login(data.email || data.username, data.password);
            }
        } catch (error) {
            console.error('Registration error:', error);
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

    const refreshUser = async () => {
        try {
            const response = await client.get('/auth/me');
            const updatedUser = response.data;
            setUser(updatedUser);
            await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Refresh user error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
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
