import webpush from 'web-push';
import { prisma } from './prisma';
import {
    DEFAULT_NOTIFICATION_CONCURRENCY,
    normalizeNotificationBatchLimit,
    normalizeNotificationConcurrency,
    takeNotificationBatch,
} from './notificationBatch';

import { config } from './config';
// Configuración de web-push
const { publicKey: vapidPublicKey, privateKey: vapidPrivateKey, subject: vapidSubject } = config.vapid;

if (vapidPublicKey && vapidPrivateKey) {
    try {
        webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    } catch (error) {
        if (error instanceof Error) {
            console.error("VAPID Configuration Error:", error.message);
        }
    }
}

export const NOTIFICATION_CATEGORIES = {
    PRAYER: [
        { title: "Tiempo de Oración 🙏", body: "Tómate 5 minutos para hablar con Dios hoy. Él te espera." },
        { title: "Un suspiro al cielo ✨", body: "Aprovecha este momento para darle gracias a Dios por algo hoy." },
        { title: "Fortaleza en la oración 💪", body: "No pelees solo. Entrega tus cargas al Señor en este momento." }
    ],
    BIBLE: [
        { title: "La Palabra de Hoy 📖", body: "Tu Biblia tiene un mensaje para ti hoy. Ábrela y escucha Su voz." },
        { title: "Lámpara a mis pies 🕯️", body: "Ilumina tu camino leyendo un versículo en Conecta+." },
        { title: "Alimento para el alma 🍞", body: "Tu espíritu necesita el pan de vida hoy. ¡Vamos a la Biblia!" }
    ],
    DEVOTIONAL: [
        { title: "Tu Devocional Espera 🕊️", body: "No te pierdas el devocional del día. ¡Inicia con propósito!" },
        { title: "Creciendo en fe 🌱", body: "Tómate un momento para completar tu devocional de hoy." }
    ],
    LLAMI: [
        { title: "¡Llami tiene hambre! 🦙", body: "Tu mascota necesita amor y comida. ¡Ven a verla!" },
        { title: "Llami te extraña ❤️", body: "Ha pasado tiempo. Ven a cuidar de tu mascota espiritual." },
        { title: "¡Evolución lista! ✨", body: "Llami ha progresado gracias a tu constancia. ¡Mira su cambio!" }
    ],
    CHECKIN: [
        { title: "¿Cómo va tu día? 😊", body: "Cuéntanos cómo te sientes hoy en tu diario espiritual." },
        { title: "Pausa de bienestar 🌿", body: "Haz un check-in rápido y registra tu estado de ánimo." }
    ],
    TUTORIAL: [
        { title: "¡Hola! 👋", body: "Descubre cómo Conecta+ puede transformar tu día. ¡Empieza tu tutorial!" },
        { title: "Tu guía te espera 🧭", body: "Aprende a usar todas las funciones de Conecta+ con nuestro tutorial." }
    ]
};

export const NOTIFICATION_CATEGORIES_RO = {
    PRAYER: [
        { title: 'Timp de rugăciune 🙏', body: 'Ia-ți 5 minute să vorbești astăzi cu Dumnezeu. El te așteaptă.' },
        { title: 'Un suspin spre cer ✨', body: 'Folosește acest moment pentru a-I mulțumi lui Dumnezeu pentru ceva.' },
        { title: 'Putere în rugăciune 💪', body: 'Nu lupta singur. Predă-ți poverile Domnului acum.' },
    ],
    BIBLE: [
        { title: 'Cuvântul de astăzi 📖', body: 'Biblia ta are un mesaj pentru tine astăzi. Deschide-o și ascultă vocea Lui.' },
        { title: 'Lampă pentru pașii mei 🕯️', body: 'Lumineză-ți drumul citind un verset în Conecta+.' },
        { title: 'Hrană pentru suflet 🍞', body: 'Spiritul tău are nevoie astăzi de pâinea vieții. Hai la Biblie!' },
    ],
    DEVOTIONAL: [
        { title: 'Devoționalul te așteaptă 🕊️', body: 'Nu rata devoționalul zilei. Începe cu un scop!' },
        { title: 'Creștere în credință 🌱', body: 'Ia-ți un moment să completezi devoționalul de astăzi.' },
    ],
    LLAMI: [
        { title: 'Llami îi este foame! 🦙', body: 'Animalul tău are nevoie de iubire și hrană. Vino să îl vezi!' },
        { title: 'Llami îți simte lipsa ❤️', body: 'A trecut ceva timp. Vino să ai grijă de animalul tău spiritual.' },
        { title: 'Evoluție pregătită! ✨', body: 'Llami a progresat datorită consecvenței tale. Privește-i schimbarea!' },
    ],
    CHECKIN: [
        { title: 'Cum îți merge ziua? 😊', body: 'Spune-ne cum te simți astăzi în jurnalul tău spiritual.' },
        { title: 'Pauză pentru starea ta 🌿', body: 'Fă un check-in rapid și notează-ți starea.' },
    ],
    TUTORIAL: [
        { title: 'Salut! 👋', body: 'Descoperă cum îți poate transforma Conecta+ ziua. Începe tutorialul!' },
        { title: 'Ghidul tău te așteaptă 🧭', body: 'Învață să folosești toate funcțiile Conecta+ cu tutorialul nostru.' },
    ],
};

