"use client";

import { Heart, Crown, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/LanguageContext";
import { useSession } from "next-auth/react";
import BillingCheckoutButton from "./BillingCheckoutButton";

const BILLING_ME_TTL = 5 * 60 * 1000;

export default function SupportFundingAd() {
    const { t } = useLanguage();
    const { data: session, status: sessionStatus } = useSession();
    const [isPremium, setIsPremium] = useState(false);
    const sessionUser = session?.user as { id?: string; email?: string } | undefined;
    const billingUserKey = sessionUser?.id || sessionUser?.email || '';

    useEffect(() => {
        if (sessionStatus === 'loading') return;
        if (!billingUserKey) {
            setIsPremium(false);
            return;
        }

        const storageKey = `conecta:billing-me:${billingUserKey}`;
        let cancelled = false;
        try {
            const cached = sessionStorage.getItem(storageKey);
            if (cached) {
                const snapshot = JSON.parse(cached) as { updatedAt?: number; data?: { entitlement?: { active?: boolean } } };
                if (snapshot.updatedAt && Date.now() - snapshot.updatedAt < BILLING_ME_TTL) {
                    if (!cancelled) setIsPremium(Boolean(snapshot.data?.entitlement?.active));
                    return;
                }
            }
        } catch {
            // Session storage may be unavailable in private browsing.
        }

        fetch("/api/billing/me", { cache: 'no-store' })
            .then((response) => response.ok ? response.json() : null)
            .then((data) => {
                if (!data || cancelled) return;
                setIsPremium(Boolean(data.entitlement?.active));
                try {
                    sessionStorage.setItem(storageKey, JSON.stringify({ updatedAt: Date.now(), data }));
                } catch {
                    // Session storage may be unavailable in private browsing.
                }
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [billingUserKey, sessionStatus]);

    if (isPremium) return null;

    return (
        <div className="card border-0 shadow-lg bg-dark text-white overflow-hidden position-relative animate-fade-in-up" style={{ borderRadius: '24px' }}>
            {/* Background elements */}
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
                <Crown size={120} className="text-warning rotate-12" />
            </div>

            <div className="card-body p-4 position-relative z-10">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="position-relative">
                        <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm" style={{ width: '60px', height: '60px' }}>
                            <Image
                                src="/images/mario-profile.jpg"
                                alt="Mario Alvarez"
                                width={60}
                                height={60}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>
                        <div className="position-absolute bottom-0 end-0 bg-warning text-dark rounded-circle p-1 border border-dark">
                            <Heart size={12} fill="currentColor" />
                        </div>
                    </div>
                    <div>
                        <h5 className="fw-bold m-0 text-white">{t.premium.title}</h5>
                        <p className="small text-white-50 m-0">{t.premium.subtitle}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="small text-white-50 lh-base mb-3">
                        {t.premium.body}
                    </p>

                    <div className="row g-2 mb-3">
                        <div className="col-12">
                            <div className="bg-white bg-opacity-10 p-2 rounded-3 border border-white-10 d-flex align-items-center gap-2">
                                <ShieldCheck size={18} className="text-warning" />
                                <span className="small">{t.premium.feature_no_ads}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <BillingCheckoutButton
                    productCode="PREMIUM_YEARLY"
                    label={t.premium.button}
                    className="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm py-3 hover-scale d-flex align-items-center justify-content-center gap-2"
                />
                <p className="text-center extra-small text-white-50 mt-3 mb-0">
                    {t.premium.footer}
                </p>
            </div>
        </div>
    );
}
