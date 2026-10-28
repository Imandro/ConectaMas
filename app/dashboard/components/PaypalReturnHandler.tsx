"use client";

import { useEffect } from "react";

export default function PaypalReturnHandler() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("token");
        if (params.get("billing") !== "return" || !orderId || params.get("subscription_id")) return;
        fetch("/api/billing/checkout/paypal/capture", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ orderId }),
        }).catch(() => undefined);
    }, []);

    return null;
}
