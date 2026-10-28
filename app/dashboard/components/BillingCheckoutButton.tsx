"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2, Smartphone } from "lucide-react";
import type { ProductCode, PaymentProvider } from "@/app/lib/billing/types";

declare global {
    interface Window {
        getDigitalGoodsService?: (provider: string) => Promise<any>;
    }
}

type Props = {
    productCode: ProductCode;
    label?: string;
    className?: string;
};

const PLAY_IDS: Partial<Record<ProductCode, string>> = {
    PREMIUM_MONTHLY: "conecta_premium_monthly",
    PREMIUM_YEARLY: "conecta_premium_yearly",
};

function isCapacitorRuntime() {
    if (typeof window === "undefined") return false;
    const markedByUrl = new URLSearchParams(window.location.search).get("conecta_native") === "capacitor";
    let markedByStorage = false;
    try {
        if (markedByUrl) localStorage.setItem("conecta_native", "capacitor");
        markedByStorage = localStorage.getItem("conecta_native") === "capacitor";
    } catch { /* ignore unavailable storage */ }
    return markedByUrl || markedByStorage || Boolean((window as Window & { Capacitor?: unknown }).Capacitor) || navigator.userAgent.includes("Capacitor");
}

async function verifyNativePurchase(productId: string, purchaseToken: string, claimId?: string) {
    return fetch("/api/billing/google-play/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, purchaseToken, claimId }),
    });
}

