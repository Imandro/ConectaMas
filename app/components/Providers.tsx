"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { MotionConfig } from "framer-motion";
import DesignVariantProvider from './DesignVariantProvider';
import { LanguageProvider } from '@/app/LanguageContext';
import type { Language, Region } from '@/app/lib/languages';
import OfflineAlert from '@/components/OfflineAlert';
import PWAInstallPrompt from './PWAInstallPrompt';
import NotificationPrompt from './NotificationPrompt';
export function Providers({ children, session }: { children: React.ReactNode, session: Session | null }) {
    return (
        <SessionProvider session={session}>
            <LanguageProvider
                initialLanguage={session?.user?.preferredLanguage as Language | undefined}
                initialRegion={session?.user?.region as Region | undefined}
            >
                <OfflineAlert />
                <PWAInstallPrompt />
                <NotificationPrompt />
                <MotionConfig reducedMotion="user">
                    <DesignVariantProvider>{children}</DesignVariantProvider>
                </MotionConfig>
            </LanguageProvider>
        </SessionProvider>
    );
}
