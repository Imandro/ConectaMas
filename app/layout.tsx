import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Fredoka } from 'next/font/google';
import './globals.scss'; // Importamos nuestros estilos globales (Bootstrap modificado)
import { Toaster } from 'react-hot-toast';
import CacheCleanup from './components/CacheCleanup';

const fredoka = Fredoka({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-fredoka',
});

const baseMetadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://conectamas.live'),
    title: 'Conecta+ | Acompañamiento Espiritual',
    description: 'No estás solo. Dios sigue contigo. Una app para crecer y sanar.',
    manifest: '/manifest.json', // Para PWA
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Conecta+',
    },
    formatDetection: {
        telephone: false,
    },
    other: {
    },
    openGraph: {
        title: 'Conecta+ | Tu Espacio de Crecimiento Espiritual',
        description: 'Encuentra paz, comunidad y herramientas para fortalecer tu fe diaria. No estás solo.',
        url: 'https://conectamas.live',
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

const metadataByLanguage: Record<Language, { title: string; description: string }> = {
    es: { title: 'Conecta+ | Acompañamiento Espiritual', description: 'No estás solo. Dios sigue contigo. Una app para crecer y sanar.' },
    en: { title: 'Conecta+ | Spiritual Support', description: 'You are not alone. Find spiritual support, community, and growth.' },
    pt: { title: 'Conecta+ | Apoio Espiritual', description: 'Você não está sozinho. Encontre apoio espiritual, comunidade e crescimento.' },
    ro: { title: 'Conecta+ | Sprijin spiritual', description: 'Nu ești singur. Găsește sprijin spiritual, comunitate și creștere.' },
};

export async function generateMetadata(): Promise<Metadata> {
    const cookieLanguage = cookies().get('app-language')?.value;
    const language = isLanguage(cookieLanguage) ? cookieLanguage : 'es';
    const copy = metadataByLanguage[language];
    const locale = languageLocale(language).replace('-', '_');
    return {
        ...baseMetadata,
        title: copy.title,
        description: copy.description,
        openGraph: {
            ...baseMetadata.openGraph,
            title: copy.title,
            description: copy.description,
            locale,
        },
    };
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#F7F8FA',
    interactiveWidget: 'resizes-content',
};

import { Providers } from './components/Providers';


import { auth } from './lib/auth';
import { isLanguage, languageLocale, type Language } from './lib/languages';

import GlobalCookieCleanup from '@/app/components/GlobalCookieCleanup';
import OfflineUserSync from './components/OfflineUserSync';
import LegalConsentGate from './components/LegalConsentGate';
import PrivacyConsentBanner from './components/PrivacyConsentBanner';
import AnalyticsConsentGate from './components/AnalyticsConsentGate';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const serializableSession = session ? JSON.parse(JSON.stringify(session)) : null;
    const cookieLanguage = cookies().get('app-language')?.value;
    const activeLanguage = isLanguage(cookieLanguage)
        ? cookieLanguage
        : isLanguage(session?.user?.preferredLanguage)
            ? session.user.preferredLanguage
            : 'es';

    return (
        <html lang={activeLanguage} data-glass="balanced">
            <head>
                <script dangerouslySetInnerHTML={{
                    __html: `
            (function() {
              try {
                if (document.cookie.length > 2000) {
                  console.warn("Nuking large cookies in head to prevent 494...");
                  var cookies = document.cookie.split(";");
                  for (var i = 0; i < cookies.length; i++) {
                    var name = cookies[i].split("=")[0].trim();
                    if (name.includes("next-auth") || name.length > 50) {
                      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
                    }
                  }
                }
              } catch (e) {}
            })();
          `}} />
            </head>
            <body className={`${fredoka.variable} font-fredoka`}>
                <GlobalCookieCleanup />
                <Providers session={serializableSession}>
                        <OfflineUserSync />
                        <LegalConsentGate>
                            <main className="main-content safe-area-top">{children}</main>
                        </LegalConsentGate>
                        <CacheCleanup />
                        <AnalyticsConsentGate />
                        <PrivacyConsentBanner />
                        <Toaster position="top-center" />
                </Providers>
            </body>
        </html>
    );
}
