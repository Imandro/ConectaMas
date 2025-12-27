"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface GoogleAdSenseProps {
    pId: string; // Tu Publisher ID de Google AdSense
}

export default function GoogleAdSense({ pId }: GoogleAdSenseProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Zonas sensibles donde NO queremos que se cargue ni un solo script de anuncios
    const sensitiveRoutes = [
        "/dashboard/sos",
        "/dashboard/checkin",
        "/dashboard/bible",
        "/dashboard/devotionals",
        "/onboarding"
    ];

    const isSensitiveRoute = sensitiveRoutes.some(route => pathname.includes(route));
    const isPremium = (session?.user as any)?.isPremium;

    // Si es ruta sensible o el usuario es Premium, no cargamos nada
    if (isSensitiveRoute || isPremium) {
        return null;
    }

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
