"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { GuestStats, getGuestStats, ensureGuestId, isGuest as checkIsGuest } from '@/app/lib/guest';

interface GuestContextType {
  isGuest: boolean;
  guestId: string | null;
  stats: GuestStats;
  refreshStats: () => void;
}

const GuestContext = createContext<GuestContextType>({
  isGuest: false,
  guestId: null,
  stats: { name: 'Invitado', streak: 0, mascot: { name: 'Llami', level: 1, experience: 0, flamePoints: 0, mood: 'FELIZ' }, lastCheckin: null, hasCheckedInToday: false },
  refreshStats: () => { },
});

export function useGuest() {
  return useContext(GuestContext);
}

export function GuestProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [isGuest, setIsGuest] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [stats, setStats] = useState<GuestStats>({ name: 'Invitado', streak: 0, mascot: { name: 'Llami', level: 1, experience: 0, flamePoints: 0, mood: 'FELIZ' }, lastCheckin: null, hasCheckedInToday: false });

  useEffect(() => {
    if (session?.user) {
      setIsGuest(false);
      setGuestId(null);
      return;
    }
    const hasGuestCookie = document.cookie.includes('conectaplus_guest=true');
    const hasGuestId = checkIsGuest();
    const g = hasGuestCookie || hasGuestId;
    setIsGuest(g);
    if (g) {
      setGuestId(ensureGuestId());
      setStats(getGuestStats());
    }
  }, [session]);

  const refreshStats = useCallback(() => {
    if (isGuest) {
      setStats(getGuestStats());
    }
  }, [isGuest]);

  return (
    <GuestContext.Provider value={{ isGuest, guestId, stats, refreshStats }}>
      {children}
    </GuestContext.Provider>
  );
}
