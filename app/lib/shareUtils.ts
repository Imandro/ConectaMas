/**
 * Share content using Web Share API with fallback to clipboard
 */
export async function shareContent(data: {
    title: string;
    text: string;
    url?: string;
}): Promise<{ success: boolean; method?: 'native' | 'clipboard' }> {
    try {
        // Check if Web Share API is available
        if (navigator.share) {
            await navigator.share({
                title: data.title,
                text: data.text,
                url: data.url || window.location.href
            });
            return { success: true, method: 'native' };
        } else {
            // Fallback to clipboard
            const shareText = `${data.title}\n\n${data.text}\n\n${data.url || window.location.href}`;
            await navigator.clipboard.writeText(shareText);
            return { success: true, method: 'clipboard' };
        }
    } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name === 'AbortError') {
            return { success: false };
        }
        console.error('Share failed:', error);
        return { success: false };
    }
}

/**
 * Share a devotional
 */
export function shareDevotional(devotional: {
    title: string;
    bibleVerse: string;
    bibleReference: string;
}) {
    return shareContent({
        title: `📖 ${devotional.title}`,
        text: `"${devotional.bibleVerse}" - ${devotional.bibleReference}\n\nLee este devocional completo en Conecta+ BETA`,
        url: window.location.href
    });
}

/**
 * Share a Bible verse
 */
export function shareBibleVerse(verse: {
    text: string;
    reference: string;
}) {
    return shareContent({
        title: `✝️ ${verse.reference}`,
        text: `"${verse.text}"\n\nDescubre más en Conecta+ BETA`,
    });
}

/**
 * Share a prayer
 */
export function sharePrayer(prayer: {
    title: string;
    content: string;
}) {
    return shareContent({
        title: `🙏 ${prayer.title}`,
        text: prayer.content,
    });
}