export function getNotificationCategories(language: string) {
    return language === 'ro' ? NOTIFICATION_CATEGORIES_RO : NOTIFICATION_CATEGORIES;
}

/**
 * Envía notificaciones a todos los usuarios suscritos basado en una categoría aleatoria
 */
export type SendStoredNotificationsResult =
    | {
        success: true;
        sent: number;
        failed: number;
        processed: number;
        expired: number;
        hasMore: boolean;
        nextCursor: string | null;
    }
    | { success: false; error: string };

export async function sendStoredNotifications(options: {
    cursor?: string;
    limit?: string | number;
    concurrency?: string | number;
} = {}): Promise<SendStoredNotificationsResult> {
    try {
        const limit = normalizeNotificationBatchLimit(options.limit);
        const concurrency = normalizeNotificationConcurrency(
            options.concurrency ?? DEFAULT_NOTIFICATION_CONCURRENCY,
        );
        const subscriptions = await prisma.pushSubscription.findMany({
            where: options.cursor ? { id: { gt: options.cursor } } : undefined,
            orderBy: { id: 'asc' },
            take: limit + 1,
            select: {
                id: true,
                endpoint: true,
                p256dh: true,
                auth: true,
                user: { select: { updatedAt: true, preferredLanguage: true } },
            },
        });

        const batch = takeNotificationBatch(subscriptions, limit);
        if (batch.items.length === 0) {
            return {
                success: true,
                sent: 0,
                failed: 0,
                processed: 0,
                expired: 0,
                hasMore: false,
                nextCursor: null,
            };
        }

        const categories = Object.keys(NOTIFICATION_CATEGORIES) as Array<keyof typeof NOTIFICATION_CATEGORIES>;
        let sentCount = 0;
        let failedCount = 0;
        const expiredSubs: string[] = [];

        for (let index = 0; index < batch.items.length; index += concurrency) {
            const currentBatch = batch.items.slice(index, index + concurrency);
            const results = await Promise.allSettled(currentBatch.map(async (sub) => {
                let categoryKey: keyof typeof NOTIFICATION_CATEGORIES = categories[
                    Math.floor(Math.random() * categories.length)
                ];

                // Lógica inteligente: Si el usuario no ha entrado hoy, prioritize Llami o Oración
                const lastUpdate = sub.user.updatedAt;
                const hoursSinceAction = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60);

                if (hoursSinceAction > 24) {
                    categoryKey = Math.random() > 0.5 ? 'LLAMI' : 'PRAYER';
                } else if (hoursSinceAction > 6) {
                    categoryKey = 'CHECKIN';
                }

                const messages = getNotificationCategories(sub.user.preferredLanguage)[categoryKey]
                    || getNotificationCategories(sub.user.preferredLanguage).PRAYER;
                const message = messages[Math.floor(Math.random() * messages.length)];

                const payload = JSON.stringify({
                    title: "Conecta+",
                    body: message.body,
                    url: '/dashboard'
                });

                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                };

                return webpush.sendNotification(pushSubscription, payload);
            }));

            sentCount += results.filter(result => result.status === 'fulfilled').length;
            failedCount += results.filter(result => result.status === 'rejected').length;

            // Limpiar suscripciones inválidas (410 Gone / 404 Not Found)
            results.forEach((result, resultIndex) => {
                if (result.status !== 'rejected' || !isExpiredPushError(result.reason)) return;
                expiredSubs.push(currentBatch[resultIndex].endpoint);
            });
        }

        if (expiredSubs.length > 0) {
            await prisma.pushSubscription.deleteMany({
                where: { endpoint: { in: expiredSubs } }
            });
        }

        return {
            success: true,
            sent: sentCount,
            failed: failedCount,
            processed: batch.items.length,
            expired: expiredSubs.length,
            hasMore: batch.hasMore,
            nextCursor: batch.nextCursor,
        };
    } catch (error) {
        console.error("Error in sendStoredNotifications:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown notification worker error',
        };
    }
}

function isExpiredPushError(error: unknown): error is { statusCode: number } {
    return typeof error === 'object'
        && error !== null
        && 'statusCode' in error
        && ((error as { statusCode?: unknown }).statusCode === 404
            || (error as { statusCode?: unknown }).statusCode === 410);
}
