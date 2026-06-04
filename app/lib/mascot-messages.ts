export const llamiMessages = {
    welcome: [
        "¡Hola! Soy Llami, tu compañero espiritual 🔥",
        "¡Qué alegría verte! Estoy aquí para animarte",
        "¡Bienvenido de vuelta! Sigamos creciendo juntos"
    ],
    streakMessages: {
        spark: [
            "¡Cada gran fuego comienza con una chispa!",
            "¡Vas muy bien! Sigue así",
            "Un día a la vez, campeón",
            "¡La constancia es clave! 💪"
        ],
        flame: [
            "¡Mira cómo creces! Estoy orgulloso de ti",
            "¡Tu llama está creciendo! 🔥",
            "¡Increíble progreso! No te detengas",
            "¡Eres imparable! Sigue adelante"
        ],
        torch: [
            "¡Eres una antorcha brillante! ✨",
            "¡Tu luz inspira a otros!",
            "¡Qué disciplina! Dios está contento",
            "¡Eres un guerrero espiritual! ⚔️"
        ],
        sun: [
            "¡Brillas como el sol! ☀️",
            "¡Eres un ejemplo para muchos!",
            "¡Tu constancia es admirable!",
            "¡Dios está haciendo algo grande en ti!"
        ],
        star: [
            "¡Eres una estrella! ⭐",
            "¡Un año completo! ¡Eres un campeón!",
            "¡Tu testimonio es poderoso!",
            "¡Leyenda espiritual! 👑"
        ]
    },
    moodMessages: {
        sad: [
            "Está bien sentirse así. Dios está contigo 💙",
            "Las tormentas pasan. Tú eres fuerte",
            "No estás solo. Yo estoy aquí contigo"
        ],
        neutral: [
            "Un día normal también es una victoria",
            "Sigue adelante, paso a paso",
            "La paz viene en camino"
        ],
        happy: [
            "¡Me encanta verte feliz! 😊",
            "¡Tu alegría es contagiosa!",
            "¡Celebremos juntos este momento!"
        ],
        excited: [
            "¡WOOHOO! ¡Esa es la actitud! 🎉",
            "¡Tu energía es increíble!",
            "¡Dios está haciendo maravillas en ti!"
        ]
    },
    milestones: {
        7: "¡7 días! ¡Tu primera semana completa! 🎊",
        30: "¡UN MES! ¡Eres increíble! 🏆",
        50: "¡50 días de victoria! ¡Imparable! 💪",
        100: "¡100 DÍAS! ¡ERES UNA LEYENDA! 👑",
        365: "¡UN AÑO COMPLETO! ¡CAMPEÓN ABSOLUTO! 🌟"
    },
    encouragement: [
        "No pasa nada. Empecemos de nuevo juntos 💙",
        "Caer es humano, levantarse es de campeones",
        "Dios te da una nueva oportunidad cada día",
        "¡Vamos! Tú puedes hacerlo de nuevo"
    ],
    randomClicks: [
        "¡Hola! 👋",
        "¿Necesitas ánimo? ¡Aquí estoy!",
        "¡Sigue brillando! ✨",
        "¡Eres amado! ❤️",
        "¡Dios tiene un plan para ti!",
        "¡No te rindas!",
        "¡Eres más fuerte de lo que crees!",
        "¡Hoy es un buen día para crecer!",
        "¡Confía en el proceso! 🙏",
        "¡Eres una bendición!",
        "¡Sonríe, Dios te ama!",
        "¡Sigue adelante, campeón!",
        "¡Cada día es una nueva oportunidad!",
        "¡Tú puedes con todo! 💪",
        "¡Qué bonito es verte!",
    ],
    feeding: [
        "🔥 ¡Ñam! ¡Delicioso!",
        "🔥 ¡Eso es fuego puro!",
        "🔥 ¡Mmm, qué rico! +20 XP",
        "🔥 ¡Gracias por alimentarme!",
        "🔥 ¡Me encanta cuando haces eso!",
    ],
    inactive: [
        "zzz... ¿dormido?",
        "zzz... te espero...",
        "zzz... cuando quieras jugar...",
    ],
    timeGreetings: {
        morning: "☀️ Buenos días",
        afternoon: "🌤️ Buenas tardes",
        evening: "🌙 Buenas noches",
    }
};

export function getLlamiMessage(
    t: any,
    streak: number,
    isClick: boolean = false,
    context?: "feed" | "inactive" | "welcome"
): string {
    const messages = t.llami;

    if (context === "feed") {
        const feedMsgs = [
            "🔥 ¡Ñam! ¡Delicioso!",
            "🔥 ¡Eso es fuego puro!",
            "🔥 ¡Mmm, qué rico! +20 XP",
            "🔥 ¡Gracias por alimentarme!",
            "🔥 ¡Me encanta cuando haces eso!",
        ];
        return feedMsgs[Math.floor(Math.random() * feedMsgs.length)];
    }

    if (context === "inactive") {
        const sleepMsgs = [
            "zzz... ¿dormido?",
            "zzz... te espero...",
            "zzz... cuando quieras jugar...",
        ];
        return sleepMsgs[Math.floor(Math.random() * sleepMsgs.length)];
    }

    if (context === "welcome") {
        const h = new Date().getHours();
        let greeting: string;
        if (h < 12) greeting = "☀️ Buenos días";
        else if (h < 18) greeting = "🌤️ Buenas tardes";
        else greeting = "🌙 Buenas noches";
        return `${greeting}! ${messages.random[Math.floor(Math.random() * messages.random.length)]}`;
    }

    if (messages.milestones[streak as keyof typeof messages.milestones]) {
        return messages.milestones[streak as keyof typeof messages.milestones];
    }

    if (isClick) {
        return messages.random[
            Math.floor(Math.random() * messages.random.length)
        ];
    }

    let stage: keyof typeof messages.streak;
    if (streak <= 7) stage = 'spark';
    else if (streak <= 30) stage = 'flame';
    else if (streak <= 90) stage = 'torch';
    else if (streak <= 365) stage = 'sun';
    else stage = 'star';

    const streakMessages = messages.streak[stage];
    return streakMessages[Math.floor(Math.random() * streakMessages.length)];
}
