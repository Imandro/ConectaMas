import type { Metadata, Viewport } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.scss'; // Importamos nuestros estilos globales (Bootstrap modificado)
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NotificationPrompt from './components/NotificationPrompt';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'react-hot-toast';
import OfflineAlert from '@/components/OfflineAlert';

const fredoka = Fredoka({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-fredoka',
});

export const metadata: Metadata = {
    title: 'Conecta+ | Acompañamiento Espiritual',
    description: 'No estás solo. Dios sigue contigo. Una app para crecer y sanar.',
    manifest: '/manifest.json', // Para PWA
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Conecta+',
    },
    formatDetection: {
        telephone: false,
    },
    other: {
        'google-adsense-account': 'ca-pub-9787254836039496',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#ffffff',
};

import { Providers } from './components/Providers';
import AnnouncementModal from './components/AnnouncementModal';

import { auth } from './lib/auth';
import GoogleAdSense from './components/monetization/GoogleAdSense';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const serializableSession = session ? JSON.parse(JSON.stringify(session)) : null;

    return (
        <html lang="es">
            <body className={`${fredoka.variable} font-fredoka`}>
                <OfflineAlert />
                <Providers session={serializableSession}>
                    <GoogleAdSense pId="ca-pub-9787254836039496" />
                    <main className="main-content">
                        {children}
                    </main>
                    <AnnouncementModal />
                    <PWAInstallPrompt />
                    <NotificationPrompt />
                    <Analytics />
                    <Toaster position="top-center" />
                </Providers>
            </body>
        </html>
    );
}
