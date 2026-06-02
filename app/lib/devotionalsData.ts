import { generatedDevotionals } from './generatedDevotionals';

export interface Devotional {
    id: string;
    title: string;
    category: string;
    time: string;
    image: string; // CSS class for background or URL
    bibleVerse: string;
    bibleReference: string;
    content: string[]; // Array of paragraphs
    applicationSteps: string[];
    prayer: string;
    author: string;
}

export const devotionalsData: Devotional[] = [
    {
        id: '1',
        title: 'Cuando la ansiedad ataca',
        category: 'Ansiedad',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&q=80',
        bibleVerse: 'Echad toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.',
        bibleReference: '1 Pedro 5:7',
        content: [
            'A veces sentimos que la ansiedad es un monstruo gigante que no podemos controlar. Nos despierta en la noche, nos acelera el corazón y nos roba la paz, dejándonos exhaustos antes de que el día comience. Es fácil pensar que algo está mal con nosotros, pero la ansiedad no es tu identidad, es solo una batalla que estás enfrentando.',
            'El apóstol Pedro nos da una instrucción clave: "echad" vuestra ansiedad sobre Él. La palabra griega original implica un lanzamiento fuerte y decidido, como quien arroja un saco pesado lejos de sí. No es simplemente "dejar caer" la carga pasivamente; es un acto intencional de tomar esa preocupación que te asfixia y arrojarla directamente sobre los hombros fuertes y capaces de Jesús.',
            'Dios no se molesta por tus preocupaciones ni piensa que eres débil por tenerlas. Al contrario, Él pide que se las entregues porque Él sí puede manejarlas. Tú no fuiste diseñado para cargar el peso del mundo sobre tu espalda, pero Él sí. Cuando intentamos llevarlo todo nosotros mismos, nos rompemos. Pero cuando aprendemos a soltar, encontramos la paz que tanto anhelamos.',
            'Recuerda que entregar la ansiedad es un ejercicio diario, a veces de cada minuto. No se trata de negar la realidad, sino de reconocer que hay Alguien más grande que tus problemas cuidando de ti con un amor perfecto.',
            'La ansiedad a menudo nos miente sobre el futuro, pintando escenarios catastróficos que rara vez suceden. Pero Dios nos invita a vivir en el presente, confiando en que Su gracia es suficiente para cada día. Al enfocar nuestra mente en Su fidelidad pasada, ganamos fuerza para enfrentar la incertidumbre del mañana.'
        ],
        applicationSteps: [
            'Escribe en una nota del celular qué te preocupa exactamente hoy.',
            'Visualiza cómo le entregas esa nota a Jesús.',
            'Respira profundo 3 veces y di: "Tú tienes cuidado de mí".'
        ],
        prayer: 'Señor, hoy te entrego mi mente acelerada. No puedo con esto, pero Tú sí. Gracias porque no tengo que ser fuerte todo el tiempo. Recibo tu paz ahora. Amén.',
        author: 'Mario Alvarez'
    },
    {
        id: '2',
        title: 'Pureza en un mundo sucio',
        category: 'Integridad',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80',
        bibleVerse: '¿Con qué limpiará el joven su camino? Con guardar tu palabra.',
        bibleReference: 'Salmos 119:9',
        content: [
            'Vivimos bombardeados de imágenes. Un clic, un anuncio, una escena inesperada. Y luego viene la culpa: "¿Por qué vi eso? ¿Soy un hipócrita?". La cultura actual normaliza lo que Dios llama impuro, haciendo que la santidad parezca algo anticuado o imposible de alcanzar.',
            'El salmista no pregunta "¿Cómo será perfecto el joven?", sino "¿Cómo limpiará su camino?". Esto implica que nos vamos a ensuciar los pies al caminar por este mundo. La clave no es la perfección impecable, sino el lavado constante. La pureza es un viaje de regreso continuo al corazón de Dios.',
            'La Palabra de Dios no es un regaño, es agua fresca. Cuando fallas, no huyas DE Dios, corre HACIA Dios. Él es quien te limpia. La pureza no es una racha de días sin caer, es un corazón que ama a Jesús más que al placer momentáneo. Es decidir que Su presencia vale más que cualquier satisfacción temporal.',
            'Mantener la pureza requiere valentía y estrategia. No se trata solo de fuerza de voluntad, sino de llenar tu mente con la verdad para que no haya espacio para la mentira. Cuando tu deleite está en la ley del Señor, el pecado pierde su atractivo seductor.'
        ],
        applicationSteps: [
            'Instala un bloqueador de anuncios o filtros si es necesario.',
            'Si caes, no te quedes en el suelo lamentándote. Levántate rápido.',
            'Memoriza Salmos 119:9 para recordarlo en momentos de tentación.'
        ],
        prayer: 'Jesús, mi carne es débil, pero Tú eres mi fuerza. Limpia mi mente de imágenes que no te agradan. Ayúdame a ver la pureza no como una regla, sino como una forma de amarte más. Amén.',
        author: 'Mario Alvarez'
    },
    {
        id: '3',
        title: 'Identidad: ¿Quién dices que soy?',
        category: 'Identidad',
        time: '5 min',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80',
        bibleVerse: 'Mirad cuál amor nos ha dado el Padre, para que seamos llamados hijos de Dios.',
        bibleReference: '1 Juan 3:1',
        content: [
            'El mundo te define por tus logros, tus likes, tu apariencia o tus errores pasados. Es fácil sentirse como un "fracaso" o un "impostor" cuando no cumplimos con las expectativas externas. Pasamos la vida tratando de construir una imagen que agrade a los demás, perdiendo nuestra verdadera esencia en el proceso.',
            'Pero Dios te define de una sola manera: HIJO. No eres "el ansioso", "el adicto" o "el problemático". Esas son batallas que peleas, no quien ERES. Tu identidad no se basa en lo que haces, sino en a quién perteneces. Eres propiedad adquirida por Dios, real sacerdocio, nación santa.',
            'Cuando sabes que eres un Hijo amado, no necesitas mendigar aprobación. Ya tienes la aprobación del Creador del Universo. Tu valor fue pagado en la cruz, y es altísimo. Nada de lo que hagas puede hacer que Dios te ame más, y nada de lo que dejes de hacer hará que te ame menos.',
            'Vivir desde tu identidad correcta cambia todo. Ya no trabajas para obtener amor, sino desde el amor. No luchas por la victoria, sino desde la victoria. Deja que la voz de tu Padre sea la más fuerte en tu vida hoy.'
        ],
        applicationSteps: [
            'Mírate al espejo y di en voz alta: "Soy un hijo amado de Dios".',
            'Deja de seguir cuentas en redes sociales que te hagan sentir inferior.',
            'Recuerda un momento donde sentiste el amor de Dios y escríbelo.'
        ],
        prayer: 'Padre, perdóname por buscar mi valor en cosas vacías. Gracias porque mi identidad está segura en Ti. Soy tuyo, y eso es suficiente. Amén.',
        author: 'Mario Alvarez'
    },
    {
        id: '4',
        title: 'Soledad acompañada',
        category: 'Soledad',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1518098268026-4e1877433665?auto=format&fit=crop&q=80',
        bibleVerse: 'Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo.',
        bibleReference: 'Salmos 23:4',
        content: [
            'Puedes estar en una habitación llena de gente, riendo y conversando, y aun así sentirte completamente solo por dentro. La soledad no es solo la ausencia de personas; es ese eco vacío en el pecho que susurra "nadie me entiende realmente, a nadie le importo de verdad".',
            'David, el hombre conforme al corazón de Dios, escribió el Salmo 23 en momentos que probablemente fueron muy peligrosos y solitarios. Su mayor consuelo no fue que el valle de sombra de muerte desapareciera mágicamente, sino la certeza de que "TÚ estarás conmigo". La presencia de Dios cambia la naturaleza de nuestra soledad.',
            'Cuando invitas a Jesús a tu soledad, esta se convierte en "solitud": un tiempo precioso a solas con Él. No estás abandonado ni olvidado. El Espíritu Santo es llamado "El Consolador" y vive literalmente dentro de ti. Nunca hay un momento en el que estés verdaderamente solo.',
            'Aprende a cultivar esa amistad con Dios en los momentos de silencio. Él es el amigo que nunca falla, el que escucha cada pensamiento y el que permanece fiel cuando todos los demás se han ido.'
        ],
        applicationSteps: [
            'Habla con Dios como si estuviera sentado en la silla a tu lado.',
            'Envía un mensaje a un amigo cristiano y sé honesto: "Me siento solo hoy".',
            'Escucha una canción de adoración que hable de Su presencia.'
        ],
        prayer: 'Dios, a veces me siento invisible. Gracias porque Tú siempre me ves. Llena este vacío con tu presencia real y tangible hoy. No estoy solo. Amén.',
        author: 'Mario Alvarez'
    },
    // ===== SABIDURÍA (Basados en Proverbios) =====
    {
        id: '300',
        title: 'Sabiduría: Día 1 — El principio de la sabiduría',
        category: 'Sabiduría',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'El principio de la sabiduría es el temor de Jehová; los insensatos desprecian la sabiduría y la enseñanza.',
        bibleReference: 'Proverbios 1:7',
        content: [
            'En un mundo que grita "tú decides tu propia verdad", la Biblia nos invita a comenzar desde un lugar diferente: el temor del Señor. Pero no se trata de tener miedo de Dios como de un monstruo, sino de una reverencia profunda que reconoce quién es Él y quiénes somos nosotros. Es el punto de partida de toda decisión sabia.',
            'Proverbios nos dice que la sabiduría no se encuentra en los libros de autoayuda ni en los títulos académicos, aunque esos pueden ayudar. La sabiduría verdadera comienza cuando nos arrodillamos ante el Creador y admitimos que sin Él, estamos perdidos. Es un asunto del corazón antes que de la mente.',
            'El insensato no es necesariamente tonto; es quien vive como si Dios no existiera o como si sus consejos fueran opcionales. Toma decisiones basándose en lo que parece correcto en el momento, sin considerar las consecuencias eternas. La sabiduría, en cambio, ve más allá del presente y construye sobre la roca sólida de la Palabra de Dios.',
            'Hoy, Dios te invita a hacer de Su temor —esa mezcla de asombro, respeto y amor— el fundamento de tu vida. Cuando Él es tu punto de partida, cada decisión, cada relación y cada sueño encuentran su lugar correcto.'
        ],
        applicationSteps: [
            'Pregúntate: ¿En qué área de mi vida estoy actuando como insensato, ignorando lo que Dios dice?',
            'Escribe en una hoja las 3 decisiones más importantes que enfrentas hoy y preséntalas en oración a Dios.',
            'Memoriza Proverbios 1:7 y repítelo cada mañana antes de comenzar tu día.'
        ],
        prayer: 'Señor, quiero que Tú seas el principio de todo en mi vida. Perdóname por las veces que he confiado en mi propia inteligencia. Dame un corazón reverente que busque tu sabiduría en cada decisión. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '301',
        title: 'Sabiduría: Día 2 — Confía en el Señor',
        category: 'Sabiduría',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Confía de todo corazón en el Señor y no en tu propia inteligencia. Reconócelo en todos tus caminos, y él allanará tus sendas.',
        bibleReference: 'Proverbios 3:5-6',
        content: [
            'La palabra "confianza" se ha vuelto frágil en nuestra cultura. La depositamos en personas que nos fallan, en planes que se desmoronan y en habilidades que a veces no son suficientes. Pero Proverbios 3:5 nos invita a depositar nuestra confianza en Alguien que nunca falla.',
            'Confiar "de todo corazón" significa más que un asentimiento mental. Es una rendición total de nuestras ansiedades, nuestros planes y nuestros sueños en las manos de Dios. Es dejar de depender de nuestra propia inteligencia —nuestros análisis, nuestras estrategias, nuestra "lógica"— y reconocer que Él ve lo que nosotros no podemos ver.',
            'La promesa es poderosa: "Él allanará tus sendas". No dice que no habrá obstáculos ni que el camino será fácil. Dice que Dios hará recto lo torcido, que preparará el terreno delante de ti. Cuando caminas en confianza, Dios se encarga de enderezar las curvas del camino.',
            '¿Qué área de tu vida estás tratando de controlar hoy con tu propia inteligencia? La invitación es soltar el volante y dejar que Dios guíe. No es una renuncia a la responsabilidad, es un cambio de piloto.'
        ],
        applicationSteps: [
            'Identifica un área donde estás confiando más en tu inteligencia que en Dios.',
            'Escribe Proverbios 3:5-6 en un post-it y pégalo donde lo veas todos los días.',
            'Ora específicamente sobre esa área, declarando que confías en Dios más que en tu propio entendimiento.'
        ],
        prayer: 'Padre, confieso que a veces confío más en mí mismo que en Ti. Hoy elijo soltar el control y confiar en que Tú ves el panorama completo. Allana mis sendas, Señor. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '302',
        title: 'Sabiduría: Día 3 — Guarda tu corazón',
        category: 'Sabiduría',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Sobre toda cosa guardada, guarda tu corazón, porque de él mana la vida.',
        bibleReference: 'Proverbios 4:23',
        content: [
            'Tus pensamientos, tus emociones, tus deseos —todo lo que eres fluye de tu corazón. Por eso Proverbios nos advierte con tanta urgencia: "guarda tu corazón". No como quien esconde un tesoro por miedo a perderlo, sino como quien protege lo más valioso que posee.',
            'En la era digital, nuestro corazón está constantemente bajo asalto. Cada notificación, cada video, cada comentario busca capturar tu atención y moldear tus deseos. Sin darte cuenta, tu corazón comienza a anhelar lo que el mundo le ofrece, alejándose lentamente de Dios.',
            'Guardar tu corazón requiere intencionalidad. No se trata de aislarte del mundo, sino de elegir cuidadosamente qué permites que entre en tu interior. Así como proteges tu teléfono con contraseñas y tu casa con cerraduras, tu corazón necesita límites saludables que protejan tu paz y tu pureza.',
            'Pregúntate hoy: ¿Qué estoy permitiendo que entre en mi corazón sin filtro? ¿Qué voces están moldeando mis deseos más que la voz de Dios? La vida que mana de tu corazón es demasiado valiosa para dejarla sin protección.'
        ],
        applicationSteps: [
            'Revisa tu consumo diario de redes sociales y contenido. ¿Qué podrías reducir?',
            'Antes de ver un video o leer un post, pregúntate: "¿Esto edifica mi corazón o lo daña?"',
            'Establece un límite de tiempo frente a pantallas hoy para crear espacio para Dios.'
        ],
        prayer: 'Señor, ayúdame a ser intencional con lo que permito en mi corazón. Quiero que mi vida fluya de Ti, no de las voces del mundo. Enséñame a guardar mi corazón como el tesoro que es. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '303',
        title: 'Sabiduría: Día 4 — El temor del Señor',
        category: 'Sabiduría',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'El temor del Señor es el principio de la sabiduría, y el conocimiento del Santísimo es la inteligencia.',
        bibleReference: 'Proverbios 9:10',
        content: [
            'El "temor del Señor" suena anticuado para muchos. Nos imaginamos a un Dios enojado listo para castigarnos, pero esa no es la imagen que Proverbios pinta. El temor del Señor es una profunda conciencia de Su grandeza y nuestra pequeñez, que nos lleva a vivir en humildad y obediencia.',
            'Imagina estar frente a una cascada gigante o en la cima de una montaña. Sientes asombro, admiración, un poco de vértigo. Sabes que eres pequeño comparado con esa grandeza. Eso es el temor del Señor: reconocer que Dios es Dios y tú no lo eres. Y en ese reconocimiento, encuentras la libertad de dejar de pretender que controlas todo.',
            'Proverbios 9:10 nos dice que este temor es el "principio" —el punto de partida— de la sabiduría. No puedes ser verdaderamente sabio sin primero entender quién es Dios y cuál es tu lugar en relación con Él. La inteligencia sin temor de Dios se convierte en arrogancia; el conocimiento sin reverencia se vuelve peligroso.',
            '¿Has perdido el asombro por Dios? La rutina, el pecado y las distracciones pueden apagar nuestra admiración por Él. Hoy es un buen día para redescubrir la majestad de Dios y permitir que Su grandeza ponga tus problemas en perspectiva.'
        ],
        applicationSteps: [
            'Sal a caminar y observa la creación. Deja que la grandeza de Dios te impresione.',
            'Lee el Salmo 104 y permite que las palabras renueven tu asombro por el Creador.',
            'Pregúntate: ¿Estoy tratando a Dios con la reverencia que Él merece en mi vida diaria?'
        ],
        prayer: 'Dios grande y poderoso, a veces te trato como si fueras pequeño. Perdóname. Hoy quiero redescubrir el asombro de quién eres Tú. Que Tu grandeza ponga mis problemas en perspectiva. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '304',
        title: 'Sabiduría: Día 5 — El poder de las palabras',
        category: 'Sabiduría',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Hay quienes hablan como dando estocadas de espada, pero la lengua de los sabios trae sanidad.',
        bibleReference: 'Proverbios 12:18',
        content: [
            'Las palabras tienen poder. Lo sabemos porque recordamos con claridad frases que nos hirieron hace años, y también aquellas que nos levantaron en momentos difíciles. Proverbios compara las palabras imprudentes con estocadas de espada —penetran profundamente y dejan heridas que tardan en sanar.',
            'Pero el mismo versículo nos da esperanza: la lengua de los sabios trae sanidad. Tú tienes el poder de hablar vida o muerte sobre las personas que te rodean. Cada conversación es una oportunidad para usar tus palabras como instrumento de sanidad, no de dolor.',
            'La sabiduría no es solo saber qué decir, sino cuándo decirlo y cómo decirlo. El sabio sabe que a veces el silencio es más elocuente que mil palabras, y que una palabra dicha en el momento adecuado puede cambiar el rumbo del día de alguien.',
            'Antes de hablar hoy, pregúntate: ¿Esto que voy a decir edifica o destruye? ¿Trae sanidad o lastima? ¿Es verdadero, necesario y amable? Tus palabras pueden ser espadas o vendas; la elección es tuya.'
        ],
        applicationSteps: [
            'Hoy, antes de hablar, haz una pausa de 3 segundos y piensa si lo que dirás edifica.',
            'Escribe un mensaje a alguien para agradecerle o animarlo con tus palabras.',
            'Si recuerdas una palabra hiriente que dijiste, pide disculpas hoy.'
        ],
        prayer: 'Señor, pon un guarda en mi boca. Que mis palabras traigan sanidad, no dolor. Quiero ser conocido no por lo que sé, sino por cómo amo a través de lo que digo. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '305',
        title: 'Sabiduría: Día 6 — Respuesta suave',
        category: 'Sabiduría',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'La blanda respuesta quita la ira, mas la palabra áspera hace subir el furor.',
        bibleReference: 'Proverbios 15:1',
        content: [
            'Todos hemos estado allí: alguien nos provoca con un comentario hiriente y nuestra reacción instintiva es devolver el golpe con otro comentario más fuerte. Es la ley del talión emocional: ojo por ojo, diente por diente. Pero Proverbios nos ofrece un camino diferente.',
            'La "blanda respuesta" no es debilidad. Al contrario, se necesita más fuerza para responder con calma cuando todo tu ser quiere estallar. Una respuesta suave desarma al agresor y apaga el fuego antes de que se convierta en incendio. La palabra áspera, por otro lado, es gasolina en el fuego.',
            'En el calor del conflicto, nuestra mente se nubla y reaccionamos desde la emoción. La sabiduría nos invita a hacer una pausa, respirar y elegir una respuesta que refleje el carácter de Dios. No se trata de reprimir tus sentimientos, sino de canalizarlos de una manera que traiga paz en lugar de más conflicto.',
            'Hoy, antes de reaccionar ante una provocación, recuerda que una respuesta suave tiene el poder de transformar una discusión en un diálogo y un enemigo en un amigo.'
        ],
        applicationSteps: [
            'Identifica una relación donde tiendes a responder con aspereza.',
            'Comprométete a responder con calma la próxima vez que surja un conflicto.',
            'Practica responder con una frase como: "Entiendo cómo te sientes, hablemos con calma".'
        ],
        prayer: 'Señor, dame la fuerza para responder con suavidad cuando mi instinto sea atacar. Ayúdame a ser un pacificador en lugar de avivar el fuego del conflicto. Que mi boca refleje Tu amor. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '306',
        title: 'Sabiduría: Día 7 — Paciencia y entendimiento',
        category: 'Sabiduría',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'El que tarda en airarse es grande de entendimiento, pero el de corazón impulsivo engrandece la necedad.',
        bibleReference: 'Proverbios 14:29',
        content: [
            'La paciencia parece estar en extinción. Queremos respuestas instantáneas, comida rápida, relaciones sin esfuerzo y resultados inmediatos. Pero la sabiduría bíblica nos dice que la paciencia no es un signo de debilidad, sino de grandeza de entendimiento.',
            'Proverbios 14:29 contrasta a dos personas: la que tarda en airarse y la impulsiva. La primera es "grande de entendimiento" —tiene perspectiva, ve el panorama completo, sabe que la ira rara vez mejora las cosas. La segunda "engrandece la necedad" —sus reacciones impulsivas agravan los problemas en lugar de resolverlos.',
            'La próxima vez que sientas que la ira sube por tu cuello como lava, recuerda: la paciencia te da el superpoder de responder en lugar de reaccionar. Una pausa de cinco segundos puede salvarte de decir algo que lamentarás por años.',
            'Dios es paciente contigo cada día. Él no pierde los estribos cuando fallas una y otra vez. ¿Podrías extender esa misma paciencia a las personas que te rodean?'
        ],
        applicationSteps: [
            'Cuando sientas que la ira surge, cuenta hasta 5 antes de hablar o actuar.',
            'Pregúntate: "¿Esto importará dentro de 5 años?" — te ayudará a ganar perspectiva.',
            'Practica la paciencia en algo pequeño hoy: una fila, el tráfico, una espera.'
        ],
        prayer: 'Dios, dame paciencia. Cuando quiera explotar, recuérdame que Tú eres paciente conmigo. Ayúdame a ser grande de entendimiento, no de impulsividad. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '307',
        title: 'Sabiduría: Día 8 — Dios dirige nuestros pasos',
        category: 'Sabiduría',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'El corazón del hombre traza su rumbo, pero sus pasos los dirige el Señor.',
        bibleReference: 'Proverbios 16:9',
        content: [
            'Hacemos planes. Muchos planes. Estudiamos, trabajamos, ahorramos, proyectamos. Y está bien hacerlo. Pero Proverbios nos recuerda una verdad humilde: podemos trazar nuestro rumbo, pero al final, es Dios quien dirige nuestros pasos.',
            'Esto no significa que no debamos planificar. Significa que debemos planificar con la mano abierta, dispuestos a que Dios cambie nuestros planes en cualquier momento. Es la diferencia entre un itinerario rígido y una brújula flexible. Sabemos hacia dónde vamos, pero dejamos que Dios elija el camino.',
            'A veces los planes se cancelan, las puertas se cierran y los caminos se bloquean. En lugar de frustrarte, pregúntale a Dios: "¿Qué quieres mostrarme con este cambio de dirección?". Porque Sus caminos son más altos que nuestros caminos, y Sus pensamientos más altos que nuestros pensamientos.',
            'Hoy, haz tus planes con lápiz, no con tinta. Deja espacio para que Dios borre, corrija y reescriba. Al final, Sus planes para ti son de bienestar y no de calamidad, para darte un futuro y una esperanza.'
        ],
        applicationSteps: [
            'Escribe tus planes para esta semana, pero al final añade: "Si el Señor quiere".',
            'Identifica un plan reciente que no funcionó como esperabas. ¿Qué podría estar enseñándote Dios?',
            'Ora: "Señor, estos son mis planes, pero los pongo en Tus manos. Dirige mis pasos".'
        ],
        prayer: 'Señor, tengo planes y sueños, pero reconozco que Tú eres quien dirige mis pasos. Ayúdame a confiar cuando mis planes cambien, sabiendo que Tus caminos son mejores. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '308',
        title: 'Sabiduría: Día 9 — Enseña al niño',
        category: 'Sabiduría',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1503676268428-2f5c3d2b5e8d?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él.',
        bibleReference: 'Proverbios 22:6',
        content: [
            'Proverbios 22:6 es uno de los versículos más conocidos de la Biblia, pero también uno de los más incomprendidos. No es una fórmula mágica que garantiza que tus hijos serán perfectos. Es un principio de siembra: lo que plantas en el corazón de un niño, crece con él.',
            'No se trata solo de niños biológicos. Todos tenemos "niños" en nuestra vida: un hermano menor, un primo, un amigo más joven, un discípulo. Todos estamos llamados a invertir en la próxima generación, a compartir la sabiduría que hemos recibido.',
            'Instruir no es solo dar información. Es vivir el ejemplo, es caminar junto a ellos, es responder sus preguntas con paciencia. Es crear un ambiente donde puedan crecer, fallar y aprender sin miedo al rechazo. La instrucción más poderosa no es la que se escucha, sino la que se ve.',
            '¿Quién está mirando tu vida hoy? ¿A quién estás instruyendo, intencionalmente o no? Tu vida es un sermón que alguien está leyendo. Asegúrate de que lo que leen apunta hacia Jesús.'
        ],
        applicationSteps: [
            'Identifica a un joven o niño en tu vida a quien puedas mentorar o animar.',
            'Invítalo a tomar un café o un helado y pregúntale cómo está realmente.',
            'Hoy, sé consciente de que alguien más joven te observa. Vive de manera que valga la pena imitar.'
        ],
        prayer: 'Señor, ayúdame a ser un buen ejemplo para quienes me observan. Dame paciencia y sabiduría para instruir a la próxima generación con amor y verdad. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '309',
        title: 'Sabiduría: Día 10 — Hierro con hierro',
        category: 'Sabiduría',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1513542789411-5f4b5f2b5f0e?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'El hierro con hierro se aguza, y así el hombre aguza el rostro de su amigo.',
        bibleReference: 'Proverbios 27:17',
        content: [
            'Nadie se afila solo. Un cuchillo necesita una piedra de afilar para recuperar su filo, y nosotros necesitamos amigos que nos desafíen, nos corrijan y nos animen para crecer. Proverbios 27:17 captura esta verdad en una imagen poderosa.',
            'El problema es que muchos jóvenes cristianos intentan vivir su fe en solitario. Creen que pueden crecer espiritualmente sin comunidad, sin rendición de cuentas, sin amigos que los desafíen. Pero la Biblia deja claro que el crecimiento requiere fricción, y la fricción requiere relación.',
            'Un amigo que te "aguza" no es alguien que solo te dice lo que quieres escuchar. Es alguien que te ama lo suficiente como para decirte la verdad, que te confronta con amor cuando te estás desviando, que camina a tu lado en las batallas espirituales. Así como el hierro desgasta el óxido del otro metal, un buen amigo te ayuda a deshacerte de lo que te está dañando.',
            '¿Tienes un amigo así? ¿Eres tú ese amigo para alguien más? La fe no fue diseñada para vivirse en una isla. Busca a alguien con quien afilarte hoy.'
        ],
        applicationSteps: [
            'Identifica a un amigo de confianza con quien puedas compartir tus luchas.',
            'Envía un mensaje hoy a un amigo y pregúntale sinceramente: "¿Cómo puedo orar por ti?".',
            'Considera unirte a un grupo pequeño o célula en tu iglesia o comunidad.'
        ],
        prayer: 'Señor, gracias por las personas que has puesto en mi vida. Ayúdame a ser un amigo que aguza, que desafía con amor y que camina junto a otros. No quiero hacer esta carrera solo. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '310',
        title: 'Sabiduría: Día 11 — La mujer y el hombre que temen a Dios',
        category: 'Sabiduría',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1491301494986-f10c4fa0f5f1?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Engañosa es la gracia, y vana la hermosura; la mujer que teme a Jehová, esa será alabada.',
        bibleReference: 'Proverbios 31:30',
        content: [
            'El mundo te mide por tu apariencia, tu carisma, tu popularidad. Te dice que mientras te veas bien, tengas seguidores y causes impresión, has triunfado. Pero Proverbios 31 nos da una escala de valores completamente diferente.',
            'Mientras el mundo celebra la belleza externa y el encanto superficial, la Biblia dice que son "engañosos y vanos". Pasan, se desvanecen, no duran. Lo que realmente importa —lo que merece ser alabado— es el temor del Señor. Esa reverencia profunda a Dios que transforma cómo vives, amas y sirves.',
            'Este principio aplica tanto a hombres como a mujeres. El temor del Señor te lleva a vivir con integridad cuando nadie te ve, a trabajar con excelencia, a tratar a los demás con dignidad, a administrar bien tu tiempo y tus recursos. Es la persona que, al final del día, es recordada no por cómo se veía, sino por cómo amaba.',
            '¿Estás construyendo tu vida sobre lo que el mundo valora o sobre lo que realmente perdura? La verdadera belleza es la que viene de un corazón que honra a Dios.'
        ],
        applicationSteps: [
            'Haz una lista de las cualidades que admiras en personas que temen a Dios.',
            'Pregúntate: "Si mi apariencia desapareciera mañana, ¿qué quedaría de mí?"',
            'Invierte más tiempo hoy en cultivar tu carácter que en tu apariencia externa.'
        ],
        prayer: 'Señor, quiero ser alguien que te teme y te honra en todo lo que hace. Ayúdame a no perseguir la aprobación del mundo, sino a buscar Tu "¡Bien hecho!" al final. Amén.',
        author: 'Equipo Conecta+'
    },

    // ===== ESPÍRITU SANTO =====
    {
        id: '311',
        title: 'Espíritu Santo: Día 1 — El Consolador prometido',
        category: 'Espíritu Santo',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Y yo rogaré al Padre, y os dará otro Consolador, para que esté con vosotros para siempre: el Espíritu de verdad.',
        bibleReference: 'Juan 14:16-17',
        content: [
            'Jesús sabía que dejaría a sus discípulos físicamente, pero no los dejaría solos. Su promesa del Espíritu Santo como "otro Consolador" es una de las declaraciones más poderosas de toda la Escritura. La palabra griega es "Parákletos" — alguien llamado a estar al lado de otro para ayudarlo.',
            'Un Consolador no es alguien que simplemente te da palmaditas en la espalda. Es un abogado defensor, un consejero, un animador, un ayudante. El Espíritu Santo es todo eso para ti hoy. Está literalmente a tu lado en cada momento, listo para guiarte, fortalecerte y consolarte.',
            'Jesús dijo "otro Consolador", implicando que Él mismo había sido el primero. El Espíritu Santo no es menos que Jesús; es la presencia de Jesús continuando su obra en la tierra a través de cada creyente. No tienes que enfrentar la vida solo.',
            '¿Has intentado vivir tu fe con tus propias fuerzas? El Consolador está esperando que le pidas ayuda. Él no se impone, pero está siempre disponible. Hoy, recuerda: el mismísimo Espíritu de Dios vive en ti y está a tu lado.'
        ],
        applicationSteps: [
            'Tómate 2 minutos en silencio hoy, pídele al Espíritu Santo que te muestre Su presencia.',
            'Repite en voz baja: "Espíritu Santo, gracias por estar conmigo ahora mismo".',
            'Al enfrentar una decisión hoy, pregúntale: "¿Qué debo hacer, Consolador?".'
        ],
        prayer: 'Espíritu Santo, gracias por ser mi Consolador. Muchas veces he vivido ignorando Tu presencia. Hoy reconozco que estás conmigo. Ayúdame a escuchar Tu voz y caminar en Tu consuelo. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '312',
        title: 'Espíritu Santo: Día 2 — Poder del Espíritu',
        category: 'Espíritu Santo',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1508670357135-2e5c6af5cf1c?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos... hasta lo último de la tierra.',
        bibleReference: 'Hechos 1:8',
        content: [
            'Jesús no les dijo a sus discípulos: "Sean valientes, esfuércense, den lo mejor de sí". Les dijo: "Recibirán poder". La diferencia es fundamental. El cristianismo no se trata de tu fuerza para Dios, sino del poder de Dios a través de ti.',
            'Ese poder no es solo para hacer milagros espectaculares. Es poder para perdonar cuando duele, para resistir la tentación cuando es intensa, para amar a quien es difícil de amar, para hablar de Jesús cuando da miedo. Es el poder sobrenatural para vivir una vida sobrenatural.',
            'El mismo poder que levantó a Jesús de los muertos está disponible para ti. Pero muchas veces vivimos como si ese poder no existiera, confiando en nuestras propias habilidades y agotándonos en el intento. Es como tener un generador eléctrico gigante y usar velas.',
            'El poder del Espíritu no es para que luzcas bien, sino para que seas testigo. No se trata de ti, se trata de que otros vean a Jesús a través de ti. ¿Estás viviendo en tus propias fuerzas o has aprendido a depender del poder del Espíritu?'
        ],
        applicationSteps: [
            'Identifica un área donde has estado dependiendo de tus propias fuerzas.',
            'Ora específicamente pidiendo el poder del Espíritu Santo para esa área hoy.',
            'Comparte con alguien cómo Dios te ha dado poder en una situación difícil.'
        ],
        prayer: 'Espíritu Santo, necesito Tu poder. No quiero seguir viviendo en mis propias fuerzas, agotado y frustrado. Lléname de Tu poder sobrenatural para vivir como un testigo fiel de Jesús. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '313',
        title: 'Espíritu Santo: Día 3 — El fruto del Espíritu',
        category: 'Espíritu Santo',
        time: '5 min',
        image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza.',
        bibleReference: 'Gálatas 5:22-23',
        content: [
            'Si el poder del Espíritu es el motor, el fruto del Espíritu es el combustible que se ve en tu vida diaria. Pablo enumera nueve cualidades que son la evidencia natural de que el Espíritu está obrando en ti. No son logros que consigues con esfuerzo, sino el resultado de permanecer conectado a la vid verdadera.',
            'El orden no es casual. Todo comienza con amor —el amor incondicional de Dios— y de ahí brota el gozo que no depende de las circunstancias, la paz que sobrepasa todo entendimiento, la paciencia que soporta las pruebas, la benignidad y bondad que tratan a otros como Dios te trata a ti.',
            'La fe aquí no es la salvación, sino la fidelidad confiable del carácter. La mansedumbre no es debilidad, sino fuerza bajo control. Y la templanza es el dominio propio que te permite decir "no" a tus impulsos y "sí" a la voluntad de Dios.',
            'No puedes fabricar este fruto con esfuerzo humano. Solo puedes darle espacio al Espíritu para que lo produzca. Así como una fruta tarda en madurar, estas cualidades se desarrollan con el tiempo a medida que caminas con Dios. Sé paciente contigo mismo y confía en que el Espíritu está trabajando.'
        ],
        applicationSteps: [
            'Evalúa cuál de estas 9 cualidades necesitas más hoy y ora específicamente por ella.',
            'Pregunta a un amigo de confianza: "¿Qué fruto del Espíritu ves creciendo en mí?".',
            'Lee Gálatas 5:22-23 en voz alta y pídele al Espíritu que cultive ese fruto en ti.'
        ],
        prayer: 'Espíritu Santo, cultiva Tu fruto en mí. Quiero ser conocido por mi amor, mi gozo y mi paz, no por mis esfuerzos humanos. Trabaja en mí hasta que Tu carácter se refleje en mi vida. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '314',
        title: 'Espíritu Santo: Día 4 — El Espíritu intercede',
        category: 'Espíritu Santo',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1507608617752-3b7a09e1e0c9?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Y de igual manera el Espíritu nos ayuda en nuestra debilidad; pues qué hemos de pedir como conviene, no lo sabemos, pero el Espíritu mismo intercede por nosotros con gemidos indecibles.',
        bibleReference: 'Romanos 8:26',
        content: [
            '¿Alguna vez te has quedado sin palabras al orar? Has intentado orar, pero no sabes qué decir, cómo pedir, ni siquiera por dónde empezar. Romanos 8:26 es uno de los versículos más reconfortantes de la Biblia porque habla exactamente de esos momentos.',
            'El Espíritu Santo no te juzga por tu oración "imperfecta". Al contrario, Él toma tus suspiros, tus lágrimas, tus palabras entrecortadas y las traduce delante del Padre como una intercesión perfecta. Cuando tú no tienes palabras, el Espíritu pone las Suyas.',
            'Tus debilidades no son un obstáculo para la oración; son el escenario perfecto para que el Espíritu muestre Su fortaleza. No necesitas tener una teología perfecta ni un vocabulario elocuente. Solo necesitas venir tal como eres, y dejar que el Espíritu se encargue del resto.',
            'Hoy, si no sabes orar, simplemente preséntate ante Dios. Siéntate en silencio. Respira. Dile: "Espíritu, ora por mí". Y confía en que Él está intercediendo por ti con gemidos que el Padre entiende perfectamente.'
        ],
        applicationSteps: [
            'Si hoy te cuesta orar, siéntate en silencio 5 minutos y dile al Espíritu: "Ora tú por mí".',
            'Escribe en un papel tus preocupaciones, aunque sean palabras sueltas, y ponlo delante de Dios.',
            'Recuerda: no necesitas orar "bonito", solo necesitas orar honesto.'
        ],
        prayer: 'Espíritu Santo, no sé orar como debería. Toma mis palabras, mis suspiros y mi silencio, y preséntalos ante el Padre. Gracias porque cuando yo no tengo fuerza, Tú intercedes por mí. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '315',
        title: 'Espíritu Santo: Día 5 — Dones espirituales',
        category: 'Espíritu Santo',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Pero a cada uno le es dada la manifestación del Espíritu para provecho.',
        bibleReference: '1 Corintios 12:7',
        content: [
            'Dios no te creó para que seas un espectador en el reino. Cada creyente tiene dones espirituales dados por el Espíritu Santo no para su propio beneficio, sino "para provecho" —para servir a los demás y edificar la iglesia. No eres un accidente ni un relleno, tienes un propósito específico.',
            'Tal vez pienses que no tienes dones especiales, que eres "solo un cristiano común". Pero Pablo dice que a CADA UNO le es dada una manifestación del Espíritu. Si eres creyente, tienes al menos un don. Puede ser enseñanza, servicio, liderazgo, fe, sanidad, discernimiento, hospitalidad... la lista es extensa.',
            'El problema no es que no tengas dones, sino que quizás no los has descubierto o no los estás usando. Los dones no son trofeos para admirar, son herramientas para usar. No se desarrollan en un estante, se perfeccionan en el servicio. Cuanto más los usas, más efectivos se vuelven.',
            'Descubrir tus dones comienza con servir, probar cosas diferentes y pedirle al Espíritu que te muestre dónde te ha equipado. No tengas miedo de intentar. El mismo Espíritu que te da el don te dará la gracia para usarlo.'
        ],
        applicationSteps: [
            'Pregúntate: "¿Qué se me da bien hacer para bendición de otros?"',
            'Ofrécete a servir en un área de tu iglesia o comunidad que nunca has intentado.',
            'Pide a dos personas que conozcan tus dones que te digan qué fortalezas ven en ti.'
        ],
        prayer: 'Espíritu Santo, gracias porque me has dado dones para servir. Muéstrame cuáles son y dame oportunidades para usarlos para bendición de otros. No quiero ser un espectador, quiero ser un instrumento en Tus manos. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '316',
        title: 'Espíritu Santo: Día 6 — Llenos del Espíritu',
        category: 'Espíritu Santo',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1518173946687-9277050ab6b9?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'No os embriaguéis con vino, en lo cual hay disolución; antes bien sed llenos del Espíritu.',
        bibleReference: 'Efesios 5:18',
        content: [
            'Pablo contrasta dos tipos de "llenura": la del vino y la del Espíritu. Una te lleva a la disolución —pérdida de control, decisiones que lamentas, vida desordenada. La otra te lleva a una vida plena, controlada por Dios, con propósito y dirección clara.',
            'La orden "sed llenos del Espíritu" está en tiempo presente y voz pasiva en el griego. Literalmente significa: "sigan siendo llenados continuamente". No es una experiencia única que recibiste cuando creíste o cuando fuiste bautizado. Es una llenura diaria, un flujo constante.',
            'Piénsalo como un vaso de agua. Puedes llenarte una vez, pero si no vuelves a la fuente, te vacías. Necesitas regresar cada día a la presencia de Dios para ser rellenado. La oración, la adoración, la Palabra y la comunión con otros creyentes son los canales por los que el Espíritu te llena.',
            '¿Cuándo fue la última vez que sentiste la plenitud del Espíritu Santo en tu vida? Si hace mucho tiempo, hoy puedes regresar a la fuente. No se trata de un sentimiento, sino de una rendición renovada cada día.'
        ],
        applicationSteps: [
            'Dedica los primeros 5 minutos de tu mañana a pedir: "Espíritu Santo, lléname hoy".',
            'Identifica algo que esté "vaciándote" espiritualmente y aléjate de ello.',
            'Escucha una canción de adoración hoy y permite que el Espíritu te llene mientras la cantas.'
        ],
        prayer: 'Espíritu Santo, no quiero vivir vacío. Hoy te pido que me llenes de nuevo. Quita todo lo que me roba Tu plenitud y lléname hasta que mi vida desborde de Tu presencia. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '317',
        title: 'Espíritu Santo: Día 7 — Pentecostés',
        category: 'Espíritu Santo',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'De repente vino del cielo un estruendo como de un viento recio que soplaba, el cual llenó toda la casa donde estaban sentados; y se les aparecieron lenguas repartidas, como de fuego, asentándose sobre cada uno de ellos.',
        bibleReference: 'Hechos 2:2-3',
        content: [
            'Pentecostés cambió la historia. Un grupo de discípulos asustados escondidos en un aposento alto se convirtieron en testigos audaces que transformaron el mundo. ¿Qué pasó? Fueron llenos del Espíritu Santo. No fue una experiencia tranquila y ordenada; fue ruidosa, visible y poderosa.',
            'El viento y el fuego son símbolos poderosos del Espíritu. El viento no se ve, pero se siente; no se controla, pero se navega. El fuego purifica, ilumina y se expande. El Espíritu Santo no vino para que los discípulos tuvieran una experiencia emocional, sino para equiparlos para una misión.',
            'La misma llenura del Espíritu que recibieron los discípulos en Pentecostés está disponible para ti hoy. No necesitas esperar un evento especial. El Espíritu ya vive en ti si eres creyente. Lo que necesitas es rendirte a Su llenura y permitirle que te use como usó a aquellos primeros cristianos.',
            'El mundo necesita ver cristianos llenos del Espíritu que no tengan miedo de hablar de Jesús, que vivan con poder sobrenatural y que amen sin límites. Ese mismo poder de Pentecostés está disponible para ti hoy.'
        ],
        applicationSteps: [
            'Lee Hechos 2 completo hoy y pídele a Dios que avive ese mismo fuego en ti.',
            'Pregúntate: "¿Qué haría si no tuviera miedo?" y pídele al Espíritu valentía para hacerlo.',
            'Comparte tu fe con alguien hoy, confiando en el poder del Espíritu, no en tus palabras.'
        ],
        prayer: 'Espíritu Santo, quiero experimentar un Pentecostés personal. Aviva el fuego en mí, dame la valentía que tuvieron los primeros discípulos. No quiero ser un cristiano tímido, quiero ser un testigo audaz. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '318',
        title: 'Espíritu Santo: Día 8 — Libertad en el Espíritu',
        category: 'Espíritu Santo',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1484417894907-2e0e6ae5c6d5?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Porque el Señor es el Espíritu; y donde está el Espíritu del Señor, allí hay libertad.',
        bibleReference: '2 Corintios 3:17',
        content: [
            'Si hay una palabra que describe lo que el Espíritu Santo trae, es libertad. Libertad de la culpa, libertad de la vergüenza, libertad del miedo, libertad de la adicción, libertad de la necesidad de aprobación humana. Donde está el Espíritu del Señor, las cadenas se rompen.',
            'No es una libertad para hacer lo que queramos, sino la libertad para ser quienes realmente fuimos creados para ser. Es como un pájaro en una jaula: cuando la puerta se abre, no pierde algo, gana su verdadera naturaleza: volar. El Espíritu abre la puerta de tu jaula.',
            'Muchos cristianos viven como si todavía estuvieran en la cárcel, aunque la puerta está abierta. Siguen cargando culpas que ya fueron perdonadas, temores que ya fueron vencidos, ataduras que ya fueron rotas. El Espíritu no solo te libera, te recuerda que eres libre.',
            '¿Hay un área de tu vida donde no estás experimentando libertad? Tal vez el Espíritu ya la ha declarado libre, pero tú sigues viviendo como si las cadenas estuvieran todavía puestas. Hoy es el día para caminar en la libertad que Cristo compró para ti.'
        ],
        applicationSteps: [
            'Identifica un área donde sigues viviendo como esclavo aunque Cristo te hizo libre.',
            'Declara en voz alta: "Donde está el Espíritu del Señor, allí hay libertad. Yo soy libre."',
            'Busca ayuda si hay un área de adicción o atadura que no puedes romper solo.'
        ],
        prayer: 'Espíritu Santo, gracias porque donde Tú estás, hay libertad. Hoy reclamo esa libertad sobre mi vida. Rompe las cadenas que me atan y ayúdame a caminar en la verdadera libertad que Cristo compró para mí. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '319',
        title: 'Espíritu Santo: Día 9 — Guiados por el Espíritu',
        category: 'Espíritu Santo',
        time: '4 min',
        image: 'https://images.unsplash.com/photo-1487611459768-b9231e8f3acf?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Porque todos los que son guiados por el Espíritu de Dios, estos son hijos de Dios.',
        bibleReference: 'Romanos 8:14',
        content: [
            'Una de las preguntas más frecuentes entre los jóvenes cristianos es: "¿Cómo sé cuál es la voluntad de Dios para mi vida?". Romanos 8:14 nos da una respuesta simple pero profunda: los hijos de Dios son guiados por el Espíritu. No se trata de una fórmula mágica, sino de una relación viva.',
            'Ser guiado por el Espíritu no significa recibir un mensaje de texto celestial cada vez que tienes que decidir algo. Es más como aprender a reconocer la voz de un Pastor en medio del ruido del mundo. Jesús dijo: "Mis ovejas oyen mi voz". Conocer Su voz se desarrolla con el tiempo, pasando tiempo con Él.',
            'El Espíritu guía principalmente a través de la Palabra de Dios, la paz en tu corazón, el consejo de hermanos sabios y las circunstancias providenciales. Rara vez es solo una de estas cosas; generalmente es una combinación que confirma Su dirección. La guía del Espíritu nunca contradice la Escritura.',
            'No tengas miedo de tomar decisiones. El Espíritu no te guía con un "sí" o "no" para cada detalle minucioso. Te ha dado una mente renovada y principios bíblicos. A veces, la guía del Espíritu es simplemente darte la sabiduría para tomar una buena decisión y la paz para confirmarla.'
        ],
        applicationSteps: [
            'Antes de tomar una decisión importante hoy, pregúntate: "¿Qué dice la Palabra de Dios sobre esto?".',
            'Pide al Espíritu que te dé paz o falta de paz sobre una decisión que estás considerando.',
            'Busca el consejo de un cristiano maduro sobre una decisión que enfrentas.'
        ],
        prayer: 'Espíritu Santo, quiero ser guiado por Ti. Ayúdame a reconocer Tu voz en medio del ruido. Dame sabiduría para tomar decisiones y paz para confirmar Tu dirección. No quiero vivir perdido, quiero caminar guiado por Ti. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '320',
        title: 'Espíritu Santo: Día 10 — El Espíritu de verdad',
        category: 'Espíritu Santo',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1504052434537-1f8c5f2a7dfe?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'Pero cuando venga el Espíritu de verdad, él os guiará a toda la verdad; porque no hablará por su propia cuenta, sino que hablará todo lo que oyere, y os hará saber las cosas que habrán de venir.',
        bibleReference: 'Juan 16:13',
        content: [
            'Vivimos en una era de verdades líquidas, donde cada persona tiene "su propia verdad". En medio de tanta confusión, Jesús prometió el Espíritu de verdad que nos guiaría a TODA la verdad. No a una verdad relativa, sino a la verdad absoluta que nos hace libres.',
            'El Espíritu Santo es la única brújula que no se desvía en medio de un mundo que ha perdido el norte. Él no habla por Su propia cuenta, sino que comunica lo que recibe del Padre y del Hijo. Es la voz de Dios en medio del caos de opiniones humanas.',
            'Ser guiado a toda la verdad no significa saberlo todo. Significa que el Espíritu te guía en el camino de la verdad, paso a paso. Revela áreas de tu vida donde has creído mentiras. Expone las falsedades que el enemigo ha sembrado en tu mente. Te muestra la verdad sobre Dios, sobre ti mismo y sobre tu propósito.',
            '¿Qué mentiras has estado creyendo? ¿Qué "verdades" del mundo has aceptado sin cuestionarlas a la luz de la Palabra? El Espíritu de verdad está listo para guiarte, pero debes estar dispuesto a dejar que Él cuestione lo que has dado por sentado.'
        ],
        applicationSteps: [
            'Pregúntale al Espíritu Santo: "¿Qué mentira he estado creyendo sobre mí mismo o sobre Dios?".',
            'Escribe una mentira que has creído y búscale una verdad bíblica que la contradiga.',
            'Comprométete a pasar tiempo en la Palabra, porque el Espíritu usa la verdad escrita para guiarte.'
        ],
        prayer: 'Espíritu de verdad, guíame a toda la verdad. Expón las mentiras que he creído y reemplázalas con Tu verdad. No quiero vivir engañado. Quiero conocerte a Ti, que eres la Verdad. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '321',
        title: 'Espíritu Santo: Día 11 — Sello del Espíritu',
        category: 'Espíritu Santo',
        time: '3 min',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=500',
        bibleVerse: 'En él también vosotros, habiendo oído la palabra de verdad, el evangelio de vuestra salvación, y habiendo creído en él, fuisteis sellados con el Espíritu Santo de la promesa.',
        bibleReference: 'Efesios 1:13',
        content: [
            'Cuando el banco sella un documento, certifica que es auténtico. Cuando un rey ponía su sello en una carta, garantizaba que venía de su autoridad. De la misma manera, Dios ha puesto Su sello sobre ti: el Espíritu Santo. Eres auténtico, eres propiedad de Dios, tienes Su garantía.',
            'El sello del Espíritu tiene dos propósitos: identificación y seguridad. Te identifica como propiedad de Dios —no eres del mundo, eres de Él. Y te da seguridad —nadie puede romper el sello de Dios. Tu salvación no depende de tu desempeño, sino del sello inalterable de Dios sobre tu vida.',
            'Pablo llama al Espíritu "las arras de nuestra herencia" —una garantía, un pago inicial que asegura que el resto vendrá. El Espíritu en tu vida es la prueba de que Dios cumplirá todas Sus promesas. Es como el anillo de compromiso que asegura la boda que vendrá.',
            'Cuando dudes de tu salvación, cuando el enemigo te acuse, cuando sientas que no eres lo suficientemente bueno, recuerda: llevas el sello del Espíritu Santo. Eres auténtico, eres amado, eres de Dios. Y Su sello es irrompible.'
        ],
        applicationSteps: [
            'Si luchas con dudas sobre tu salvación, habla en voz alta: "Estoy sellado por el Espíritu Santo. Soy de Dios."',
            'Escribe Efesios 1:13 en un lugar visible hoy como recordatorio de tu seguridad en Cristo.',
            'Comparte con alguien la certeza que tienes en Cristo, basada en el sello del Espíritu.'
        ],
        prayer: 'Padre, gracias porque me has sellado con Tu Espíritu Santo. Cuando dude de mi salvación, recuérdame que llevo Tu sello. No estoy esperando ser aceptado, ya soy aceptado en Cristo. Mi seguridad está en Ti. Amén.',
        author: 'Equipo Conecta+'
    },

    ...(generatedDevotionals as unknown as Devotional[])
];
