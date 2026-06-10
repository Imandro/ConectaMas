const LAST_READING_KEY = "conectaplus_bible_last_reading";

export interface LastReading {
  bookIndex: number;
  chapter: number;
  bookName: string;
  updatedAt: string;
}

export function getLastReadingLocal(): LastReading | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LAST_READING_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function saveLastReadingLocal(bookIndex: number, chapter: number, bookName: string): void {
  if (typeof window === "undefined") return;
  const data: LastReading = {
    bookIndex,
    chapter,
    bookName,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(LAST_READING_KEY, JSON.stringify(data));
}
