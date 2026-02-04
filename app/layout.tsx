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
    openGraph: {
        title: 'Conecta+ | Tu Espacio de Crecimiento Espiritual',
        description: 'Encuentra paz, comunidad y herramientas para fortalecer tu fe diaria. No estás solo.',
        url: 'https://conectamas.app',
        siteName: 'Conecta+',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Conecta+ Home',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Conecta+ | Acompañamiento Espiritual',
        description: 'Una app para crecer, sanar y conectar con Dios.',
        images: ['/og-image.png'],
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
import { LanguageProvider } from '@/app/LanguageContext';
import LanguageRegionModal from './components/LanguageRegionModal';

import GlobalCookieCleanup from '@/app/components/GlobalCookieCleanup';

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
                <GlobalCookieCleanup />
                <OfflineAlert />
                <LanguageProvider>
                    <Providers session={serializableSession}>
                        <GoogleAdSense pId="ca-pub-9787254836039496" />
                        <LanguageRegionModal />
                        <main className="main-content">
                            {children}
                        </main>
                        <AnnouncementModal />
                        <PWAInstallPrompt />
                        <NotificationPrompt />
                        <Analytics />
                        <Toaster position="top-center" />
                    </Providers>
                </LanguageProvider>
            </body>
        </html>
    );
}
