export const llamiMessages = {
    // Mensajes de bienvenida
    welcome: [
        "¡Hola! Soy Llami, tu compañero espiritual 🔥",
        "¡Qué alegría verte! Estoy aquí para animarte",
        "¡Bienvenido de vuelta! Sigamos creciendo juntos"
    ],

    // Mensajes por racha (días)
    streakMessages: {
        spark: [ // 0-7 días
            "¡Cada gran fuego comienza con una chispa!",
            "¡Vas muy bien! Sigue así",
            "Un día a la vez, campeón",
            "¡La constancia es clave! 💪"
        ],
        flame: [ // 8-30 días
            "¡Mira cómo creces! Estoy orgulloso de ti",
            "¡Tu llama está creciendo! 🔥",
            "¡Increíble progreso! No te detengas",
            "¡Eres imparable! Sigue adelante"
        ],
        torch: [ // 31-90 días
            "¡Eres una antorcha brillante! ✨",
            "¡Tu luz inspira a otros!",
            "¡Qué disciplina! Dios está contento",
            "¡Eres un guerrero espiritual! ⚔️"
        ],
        sun: [ // 91-365 días
            "¡Brillas como el sol! ☀️",
            "¡Eres un ejemplo para muchos!",
            "¡Tu constancia es admirable!",
            "¡Dios está haciendo algo grande en ti!"
        ],
        star: [ // 365+ días
            "¡Eres una estrella! ⭐",
            "¡Un año completo! ¡Eres un campeón!",
            "¡Tu testimonio es poderoso!",
            "¡Leyenda espiritual! 👑"
        ]
    },

    // Mensajes según el estado de ánimo del check-in
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

    // Mensajes de hitos especiales
    milestones: {
        7: "¡7 días! ¡Tu primera semana completa! 🎊",
        30: "¡UN MES! ¡Eres increíble! 🏆",
        50: "¡50 días de victoria! ¡Imparable! 💪",
        100: "¡100 DÍAS! ¡ERES UNA LEYENDA! 👑",
        365: "¡UN AÑO COMPLETO! ¡CAMPEÓN ABSOLUTO! 🌟"
    },

    // Mensajes de ánimo cuando se pierde la racha
    encouragement: [
        "No pasa nada. Empecemos de nuevo juntos 💙",
        "Caer es humano, levantarse es de campeones",
        "Dios te da una nueva oportunidad cada día",
        "¡Vamos! Tú puedes hacerlo de nuevo"
    ],

    // Mensajes aleatorios al hacer click
    randomClicks: [
        "¡Hola! 👋",
        "¿Necesitas ánimo? ¡Aquí estoy!",
        "¡Sigue brillando! ✨",
        "¡Eres amado! ❤️",
        "¡Dios tiene un plan para ti!",
        "¡No te rindas!",
        "¡Eres más fuerte de lo que crees!",
        "¡Hoy es un buen día para crecer!",
        "¡Confía en el proceso! 🙏"
    ]
};

export function getLlamiMessage(
    streak: number,
    mood?: string,
    isClick: boolean = false
): string {
    // Mensajes de hitos tienen prioridad
    if (llamiMessages.milestones[streak as keyof typeof llamiMessages.milestones]) {
        return llamiMessages.milestones[streak as keyof typeof llamiMessages.milestones];
    }

    // Si es un click aleatorio
    if (isClick) {
        return llamiMessages.randomClicks[
            Math.floor(Math.random() * llamiMessages.randomClicks.length)
        ];
    }

    // Determinar etapa según racha
    let stage: keyof typeof llamiMessages.streakMessages;
    if (streak <= 7) stage = 'spark';
    else if (streak <= 30) stage = 'flame';
    else if (streak <= 90) stage = 'torch';
    else if (streak <= 365) stage = 'sun';
    else stage = 'star';

    const messages = llamiMessages.streakMessages[stage];
    return messages[Math.floor(Math.random() * messages.length)];
}
