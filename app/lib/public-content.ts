export type PublicResource = {
    slug: string;
    title: string;
    description: string;
    category: string;
    author: string;
    publishedAt: string;
    readingMinutes: number;
    body: string[];
    relatedSlugs: string[];
};

export const PUBLIC_RESOURCES: PublicResource[] = [
    {
        slug: 'oracion-de-cinco-minutos',
        title: 'Una oración de cinco minutos para volver al centro',
        description: 'Una guía breve para empezar a orar con honestidad, atención y esperanza.',
        category: 'Oración',
        author: 'Equipo editorial Conecta+',
        publishedAt: '2026-10-20',
        readingMinutes: 4,
        body: [
            'La oración no necesita comenzar con palabras perfectas. Puede comenzar con una pausa: reconoce dónde estás, cómo llegaste hasta aquí y qué necesitas entregar hoy.',
            'Durante el primer minuto, respira despacio y nombra una razón concreta para agradecer. Durante el segundo, habla con Dios de tu emoción principal sin maquillarla. La honestidad abre espacio para escuchar.',
            'En el tercer minuto, pide sabiduría para una decisión pequeña y cercana. En el cuarto, recuerda a una persona y ora por su bienestar. Termina con un minuto de silencio y una frase sencilla que puedas llevar contigo.',
            'Esta práctica no reemplaza apoyo profesional ni atención de emergencia. Su propósito es crear un momento diario de conexión y reflexión.',
        ],
        relatedSlugs: ['habitos-cristianos-pequenos', 'leer-la-biblia-sin-prisa'],
    },
    {
        slug: 'ansiedad-y-esperanza',
        title: 'Ansiedad y esperanza: una guía cristiana para el día difícil',
        description: 'Pasos espirituales y prácticos para atravesar una jornada pesada sin aislarte.',
        category: 'Bienestar',
        author: 'Equipo editorial Conecta+',
        publishedAt: '2026-10-18',
        readingMinutes: 6,
        body: [
            'Cuando la ansiedad sube, el futuro parece ocupar todo el espacio. Empieza por volver al presente: apoya ambos pies en el suelo, identifica cinco cosas que ves y elige una tarea posible para los próximos diez minutos.',
            'Desde la fe, puedes recordar que no tienes que cargar el día completo de una sola vez. Una oración corta como “Dios, acompáñame en este paso” puede convertirse en una señal de confianza mientras buscas ayuda.',
            'Cuéntale a una persona segura cómo te sientes. Dormir, comer, moverte un poco y limitar noticias alarmantes también son actos de cuidado. Si la angustia es intensa, persistente o incluye riesgo de hacerte daño, busca atención profesional o servicios de emergencia de tu país.',
            'La esperanza cristiana no niega el dolor. Permite caminar acompañado mientras el dolor recibe nombre, cuidado y tiempo.',
        ],
        relatedSlugs: ['oracion-de-cinco-minutos', 'habitos-cristianos-pequenos'],
    },
    {
        slug: 'habitos-cristianos-pequenos',
        title: 'Hábitos cristianos pequeños que sí caben en una semana ocupada',
        description: 'Cinco prácticas realistas para cultivar fe sin convertirla en una lista imposible.',
        category: 'Hábitos',
        author: 'Equipo editorial Conecta+',
        publishedAt: '2026-10-15',
        readingMinutes: 5,
        body: [
            'Un hábito espiritual sostenible comienza pequeño. Elige una práctica que puedas repetir incluso en una semana difícil, en vez de diseñar una rutina que dependa de tener energía perfecta.',
            'Puedes leer un párrafo de la Biblia, agradecer por una persona, enviar un mensaje de ánimo, guardar dos minutos de silencio o revisar tu día antes de dormir. La constancia importa más que la cantidad.',
            'Une el hábito a algo que ya haces: después del café, antes de apagar la luz o al esperar el transporte. Marca cada intento sin castigarte cuando falles. Volver también forma parte del camino.',
            'La meta no es aparentar disciplina. Es abrir un espacio cotidiano para amar mejor a Dios, a otras personas y a ti mismo.',
        ],
        relatedSlugs: ['oracion-de-cinco-minutos', 'leer-la-biblia-sin-prisa'],
    },
    {
        slug: 'leer-la-biblia-sin-prisa',
        title: 'Cómo leer la Biblia sin prisa y encontrar una idea para practicar',
        description: 'Un método sencillo de lectura, observación y respuesta para jóvenes y familias.',
        category: 'Estudio bíblico',
        author: 'Equipo editorial Conecta+',
        publishedAt: '2026-10-12',
        readingMinutes: 7,
        body: [
            'Escoge un pasaje corto y léelo dos veces. En la primera lectura, busca la escena general. En la segunda, subraya una palabra que se repita, una decisión de un personaje o una promesa que te llame la atención.',
            'Haz tres preguntas: ¿qué dice el texto?, ¿qué muestra sobre Dios y las personas?, ¿qué respuesta concreta puedo intentar hoy? Mantén separadas tus observaciones de tus opiniones para no exigirle al pasaje lo que no dice.',
            'Comparte tu idea con alguien de confianza. Para una familia o un grupo juvenil, cada persona puede elegir una frase y proponer una práctica de bondad, reconciliación o servicio para la semana.',
            'La lectura bíblica no es una carrera. Un pasaje entendido, orado y vivido puede acompañarte más que muchos capítulos leídos sin atención.',
        ],
        relatedSlugs: ['habitos-cristianos-pequenos', 'juegos-biblicos-para-aprender'],
    },
    {
        slug: 'juegos-biblicos-para-aprender',
        title: 'Juegos bíblicos para aprender en familia sin convertir la fe en examen',
        description: 'Ideas de juego cooperativo para recordar historias, libros y valores bíblicos.',
        category: 'Juegos familiares',
        author: 'Equipo editorial Conecta+',
        publishedAt: '2026-10-10',
        readingMinutes: 5,
        body: [
            'Los juegos pueden ayudar a recordar cuando crean conversación, no presión. Empieza con una ronda de “pista y personaje”: alguien describe una historia bíblica sin decir nombres y el grupo intenta identificarla.',
            'Otra opción es ordenar tarjetas de libros bíblicos por secciones, o elegir una historia y representar una decisión importante sin burlarse de las dudas de quien participa. Los puntos pueden ser simbólicos: una palabra de ánimo vale tanto como una respuesta correcta.',
            'Cierra cada partida con una pregunta: ¿qué valor aparece en esta historia?, ¿a quién podríamos cuidar esta semana?, ¿qué parte no entendimos todavía? Así el juego abre una conversación y no termina en competencia.',
            'Adapta reglas y duración a la edad del grupo. El objetivo es disfrutar, aprender y hacer espacio para preguntas sinceras.',
        ],
        relatedSlugs: ['leer-la-biblia-sin-prisa', 'habitos-cristianos-pequenos'],
    },
];

export function getPublicResource(slug: string) {
    return PUBLIC_RESOURCES.find((resource) => resource.slug === slug);
}
