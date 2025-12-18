export interface Devotional {
    id: string;
    title: string;
    category: string;
    time: string;
    image: string; // CSS class for background
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
        image: 'bg-primary-subtle',
        bibleVerse: 'Echad toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.',
        bibleReference: '1 Pedro 5:7',
        content: [
            'A veces sentimos que la ansiedad es un monstruo gigante que no podemos controlar. Nos despierta en la noche, nos acelera el corazón y nos roba la paz. Pero la ansiedad no es tu identidad.',
            'Pedro nos dice que "echemos" nuestra ansiedad. La palabra griega implica un lanzamiento fuerte, decidido. No es "dejar caer" pasivamente; es tomar esa carga pesada y arrojarla lejos de nosotros, directamente sobre los hombros fuertes de Jesús.',
            'Él no se molesta por tus preocupaciones. Al contrario, Él pide que se las des porque Él sí puede manejarlas. Tú no fuiste diseñado para cargar el peso del mundo, pero Él sí.'
        ],
        applicationSteps: [
            'Escribe en una nota del celular qué te preocupa exactamente hoy.',
            'Visualiza cómo le entregas esa nota a Jesús.',
            'Respira profundo 3 veces y di: "Tú tienes cuidado de mí".'
        ],
        prayer: 'Señor, hoy te entrego mi mente acelerada. No puedo con esto, pero Tú sí. Gracias porque no tengo que ser fuerte todo el tiempo. Recibo tu paz ahora. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '2',
        title: 'Pureza en un mundo sucio',
        category: 'Integridad',
        time: '4 min',
        image: 'bg-danger-subtle',
        bibleVerse: '¿Con qué limpiará el joven su camino? Con guardar tu palabra.',
        bibleReference: 'Salmos 119:9',
        content: [
            'Vivimos bombardeados de imágenes. Un clic, un anuncio, una escena inesperada. Y luego viene la culpa: "¿Por qué vi eso? ¿Soy un hipócrita?".',
            'El salmista no pregunta "¿Cómo será perfecto el joven?", sino "¿Cómo limpiará su camino?". Esto implica que nos vamos a ensuciar los pies al caminar por este mundo. La clave no es la perfección impecable, sino el lavado constante.',
            'La Palabra de Dios no es un regaño, es agua fresca. Cuando fallas, no huyas DE Dios, corre HACIA Dios. Él es quien te limpia. La pureza no es una racha de días sin caer, es un corazón que ama a Jesús más que al placer momentáneo.'
        ],
        applicationSteps: [
            'Instala un bloqueador de anuncios o filtros si es necesario.',
            'Si caes, no te quedes en el suelo lamentándote. Levántate rápido.',
            'Memoriza Salmos 119:9 para recordarlo en momentos de tentación.'
        ],
        prayer: 'Jesús, mi carne es débil, pero Tú eres mi fuerza. Limpia mi mente de imágenes que no te agradan. Ayúdame a ver la pureza no como una regla, sino como una forma de amarte más. Amén.',
        author: 'Pastor Andrés'
    },
    {
        id: '3',
        title: 'Identidad: ¿Quién dices que soy?',
        category: 'Identidad',
        time: '5 min',
        image: 'bg-info-subtle',
        bibleVerse: 'Mirad cuál amor nos ha dado el Padre, para que seamos llamados hijos de Dios.',
        bibleReference: '1 Juan 3:1',
        content: [
            'El mundo te define por tus logros, tus likes, tu apariencia o tus errores pasados. Es fácil sentirse como un "fracaso" o un "impostor".',
            'Pero Dios te define de una sola manera: HIJO. No eres "el ansioso", "el adicto" o "el problemático". Esas son batallas que peleas, no quien ERES.',
            'Cuando sabes que eres un Hijo amado, no necesitas mendigar aprobación. Ya tienes la aprobación del Creador del Universo. Tu valor fue pagado en la cruz, y es altísimo.'
        ],
        applicationSteps: [
            'Mírate al espejo y di en voz alta: "Soy un hijo amado de Dios".',
            'Deja de seguir cuentas en redes sociales que te hagan sentir inferior.',
            'Recuerda un momento donde sentiste el amor de Dios y escríbelo.'
        ],
        prayer: 'Padre, perdóname por buscar mi valor en cosas vacías. Gracias porque mi identidad está segura en Ti. Soy tuyo, y eso es suficiente. Amén.',
        author: 'Sara M.'
    },
    {
        id: '4',
        title: 'Soledad acompañada',
        category: 'Soledad',
        time: '3 min',
        image: 'bg-secondary-subtle',
        bibleVerse: 'Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo.',
        bibleReference: 'Salmos 23:4',
        content: [
            'Puedes estar rodeado de gente y sentirte completamente solo. La soledad es ese eco vacío en el pecho que dice "nadie me entiende".',
            'David escribió el Salmo 23 en momentos peligrosos y solitarios. Su consuelo no fue que el valle desapareciera, sino que "TÚ estarás conmigo".',
            'La presencia de Dios convierte la soledad en "solitud" (un tiempo a solas con Él). No estás abandonado. El Espíritu Santo es llamado "El Consolador" y vive dentro de ti.'
        ],
        applicationSteps: [
            'Habla con Dios como si estuviera sentado en la silla a tu lado.',
            'Envía un mensaje a un amigo cristiano y sé honesto: "Me siento solo hoy".',
            'Escucha una canción de adoración que hable de Su presencia.'
        ],
        prayer: 'Dios, a veces me siento invisible. Gracias porque Tú siempre me ves. Llena este vacío con tu presencia real y tangible hoy. No estoy solo. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '5',
        title: 'Cuando fallas otra vez',
        category: 'Culpa',
        time: '4 min',
        image: 'bg-warning-subtle',
        bibleVerse: 'Porque siete veces cae el justo, y vuelve a levantarse.',
        bibleReference: 'Proverbios 24:16',
        content: [
            'La diferencia entre un justo y un impío no es que el justo no cae. ¡El versículo dice que cae siete veces! La diferencia es que se levanta.',
            'El enemigo quiere que te quedes en el suelo, revolcándote en la culpa: "Nunca vas a cambiar", "Dios está harto de ti". ¡Mentira!',
            'La gracia de Dios es el brazo extendido que te ayuda a ponerte de pie. No abuses de la gracia, pero tampoco la desprecies quedándote tirado. Levántate, sacúdete el polvo y sigue caminando.'
        ],
        applicationSteps: [
            'Confiesa tu falla a Dios inmediatamente, no esperes.',
            'No te castigues a ti mismo; Jesús ya llevó el castigo.',
            'Haz una cosa pequeña y buena hoy para retomar el rumbo.'
        ],
        prayer: 'Señor, fallé. Me duele haberlo hecho. Pero no voy a permitir que la culpa me aleje de Ti. Me levanto en tu Nombre. Gracias por tu paciencia infinita. Amén.',
        author: 'Pastor J.'
    },
    {
        id: '6',
        title: 'Enojo: El fuego interno',
        category: 'Ira',
        time: '3 min',
        image: 'bg-danger-subtle',
        bibleVerse: 'Airaos, pero no pequéis; no se ponga el sol sobre vuestro enojo.',
        bibleReference: 'Efesios 4:26',
        content: [
            'El enojo es una emoción natural. Incluso Jesús se enojó. El problema no es sentir fuego, sino quemar la casa (o a las personas) con él.',
            'La Biblia nos da un límite de tiempo: "que no se ponga el sol". El enojo guardado se pudre y se convierte en amargura y resentimiento.',
            'Dios nos invita a llevarle nuestra frustración antes de explotar con otros. Él es el mejor "saco de boxeo" para desahogarte con honestidad; Él no se ofende, Él sana.'
        ],
        applicationSteps: [
            'Si estás muy enojado, aléjate de la situación por 10 minutos.',
            'Escribe una "carta de enojo" sin enviarla, solo para sacar lo que sientes.',
            'Pide al Espíritu Santo dominio propio antes de responder.'
        ],
        prayer: 'Espíritu Santo, apaga este fuego descontrolado en mí. Dame palabras sabias y no hirientes. Quiero ser manso como Jesús, no explosivo. Amén.',
        author: 'Miriam G.'
    },
    {
        id: '7',
        title: 'La trampa de la comparación',
        category: 'Envidia',
        time: '5 min',
        image: 'bg-success-subtle',
        bibleVerse: 'Te alabaré; porque formidables, maravillosas son tus obras.',
        bibleReference: 'Salmos 139:14',
        content: [
            'Scroll en Instagram -> "Mira su cuerpo", "Mira su viaje", "Mira su relación". La comparación es el ladrón de la alegría.',
            'Cuando te comparas, insultas al Artista que te creó. Es como decirle a Dios: "Te equivocaste conmigo, debiste hacerme como aquella persona".',
            'Eres una obra maestra única ("formidable"). Dios no hace copias en serie. Él tiene un camino y un propósito diseñado exclusivamente para tu ADN y tu historia.'
        ],
        applicationSteps: [
            'Identifica qué perfil o persona dispara tu envidia y siléncialo por un tiempo.',
            'Haz una lista de 5 cosas que te gustan de ti mismo (físicas o de carácter).',
            'Agradece a Dios por el éxito de otros; eso rompe la envidia.'
        ],
        prayer: 'Creador mío, gracias por hacerme como soy. Renuncio a desear la vida de otros. Enséñame a amar mi diseño y mi camino. Soy tu obra maravillosa. Amén.',
        author: 'Equipo Conecta+'
    },
    {
        id: '8',
        title: 'Esperanza para el futuro',
        category: 'Fe',
        time: '4 min',
        image: 'bg-primary-subtle',
        bibleVerse: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal.',
        bibleReference: 'Jeremías 29:11',
        content: [
            'Es fácil ver el futuro con miedo: "¿Qué voy a estudiar?", "¿Me quedaré solo?", "¿El mundo se va a acabar?". La incertidumbre paraliza.',
            'Dios le dijo esto a su pueblo cuando estaban prisioneros en Babilonia. En su peor momento, Dios les habló de futuro.',
            'Tu futuro no depende de la economía, ni de la política, ni de tu suerte. Depende de los planes de Dios. Y sus planes son de BIEN. El final de tu historia es bueno porque Dios es el autor.'
        ],
        applicationSteps: [
            'Haz un "tablero de visión" o lista de sueños con Dios.',
            'Cuando venga un pensamiento de miedo al futuro, di: "Dios ya está allí".',
            'Lee Jeremías 29:11 en voz alta.'
        ],
        prayer: 'Señor del tiempo, mi futuro está en tus manos y es el lugar más seguro. Decido confiar en que tienes cosas buenas preparadas para mí. Descanso en Ti. Amén.',
        author: 'Pastor Andrés'
    },
    {
        id: '9',
        title: 'Orar es simplemente hablar',
        category: 'Oración',
        time: '3 min',
        image: 'bg-info-subtle',
        bibleVerse: 'Clama a mí, y yo te responderé.',
        bibleReference: 'Jeremías 33:3',
        content: [
            'A veces complicamos la oración. Creemos que necesitamos palabras elegantes, voz de locutor o una hora libre. Pero orar es simplemente hablar con tu Papá.',
            'Un "¡Ayúdame!" es una oración poderosa. Un "No entiendo nada" es una oración válida. Dios prefiere un corazón sincero balbuceando que una mente distraída recitando poemas.',
            'La invitación es simple: Clama. Haz ruido. Llámalo. Él promete responder, no ignorar. La línea directa al cielo siempre está abierta y sin espera.'
        ],
        applicationSteps: [
            'Habla con Dios mientras te duchas o caminas, sin formalidades.',
            'Prueba orar solo 2 minutos hoy, pero siendo 100% honesto.',
            'No termines el día sin decirle "Buenas noches" a tu Padre.'
        ],
        prayer: 'Papá, aquí estoy. Sin palabras bonitas, pero con un corazón que te necesita. Enséñame a charlar contigo como mi mejor amigo. Gracias por escucharme siempre. Amén.',
        author: 'Sara M.'
    },
    {
        id: '10',
        title: 'No fuiste creado para estar solo',
        category: 'Comunidad',
        time: '4 min',
        image: 'bg-warning-subtle',
        bibleVerse: 'Mejores son dos que uno... porque si cayeren, el uno levantará a su compañero.',
        bibleReference: 'Eclesiastés 4:9-10',
        content: [
            'El cristianismo no es un deporte individual. "Lobo solitario" es una presa fácil. Necesitamos la manada, la iglesia, la comunidad.',
            'Tener amigos cristianos no significa que sean perfectos, significa que van en la misma dirección. Cuando tú tropiezas, ellos te ayudan a no quedarte tirado.',
            'Es riesgoso abrirse a otros, sí. Te pueden herir, sí. Pero el aislamiento es mucho más peligroso. Busca a alguien con quien puedas ser real, orar y reír.'
        ],
        applicationSteps: [
            'Invita a un café a alguien de tu grupo de jóvenes.',
            'Únete a un grupo pequeño o de conexión en tu iglesia.',
            'Sé tú el amigo que levanta a otros; envía un mensaje de ánimo hoy.'
        ],
        prayer: 'Jesús, gracias por mi familia en la fe. Ayúdame a encontrar amigos verdaderos y a ser un buen amigo. Rompe mi aislamiento y conéctame con tu cuerpo. Amén.',
        author: 'Equipo Conecta+'
    },
];
