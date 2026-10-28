"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Crown, RefreshCw, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import SecondaryPageShell from "@/app/components/SecondaryUI";
import BillingCheckoutButton from "@/app/dashboard/components/BillingCheckoutButton";
import PaypalReturnHandler from "@/app/dashboard/components/PaypalReturnHandler";
import { useLanguage } from "@/app/LanguageContext";
import { languageLocale } from "@/app/lib/languages";

type Account = {
    requiresGuardian?: boolean;
    entitlement?: { active: boolean; status: string; expiresAt: string | null; provider: string | null };
    subscriptions?: Array<{ id: string; provider: string; providerSubscriptionId: string; productCode: string; status: string; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean }>;
    transactions?: Array<{ id: string; provider: string; productCode: string | null; amount: number | string; currency: string; status: string; createdAt: string }>;
};

const BILLING_ME_TTL = 5 * 60 * 1000;

export default function PremiumPage() {
    const [account, setAccount] = useState<Account | null>(null);
    const [message, setMessage] = useState("");
    const { data: session } = useSession();
    const { language, t } = useLanguage();
    const copy = t.billing_page;
    const sessionUser = session?.user as { id?: string; email?: string } | undefined;
    const billingUserKey = sessionUser?.id || sessionUser?.email || '';
    const activeBillingUserRef = useRef(billingUserKey);
    activeBillingUserRef.current = billingUserKey;

    const refresh = useCallback(async (force = false) => {
        if (!billingUserKey) {
            setAccount(null);
            return;
        }

        const storageKey = `conecta:billing-me:${billingUserKey}`;
        if (!force) {
            try {
                const cached = sessionStorage.getItem(storageKey);
                if (cached) {
                    const snapshot = JSON.parse(cached) as { updatedAt?: number; data?: Account };
                    if (snapshot.updatedAt && snapshot.data && Date.now() - snapshot.updatedAt < BILLING_ME_TTL) {
                        setAccount(snapshot.data);
                        return;
                    }
                }
            } catch {
                // Session storage may be unavailable in private browsing.
            }
        }

        const response = await fetch("/api/billing/me", { cache: 'no-store' });
        if (!response.ok || activeBillingUserRef.current !== billingUserKey) return;
        const data = await response.json() as Account;
        setAccount(data);
        try {
            sessionStorage.setItem(storageKey, JSON.stringify({ updatedAt: Date.now(), data }));
        } catch {
            // Session storage may be unavailable in private browsing.
        }
    }, [billingUserKey]);

    useEffect(() => {
        setAccount(null);
        refresh().catch(() => setMessage(copy.load_error));
    }, [copy.load_error, refresh]);

    async function cancel(subscription: NonNullable<Account["subscriptions"]>[number]) {
        if (subscription.provider !== "paypal") {
            setMessage(copy.google_play_cancel);
            return;
        }
        if (!window.confirm(copy.cancel_confirm)) return;
        const response = await fetch("/api/billing/subscription/cancel", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ provider: subscription.provider, subscriptionId: subscription.providerSubscriptionId }),
        });
        if (!response.ok) setMessage("No se pudo cancelar la suscripción.");
        await refresh(true);
    }

    const active = account?.entitlement?.active;
    return <SecondaryPageShell>
        <PaypalReturnHandler />
        <main className="min-vh-100 py-4" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
            <div className="container" style={{ maxWidth: 760 }}>
                <Link href="/dashboard" className="btn btn-light rounded-circle mb-4" aria-label={copy.back_aria}><ArrowLeft size={20} /></Link>
                <section className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center gap-3 mb-2"><Crown className="text-warning" /><h1 className="h3 mb-0">{copy.title}</h1></div>
                        <p className="text-muted">{copy.body}</p>
                        {active ? <div className="alert alert-success d-flex gap-2 align-items-center"><CheckCircle2 size={18} /> {copy.active}{account?.entitlement?.expiresAt ? ` ${copy.until} ${new Date(account.entitlement.expiresAt).toLocaleDateString(languageLocale(language))}` : ""}.</div> : <div className="row g-3">
                            <div className="col-md-6"><div className="border rounded-4 p-3 h-100"><h2 className="h5">{copy.monthly}</h2><p className="small text-muted">{copy.monthly_description}</p><BillingCheckoutButton productCode="PREMIUM_MONTHLY" label={copy.monthly_button} className="btn btn-primary rounded-pill w-100" /></div></div>
                            <div className="col-md-6"><div className="border border-warning rounded-4 p-3 h-100"><h2 className="h5">{copy.yearly}</h2><p className="small text-muted">{copy.yearly_description}</p><BillingCheckoutButton productCode="PREMIUM_YEARLY" label={copy.yearly_button} className="btn btn-warning rounded-pill w-100" /></div></div>
                        </div>}
                        {account?.requiresGuardian && <p className="small text-warning mt-3 mb-0">{copy.guardian}</p>}
                        <div className="small text-muted mt-3 d-flex gap-2"><ShieldCheck size={16} /> {copy.verification}</div>
                        {message && <div className="alert alert-warning mt-3 mb-0">{message}</div>}
                    </div>
                </section>

                {account?.subscriptions?.length ? <section className="card border-0 shadow-sm rounded-4 mb-4"><div className="card-body p-4"><h2 className="h5">{copy.subscriptions}</h2>{account.subscriptions.map((subscription) => <div key={subscription.id} className="d-flex justify-content-between align-items-center border-top py-3"><div><strong>{subscription.productCode}</strong><div className="small text-muted">{subscription.provider} · {subscription.status}</div></div>{subscription.status !== "CANCELLED" && subscription.productCode === "PREMIUM_MONTHLY" && (subscription.provider === "google_play" ? <a className="btn btn-outline-primary btn-sm rounded-pill" href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noreferrer">{copy.manage}</a> : <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => cancel(subscription)}>{copy.cancel}</button>)}</div>)}</div></section> : null}

                {account?.transactions?.length ? <section className="card border-0 shadow-sm rounded-4"><div className="card-body p-4"><h2 className="h5">{copy.history}</h2>{account.transactions.map((transaction) => <div key={transaction.id} className="d-flex justify-content-between border-top py-2 small"><span>{transaction.productCode || "Support"} · {transaction.provider}</span><span>{transaction.status} · {transaction.amount} {transaction.currency}</span></div>)}</div></section> : <div className="text-muted small"><RefreshCw size={14} /> {copy.no_payments}</div>}
            </div>
        </main>
    </SecondaryPageShell>;
}
