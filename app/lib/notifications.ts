import webpush from 'web-push';
import { prisma } from './prisma';

import { config } from './config';
// Configuración de web-push
const { publicKey: vapidPublicKey, privateKey: vapidPrivateKey, subject: vapidSubject } = config.vapid;

if (vapidPublicKey && vapidPrivateKey) {
    try {
        webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    } catch (error: any) {
        console.error("VAPID Configuration Error:", error.message);
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
        { title: "Lámpara a mis pies 🕯️", body: "Ilumina tu camino leyendo un versículo en Conecta+ BETA." },
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
    ]
};

/**
 * Envía notificaciones a todos los usuarios suscritos basado en una categoría aleatoria
 */
export async function sendStoredNotifications() {
    try {
        const subscriptions = await prisma.pushSubscription.findMany({
            include: { user: true }
        });

        if (subscriptions.length === 0) return { success: true, sent: 0 };

        const categories = Object.keys(NOTIFICATION_CATEGORIES);
        let sentCount = 0;

        const results = await Promise.allSettled(subscriptions.map(async (sub) => {
            let categoryKey = categories[Math.floor(Math.random() * categories.length)];

            // Lógica inteligente: Si el usuario no ha entrado hoy, prioritize Llami o Oración
            const lastUpdate = sub.user.updatedAt;
            const hoursSinceAction = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60);

            if (hoursSinceAction > 24) {
                categoryKey = Math.random() > 0.5 ? 'LLAMI' : 'PRAYER';
            } else if (hoursSinceAction > 6) {
                categoryKey = 'CHECKIN';
            }

            // @ts-ignore
            const messages = NOTIFICATION_CATEGORIES[categoryKey] || NOTIFICATION_CATEGORIES.PRAYER;
            const message = messages[Math.floor(Math.random() * messages.length)];

            const payload = JSON.stringify({
                title: message.title,
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

        sentCount = results.filter(r => r.status === 'fulfilled').length;
        // Success logging removed

        // Limpiar suscripciones inválidas (410 Gone / 404 Not Found)
        const expiredSubs = results
            .map((r, i) => ({ result: r, index: i }))
            .filter(x => x.result.status === 'rejected' && (x.result.reason.statusCode === 410 || x.result.reason.statusCode === 404))
            .map(x => subscriptions[x.index].endpoint);

        if (expiredSubs.length > 0) {
            await prisma.pushSubscription.deleteMany({
                where: { endpoint: { in: expiredSubs } }
            });
            // Cleanup logging removed
        }

        return { success: true, sent: sentCount };
    } catch (error) {
        console.error("Error in sendStoredNotifications:", error);
        return { success: false, error };
    }
}
