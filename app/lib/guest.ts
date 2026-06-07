const GUEST_ID_KEY = 'conectaplus_guest_id';
const GUEST_STATS_KEY = 'conectaplus_guest_stats';
const GUEST_SUGGESTION_KEY = 'conectaplus_guest_suggestion';

export function getGuestId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GUEST_ID_KEY);
}

export function createGuestId(): string {
  const id = crypto.randomUUID ? crypto.randomUUID() : 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  localStorage.setItem(GUEST_ID_KEY, id);
  return id;
}

export function ensureGuestId(): string {
  const existing = getGuestId();
  if (existing) return existing;
  return createGuestId();
}

export function clearGuestId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_ID_KEY);
  localStorage.removeItem(GUEST_STATS_KEY);
  localStorage.removeItem(GUEST_SUGGESTION_KEY);
}

export function isGuest(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(GUEST_ID_KEY);
}

export interface GuestStats {
  name: string;
  streak: number;
  mascot: { name: string; level: number; experience: number; flamePoints: number; mood: string };
  lastCheckin: { mood: string; createdAt: string } | null;
  hasCheckedInToday: boolean;
}

const defaultGuestStats: GuestStats = {
  name: 'Invitado',
  streak: 0,
  mascot: { name: 'Llami', level: 1, experience: 0, flamePoints: 0, mood: 'FELIZ' },
  lastCheckin: null,
  hasCheckedInToday: false,
};

export function getGuestStats(): GuestStats {
  if (typeof window === 'undefined') return defaultGuestStats;
  try {
    const stored = localStorage.getItem(GUEST_STATS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { }
  return { ...defaultGuestStats };
}

export function saveGuestStats(stats: GuestStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_STATS_KEY, JSON.stringify(stats));
}

export function updateGuestStreak(): GuestStats {
  const stats = getGuestStats();
  const today = new Date().toDateString();
  if (!stats.lastCheckin) {
    stats.streak = 1;
    stats.lastCheckin = { mood: 'ok', createdAt: new Date().toISOString() };
  } else {
    const lastDate = new Date(stats.lastCheckin.createdAt).toDateString();
    if (lastDate === today) return stats;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastDate === yesterday) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastCheckin = { mood: 'ok', createdAt: new Date().toISOString() };
  }
  stats.hasCheckedInToday = true;
  stats.mascot.experience += 5;
  if (stats.mascot.experience >= 100) {
    stats.mascot.level += 1;
    stats.mascot.experience = 0;
  }
  saveGuestStats(stats);
  return stats;
}

export function canShowSuggestion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(GUEST_SUGGESTION_KEY);
    const today = new Date().toDateString();
    if (!raw) {
      localStorage.setItem(GUEST_SUGGESTION_KEY, JSON.stringify({ date: today, count: 1 }));
      return true;
    }
    const data = JSON.parse(raw);
    if (data.date !== today) {
      localStorage.setItem(GUEST_SUGGESTION_KEY, JSON.stringify({ date: today, count: 1 }));
      return true;
    }
    if (data.count < 2) {
      localStorage.setItem(GUEST_SUGGESTION_KEY, JSON.stringify({ date: today, count: data.count + 1 }));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function migrateGuestDataToAccount(): { name?: string } {
  const stats = getGuestStats();
  clearGuestId();
  return { name: stats.name !== 'Invitado' ? stats.name : undefined };
}
