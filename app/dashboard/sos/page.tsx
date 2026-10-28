"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getSnapshot, saveSnapshot } from '@/app/lib/offlineStore';
import { getLeaderPhone } from './actions';
import SOSClient from "./SOSClient";

type SOSSnapshot = {
    leaderPhone: string | null;
};

export default function SOSPage() {
    const { data: session } = useSession();
    const userId = (session?.user as { id?: string; email?: string } | undefined)?.id
        || session?.user?.email
        || null;
    const [leaderPhone, setLeaderPhone] = useState<string | null>(null);

    useEffect(() => {
        setLeaderPhone(null);
        if (!userId) return;

        let active = true;
        const loadPhone = async () => {
            const cached = await getSnapshot<SOSSnapshot>('/dashboard/sos', userId);
            if (active && cached?.payload) setLeaderPhone(cached.payload.leaderPhone);
            if (navigator.onLine === false) return;

            const currentPhone = await getLeaderPhone();
            if (!active) return;
            setLeaderPhone(currentPhone);
            void saveSnapshot('/dashboard/sos', userId, { leaderPhone: currentPhone });
        };

        void loadPhone().catch(() => undefined);
        const onOnline = () => void loadPhone().catch(() => undefined);
        window.addEventListener('online', onOnline);
        return () => {
            active = false;
            window.removeEventListener('online', onOnline);
        };
    }, [userId]);

    return <SOSClient leaderPhone={leaderPhone} />;
}