export default function BillingCheckoutButton({ productCode, label = "Continuar al pago", className = "btn btn-primary rounded-pill" }: Props) {
    const [providers, setProviders] = useState<PaymentProvider[]>([]);
    const [amount, setAmount] = useState<number | null>(null);
    const [playBilling, setPlayBilling] = useState(false);
    const [nativePlayBilling, setNativePlayBilling] = useState(false);
    const [nativeApp, setNativeApp] = useState(false);
    const [storePrice, setStorePrice] = useState<string | null>(null);
    const [twaWithoutPlayBilling, setTwaWithoutPlayBilling] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;
        const isCapacitor = isCapacitorRuntime();
        const isTwa = typeof document !== "undefined" && !isCapacitor && (document.referrer.startsWith("android-app://") || navigator.userAgent.includes("; wv"));
        if (active) setNativeApp(isCapacitor);
        const runtimePlayBilling = typeof window !== "undefined" && typeof window.getDigitalGoodsService === "function" && typeof window.PaymentRequest === "function";
        fetch(`/api/billing/products?channel=web`)
            .then((response) => response.json())
            .then((data) => {
                if (isCapacitor) return;
                const product = data.products?.find((item: any) => item.code === productCode);
                if (active) {
                    setProviders(data.enabled ? (product?.providers ?? []) : []);
                    setAmount(product?.amount ?? null);
                    if (!data.enabled) setMessage("Checkout aún no está habilitado.");
                    else if (!product?.providers?.length) setMessage("No hay un proveedor habilitado para este producto y país.");
                }
            })
            .catch(() => active && setMessage("No se pudo cargar métodos de pago."));
        if (productCode.startsWith("PREMIUM_") && isCapacitor) {
            const productId = PLAY_IDS[productCode];
            if (productId) {
                import("@capgo/native-purchases").then(async ({ NativePurchases, PURCHASE_TYPE }) => {
                    const support = await NativePurchases.isBillingSupported();
                    const storeProducts = support.isBillingSupported ? (await NativePurchases.getProducts({ productIdentifiers: [productId], productType: PURCHASE_TYPE.SUBS })).products : [];
                    const storeProduct = storeProducts.find((product) => product.identifier === productId);
                    if (active) {
                        setNativePlayBilling(Boolean(support.isBillingSupported && storeProduct));
                        setStorePrice(storeProduct?.priceString || null);
                    }
                    if (support.isBillingSupported && storeProduct) {
                        const purchases = (await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.SUBS })).purchases;
                        for (const purchase of purchases) {
                            if (purchase.productIdentifier !== productId || !purchase.purchaseToken) continue;
                            const claim = await fetch("/api/billing/google-play/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId }) });
                            const claimData = claim.ok ? await claim.json() : null;
                            await verifyNativePurchase(productId, purchase.purchaseToken, claimData?.claimId);
                        }
                    }
                }).catch(() => active && setMessage("Google Play Billing no está disponible en este dispositivo."));
            }
        } else if (productCode.startsWith("PREMIUM_")) {
            fetch(`/api/billing/products?channel=play`)
                .then((response) => response.json())
                .then((data) => {
                    const product = data.products?.find((item: any) => item.code === productCode);
                    const enabled = runtimePlayBilling && data.enabled && product?.providers?.includes("google_play");
                    if (active) {
                        setPlayBilling(Boolean(enabled));
                        setTwaWithoutPlayBilling(Boolean(isTwa && !enabled));
                    }
                    if (enabled && window.getDigitalGoodsService) {
                        window.getDigitalGoodsService("https://play.google.com/billing").then(async (service) => {
                            const purchases = await service.listPurchases?.() || [];
                            for (const purchase of purchases) {
                                if (typeof purchase?.itemId !== "string" || typeof purchase?.purchaseToken !== "string") continue;
                                const claim = await fetch("/api/billing/google-play/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId: purchase.itemId }) });
                                const claimData = claim.ok ? await claim.json() : null;
                                await fetch("/api/billing/google-play/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId: purchase.itemId, purchaseToken: purchase.purchaseToken, claimId: claimData?.claimId }) });
                            }
                        }).catch(() => undefined);
                    }
                }).catch(() => active && isTwa && setTwaWithoutPlayBilling(true));
        } else if (active) {
            setTwaWithoutPlayBilling(isTwa);
        }
        return () => { active = false; };
    }, [productCode]);

    async function checkout(provider: PaymentProvider) {
        setBusy(provider);
        setMessage("");
        try {
            const response = await fetch(`/api/billing/checkout/${provider}`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ productCode, returnPath: productCode.startsWith("PREMIUM_") ? "/dashboard/premium?billing=return" : "/dashboard/support?billing=return", cancelPath: productCode.startsWith("PREMIUM_") ? "/dashboard/premium?billing=cancel" : "/dashboard/support?billing=cancel" }),
            });
            const data = await response.json();
            if (!response.ok || !data.redirectUrl) throw new Error(data.message || "No se pudo iniciar el pago.");
            window.location.assign(data.redirectUrl);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "No se pudo iniciar el pago.");
        } finally {
            setBusy(null);
        }
    }

    async function checkoutPlay() {
        const productId = PLAY_IDS[productCode];
        if (!productId || !window.getDigitalGoodsService) return;
        setBusy("google_play");
        setMessage("");
        let purchaseResponse: any = null;
        try {
            const service = await window.getDigitalGoodsService("https://play.google.com/billing");
            const details = (await service.getDetails([productId]))?.[0];
            if (!details) throw new Error("Producto de Google Play no disponible.");
            const claimResponse = await fetch("/api/billing/google-play/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId }) });
            const claimData = await claimResponse.json();
            if (!claimResponse.ok || typeof claimData.claimId !== "string") throw new Error(claimData.message || "No se pudo preparar la compra.");
            const request = new PaymentRequest(
                [{ supportedMethods: "https://play.google.com/billing", data: { sku: productId } }],
                { total: { label: "Conecta+ Premium", amount: { currency: details.price.currency, value: details.price.value } } },
            );
            purchaseResponse = await request.show();
            const purchaseToken = purchaseResponse.details?.purchaseToken;
            if (typeof purchaseToken !== "string") throw new Error("Token de compra ausente.");
            const verification = await fetch("/api/billing/google-play/verify", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ productId, purchaseToken, claimId: claimData.claimId }),
            });
            if (!verification.ok) throw new Error("Google Play no pudo confirmar la compra.");
            await purchaseResponse.complete("success");
            window.location.assign("/dashboard/premium?billing=active");
        } catch (error) {
            if (purchaseResponse) await purchaseResponse.complete("fail").catch(() => undefined);
            setMessage(error instanceof Error ? error.message : "No se pudo completar la compra.");
        } finally {
            setBusy(null);
        }
    }

    async function checkoutNativePlay() {
        const productId = PLAY_IDS[productCode];
        if (!productId) return;
        setBusy("google_play");
        setMessage("");
        try {
            const { NativePurchases, PURCHASE_TYPE } = await import("@capgo/native-purchases");
            const storeProduct = (await NativePurchases.getProducts({ productIdentifiers: [productId], productType: PURCHASE_TYPE.SUBS })).products.find((product) => product.identifier === productId);
            if (!storeProduct) throw new Error("Producto de Google Play no disponible.");
            const claimResponse = await fetch("/api/billing/google-play/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId }) });
            const claimData = await claimResponse.json();
            if (!claimResponse.ok || typeof claimData.claimId !== "string") throw new Error(claimData.message || "No se pudo preparar la compra.");
            const transaction = await NativePurchases.purchaseProduct({ productIdentifier: productId, productType: PURCHASE_TYPE.SUBS, planIdentifier: storeProduct.planIdentifier, offerToken: storeProduct.offerToken, autoAcknowledgePurchases: false });
            if (!transaction.purchaseToken) throw new Error("Token de compra ausente.");
            const verification = await verifyNativePurchase(productId, transaction.purchaseToken, claimData.claimId);
            if (!verification.ok) throw new Error("Google Play no pudo confirmar la compra.");
            window.location.assign("/dashboard/premium?billing=active");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "No se pudo completar la compra.");
        } finally {
            setBusy(null);
        }
    }

    if (nativeApp && nativePlayBilling && productCode.startsWith("PREMIUM_")) {
        return <button type="button" className={className} onClick={checkoutNativePlay} disabled={busy !== null}>
            {busy === "google_play" ? <Loader2 size={17} className="spin" /> : <Smartphone size={17} />} {label}{storePrice ? ` · ${storePrice}` : ""}
            {message && <span className="d-block small mt-2">{message}</span>}
        </button>;
    }
    if (playBilling && productCode.startsWith("PREMIUM_")) {
        return <button type="button" className={className} onClick={checkoutPlay} disabled={busy !== null}>
            {busy === "google_play" ? <Loader2 size={17} className="spin" /> : <Smartphone size={17} />} {label}
            {message && <span className="d-block small mt-2">{message}</span>}
        </button>;
    }

    if (nativeApp) return <p className="small text-muted mb-0">Los pagos dentro de la app publicada se gestionan mediante Google Play Billing.</p>;

    if (twaWithoutPlayBilling) return <p className="small text-muted mb-0">Los pagos dentro de la app publicada se gestionan mediante Google Play Billing.</p>;

    return <div className="d-flex flex-wrap gap-2 align-items-center">
        {providers.map((provider) => <button key={provider} type="button" className={className} onClick={() => checkout(provider)} disabled={busy !== null}>
            {busy === provider ? <Loader2 size={17} className="spin" /> : <CreditCard size={17} />} {provider === "pagadito" ? "Pagar con Pagadito" : "Pagar con PayPal"}{amount ? ` · $${amount.toFixed(2)}` : ""}
        </button>)}
        {message && <span className="small text-danger">{message}</span>}
    </div>;
}
