export interface User {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    role: string;
    username?: string;
    gender?: string;
    spiritualStatus?: string;
    spiritualLevel: string;
    hasCompletedOnboarding: boolean;
    hasSeenLlamiTutorial: boolean;
    leaderPhone?: string;
    age?: number;
    isPremium: boolean;
    isCounselor: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Devotional {
    id: string;
    title: string;
    scripture: string;
    content: string;
    prayer: string;
    application: string;
    tags: string;
    publishedAt: string;
    isPremium: boolean;
}

export interface ForumCategory {
    id: string;
    name: string;
    description?: string;
    icon?: string;
}

export interface ForumPost {
    id: string;
    userId: string;
    user: User;
    categoryId: string;
    category: ForumCategory;
    title: string;
    content: string;
    isAnonymous: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        replies: number;
    };
}

export interface ForumReply {
    id: string;
    postId: string;
    userId: string;
    user: User;
    content: string;
    isAnonymous: boolean;
    createdAt: string;
}

export interface DailyCheckin {
    id: string;
    userId: string;
    mood: string;
    note?: string;
    gratitude?: string;
    prayer?: string;
    createdAt: string;
}

export interface UserStruggle {
    id: string;
    userId: string;
    title: string;
    status: string;
    startDate: string;
    lastRelapse?: string;
    currentDay: number;
    completedDays: string;
    isStarted: boolean;
    gravity: number;
}

export interface Mascot {
    id: string;
    userId: string;
    level: number;
    experience: number;
    flamePoints: number;
    name: string;
    mood: string;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    url: string;
    category?: string;
}

export interface BibleVerse {
    id: string;
    reference: string;
    text: string;
    tags: string;
    book: string;
    chapter: number;
    verseNum: number;
}
