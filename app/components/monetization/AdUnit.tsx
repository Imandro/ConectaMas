"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface AdUnitProps {
    slot: string;
    format?: "auto" | "fluid" | "rectangle";
    responsive?: "true" | "false";
    className?: string;
}

export default function AdUnit({ slot, format = "auto", responsive = "true", className = "" }: AdUnitProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const sensitiveRoutes = [
        "/dashboard/sos",
        "/dashboard/checkin",
        "/dashboard/bible",
        "/dashboard/devotionals",
        "/onboarding"
    ];

    const isSensitiveRoute = sensitiveRoutes.some(route => pathname.includes(route));
    const isPremium = (session?.user as any)?.isPremium;

    useEffect(() => {
        if (!isSensitiveRoute && !isPremium) {
            try {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense error:", e);
            }
        }
    }, [pathname, isSensitiveRoute, isPremium]);

    if (isSensitiveRoute || isPremium) {
        return null;
    }

    return (
        <div className={`ad-container my-4 text-center overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-9787254836039496"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            ></ins>
            <div className="text-muted small mt-1" style={{ fontSize: '10px' }}>Publicidad sustentable</div>
        </div>
    );
}
