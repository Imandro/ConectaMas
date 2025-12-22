
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const strugglePlans = [
    {
        title: "Pornografía / Contenido Sexual",
        description: "Plan: Pureza Radical. Una hoja de ruta táctica para retomar el control de tu vida con el poder de Dios.",
        days: [
            {
                dayNumber: 1,
                title: "¿Amor real o píxeles muertos?",
                bibleStudy: "Tu cuerpo no es una 'terminal de placer' barata, es el cuartel general del Espíritu Santo. La porno te engaña: te da un subidón de dopamina falso que te deja vacío y resetea tu cerebro para buscar basura. Dios diseñó la sexualidad para conectar, no para consumir en la sombra. ¡Eres un hijo de Dios, no un esclavo de una pantalla!",
                practicalExercise: "Inventario de Disparadores. Escribe en qué momentos o emociones sientes la tentación. Bloquea inmediatamente las cuentas o apps que te hagan patinar.",
                youthAdvice: "No intentes ser un héroe aguantando la mirada. ¡Huye! El autocontrol empieza quitando la tentación de la mano.",
                reflectionQuestions: "¿Qué vacío estoy intentando anestesiar con esto? ¿A qué le tengo miedo si dejo de esconderme?",
                scripture: "1 Corintios 6:19-20"
            },
            {
                dayNumber: 2,
                title: "El Pacto con tus Ojos",
                bibleStudy: "Job hizo un contrato con sus ojos. No es que no veas a nadie, es que aprendas a no 'escanear'. Jesús fue directo: el pecado empieza en el pensamiento. Si quieres limpiar tu racha, tienes que cambiar el algoritmo de tu mente con la Palabra. La pureza no es ausencia de tentación, sino presencia de propósito.",
                practicalExercise: "Ayuno Digital de 12 horas. Deja el mundo virtual. Sal a caminar o haz ejercicio. Recupera tu capacidad de estar presente.",
                youthAdvice: "La primera mirada es un accidente, la segunda es una elección. ¡Entrena tu vista para ver tesoros, no mercancía!",
                reflectionQuestions: "¿Qué pensamientos estoy dejando entrar a mi 'disco duro' hoy?",
                scripture: "Mateo 5:27-30"
            },
            {
                dayNumber: 3,
                title: "Guerra de Trincheras: Rendición de Cuentas",
                bibleStudy: "La pureza en secreto es frágil. Dios nos diseñó para vivir en comunidad. Confesar tus luchas no es para que te juzguen, sino para que la luz entre y el enemigo no tenga donde esconderse. La vergüenza muere cuando la sacas a la luz.",
                practicalExercise: "Habla con alguien. Busca a tu líder o mentor y cuéntale: 'Estoy trabajando en esto, ayúdame'.",
                youthAdvice: "Tener un socio de batalla no es de débiles, es de tácticos inteligentes. Nadie gana una guerra solo.",
                reflectionQuestions: "¿Por qué me da tanto miedo que alguien sepa mi lucha? ¿A quién le confío mi vida?",
                scripture: "Santiago 5:16"
            },
            {
                dayNumber: 4,
                title: "Hackeando la Raíz: Emociones",
                bibleStudy: "Caemos cuando estamos C.A.S.O. (Cansados, Ansiosos, Solos o Ofendidos). La porno suele ser una automedicación para una herida emocional. Si no sanas la raíz, seguirás cortando las hojas pero el árbol volverá a crecer.",
                practicalExercise: "Diario de emociones. Hoy, cada vez que sientas ganas de caer, detente y escribe qué sientes exactamente. ¿Es hambre de Dios o hambre de escape?",
                youthAdvice: "No castigues tu cuerpo, sana tu corazón. Aprende a llorar ante Dios antes de querer huir hacia la dopamina.",
                reflectionQuestions: "¿Qué me duele realmente hoy? ¿Estoy usando la porno para silenciar a Dios?",
                scripture: "Salmo 147:3"
            },
            {
                dayNumber: 5,
                title: "Redimiendo la Belleza",
                bibleStudy: "La belleza fue creada por Dios. La perversión es tomar algo hermoso y torcerlo para un uso egoísta. Aprender a ver la belleza sin querer poseerla es el máximo nivel de madurez espiritual. Es honrar la obra del Artista sin robarte el cuadro.",
                practicalExercise: "Ejercicio de Honor. Mira a las personas hoy como hermanos o hermanas, con sueños y dolores, no como cuerpos. Ora por 3 personas que veas hoy (en silencio).",
                youthAdvice: "Si admiras la belleza de alguien, dale gracias a Dios por Su creatividad, y sigue caminando. No te quedes pegado.",
                reflectionQuestions: "¿Puedo ver lo hermoso sin desear poseerlo egoístamente?",
                scripture: "Génesis 1:27"
            },
            {
                dayNumber: 6,
                title: "Fuerza en la Debilidad",
                bibleStudy: "Muchos se rinden porque 'ya fallaron'. La gracia de Dios es más grande que tu peor caída. No es una licencia para pecar, es el combustible para levantarse. Si el enemigo te mantiene en el suelo con culpa, ya ganó. ¡Levántate!",
                practicalExercise: "Oración de Autoridad. Hoy, ora en voz alta declarando que eres libre por la sangre de Cristo. No ruegues, ¡declara tu identidad!",
                youthAdvice: "La culpa te aleja de Dios, el arrepentimiento te acerca. Si fallas, corre HACIA Dios, no LEJOS de Él.",
                reflectionQuestions: "¿Creo que Dios aún me ama después de mis errores?",
                scripture: "Miqueas 7:8"
            },
            {
                dayNumber: 7,
                title: "Viviendo en la Luz",
                bibleStudy: "Llegaste al día 7, pero esto no termina aquí. La libertad es un estilo de vida, no un destino. Mantente alerta y sigue avivando tu fuego. Eres un guerrero de la luz y tu testimonio será la llave para liberar a otros.",
                practicalExercise: "Plan de Mantenimiento. Escribe 3 reglas innegociables para tu vida digital de ahora en adelante.",
                youthAdvice: "¡Felicidades, guerrero! Has demostrado que con Dios se puede. No bajes la guardia, ¡sigue brillando!",
                reflectionQuestions: "¿Cómo voy a usar mi libertad para servir a otros?",
                scripture: "Gálatas 5:1"
            }
        ]
    },
    {
        title: "Mentira",
        description: "Plan: Transparencia Total. Destruyendo la máscara para vivir en la libertad de la verdad.",
        days: [
            {
                dayNumber: 1,
                title: "¿Quién eres cuando nadie ve?",
                bibleStudy: "La mentira no es solo decir algo falso; es intentar crear una realidad donde Dios no está. Cuando mientes, estás diciendo que tu 'reputación' es más importante que la verdad de Dios. La integridad es ser el mismo en TikTok que en tu cuarto a solas. ¡Rompe la máscara!",
                practicalExercise: "Inventario de Humo. Escribe 3 mentiras 'pequeñas' o exageraciones que hayas dicho esta semana. Confiésaselas a Dios y pide perdón.",
                youthAdvice: "La verdad te hace libre, pero al principio te hace sudar. No temas quedar mal; teme vivir una mentira.",
                reflectionQuestions: "¿A quién intento impresionar con mis mentiras? ¿Qué pasaría si hoy fuera 100% real?",
                scripture: "Juan 8:31-32"
            },
            {
                dayNumber: 2,
                title: "El Costo de la Pantalla",
                bibleStudy: "Mentimos para protegernos o para proyectar. Pero cada mentira es un ladrillo en una pared que te separa de los demás y de Dios. La transparencia es la única forma de tener conexiones reales. Si la gente te ama por quien pretendes ser, no te están amando a ti.",
                practicalExercise: "Día de Cero Exageraciones. Hoy, si vas a contar una historia, cuéntala EXACTAMENTE como pasó. Sin adornos para parecer más cool.",
                youthAdvice: "Ser vulnerable es el hack más grande para tener amigos de verdad. Deja de filtrar tu vida.",
                reflectionQuestions: "¿Por qué me da miedo mostrar mi verdadero yo?",
                scripture: "Efesios 4:25"
            },
            {
                dayNumber: 3,
                title: "Matando la Palabra Vacía",
                bibleStudy: "Tus palabras tienen poder. Cada vez que rompes una promesa o dices algo que no vas a hacer, tu palabra pierde valor. Que tu 'sí' sea 'sí'. La integridad se construye en los detalles pequeños que nadie nota.",
                practicalExercise: "Cumple una promesa pendiente. ¿Le debes algo a alguien? ¿Dijiste que harías algo y lo olvidaste? Hazlo hoy.",
                youthAdvice: "Tu palabra es tu firma. Si la gente no puede confiar en lo que dices, no importa cuán talentoso seas.",
                reflectionQuestions: "¿Soy una persona de palabra?",
                scripture: "Mateo 5:37"
            },
            {
                dayNumber: 4,
                title: "El Filtro de la Verdad",
                bibleStudy: "A veces mentimos para evitar conflictos. Pero la Biblia dice que hablemos la verdad con amor. Evitar la verdad para no pelear es una forma de cobardía que daña las relaciones a largo plazo.",
                practicalExercise: "Conversación Valiente. Habla con esa persona con la que has estado evitando ser honesto. Sin gritos, solo con la verdad.",
                youthAdvice: "Una verdad difícil hoy te ahorra un desastre mañana. Sé valiente.",
                reflectionQuestions: "¿A qué conflicto le tengo tanto miedo que prefiero mentir?",
                scripture: "Efesios 4:15"
            },
            {
                dayNumber: 5,
                title: "Perdón y Limpieza",
                bibleStudy: "Si has vivido en una red de mentiras, salir se siente como desatar un nudo gigante. El primer paso es el arrepentimiento genuino. Dios no quiere castigarte, quiere limpiarte para que puedas caminar ligero.",
                practicalExercise: "Escribe una carta de confesión (aunque no la envíes) a alguien a quien le hayas mentido. Siente el peso de la honestidad.",
                youthAdvice: "No puedes avanzar si arrastras el peso de las verdades que escondes. Suéltalo hoy.",
                reflectionQuestions: "¿Hay alguna mentira grande que me esté robando la paz?",
                scripture: "1 Juan 1:9"
            },
            {
                dayNumber: 6,
                title: "Cimentando la Integridad",
                bibleStudy: "La integridad no es perfección, es dirección. Es decidir que de ahora en adelante, la verdad es tu norte. Incluso cuando te duela, incluso cuando te haga perder algo. Lo que ganas en paz interior vale más que cualquier beneficio de una mentira.",
                practicalExercise: "Establece un 'Socio de Verdad'. Cuéntale a un amigo que quieres ser 100% honesto y pídele que te cuestione si nota que estás exagerando.",
                youthAdvice: "La gente respeta a alguien que admite sus errores antes que a alguien que nunca los tiene.",
                reflectionQuestions: "¿Estoy dispuesto a perder algo por decir la verdad?",
                scripture: "Proverbios 10:9"
            },
            {
                dayNumber: 7,
                title: "Libre de Máscaras",
                bibleStudy: "¡Felicidades! Vivir en la verdad es el nivel más alto de libertad. Ya no tienes que recordar qué mentira le dijiste a quién. Eres tú, amado por Dios y transparente ante el mundo. ¡Sigue caminando en la luz!",
                practicalExercise: "Celebra tu libertad. Comparte un testimonio corto (sin dar detalles vergonzosos si no quieres) sobre cómo la verdad te ha dado paz.",
                youthAdvice: "Nunca vuelvas a la prisión de la apariencia. ¡Tu versión real es suficiente para Dios!",
                reflectionQuestions: "¿Cómo puedo cultivar una cultura de verdad en mi círculo?",
                scripture: "Salmo 51:6"
            }
        ]
    },
    {
        title: "Enojo / Ira",
        description: "Plan: Fuego Bajo Control. Domando la explosión interna para reflejar la paz de Cristo.",
        days: [
            {
                dayNumber: 1,
                title: "¿Qué encendió la mecha?",
                bibleStudy: "El enojo es una emoción secundaria. Casi siempre es el humo de un fuego que arde más profundo: miedo, herida o frustración. Santiago nos dice que seamos lentos para la ira porque la ira humana no hace lo que Dios espera. ¡Detente y escanea tu corazón!",
                practicalExercise: "La Regla de los 30 segundos. Cuando sientas el calor, cállate y cuenta hasta 30. Pregúntate: '¿Por qué me dolió esto realmente?'.",
                youthAdvice: "Ser explosivo no es tener carácter, es ser un esclavo de tus impulsos. El verdadero Pro se domina a sí mismo.",
                reflectionQuestions: "¿Qué situaciones activan mi modo 'Hulk'? ¿A qué le tengo miedo en esos momentos?",
                scripture: "Santiago 1:19-20"
            },
            {
                dayNumber: 2,
                title: "El Sol y la Amargura",
                bibleStudy: "Efesios dice: 'No se ponga el sol sobre vuestro enojo'. Guardar el enojo es como beber veneno y esperar que el otro se muera. Si no lo manejas hoy, mañana será amargura. Y la amargura es una raíz que contamina todo tu jardín espiritual.",
                practicalExercise: "Check-out nocturno. Antes de dormir, visualiza a quién te hizo enojar hoy y dile a Dios: 'Lo suelto, no le debo nada'.",
                youthAdvice: "No duermas con el enemigo (el enojo). Despójate de eso antes de cerrar los ojos.",
                reflectionQuestions: "¿Tengo alguna cuenta pendiente de ayer?",
                scripture: "Efesios 4:26-27"
            },
            {
                dayNumber: 3,
                title: "Palabras que Incendian o Sanan",
                bibleStudy: "La respuesta blanda quita la ira. Tu boca puede ser un extintor de incendios o un galón de gasolina. La mayoría de las peleas se ganan bajando el volumen, no gritando más fuerte. El poder de la mansedumbre es superior al de la violencia.",
                practicalExercise: "Filtro de Voz. Hoy, si alguien te contesta mal, responde con amabilidad (aunque te cueste). Observa la reacción del otro.",
                youthAdvice: "Hablar bajito cuando el otro grita es un superpoder. Te da el control absoluto de la situación.",
                reflectionQuestions: "¿Uso mis palabras para construir o para demoler?",
                scripture: "Proverbios 15:1"
            },
            {
                dayNumber: 4,
                title: "El Control vs. La Soberanía",
                bibleStudy: "Explotamos cuando las cosas no salen como queremos. La ira es un intento desesperado por forzar nuestra voluntad sobre la realidad. Aprender que Dios es soberano y que Él tiene el control te quita el peso de tener que pelear por todo.",
                practicalExercise: "Oración de Entrega. Haz una lista de cosas que te frustran porque no puedes cambiar. Diles: 'Dios está en control de esto, yo no'.",
                youthAdvice: "Si no puedes cambiar la situación, cambia tu actitud. El drama es opcional.",
                reflectionQuestions: "¿Por qué necesito que todo salga a mi manera?",
                scripture: "Salmo 37:8"
            },
            {
                dayNumber: 5,
                title: "Perdón: La Llave de la Jaula",
                bibleStudy: "Mucho enojo es en realidad falta de perdón. El perdón no es decir que lo que te hicieron estuvo bien; es soltar el derecho de cobrar la deuda. Dios te perdonó una deuda impagable, ¿quién eres tú para no soltar una pequeña?",
                practicalExercise: "Carta de Soltar. Escribe lo que te hicieron y luego escribe encima en letras grandes: 'CANCELADO'. Luego rómpela.",
                youthAdvice: "Perdonar es dejar ir a un prisionero y descubrir que el prisionero eras tú.",
                reflectionQuestions: "¿A quién sigo culpando de mi infelicidad?",
                scripture: "Mateo 18:21-22"
            },
            {
                dayNumber: 6,
                title: "Cultivando el Dominio Propio",
                bibleStudy: "El fruto del Espíritu incluye el dominio propio. No es algo que sacas de ti, es algo que el Espíritu Santo siembra en ti. Cuando estés por explotar, no luches con tus fuerzas, susurra: 'Espíritu Santo, dame Tu paz'.",
                practicalExercise: "Misión Paz. Busca un ambiente tenso hoy y sé el que lleva la calma. No te enganches en el conflicto.",
                youthAdvice: "El dominio propio es como un músculo. Cuanto más lo usas, más fuerte se hace. ¡Entrénalo hoy!",
                reflectionQuestions: "¿Le doy espacio al Espíritu Santo para que actúe en mi crisis?",
                scripture: "Gálatas 5:22-23"
            },
            {
                dayNumber: 7,
                title: "Guerrero de la Calma",
                bibleStudy: "¡Meta alcanzada! Ahora tienes herramientas para que el fuego no te consuma. Ser un pacificador es ser llamado hijo de Dios. Mantén esa calma, no dejes que nada te robe la paz que Cristo te dio. ¡Eres un embajador de Su paz!",
                practicalExercise: "Plan de Emergencia. Escribe 3 pasos a seguir la próxima vez que te sientas 'hirviendo'.",
                youthAdvice: "¡Felicidades! Has domado al león. Sigue caminando en libertad y con la cabeza fría.",
                reflectionQuestions: "¿Cómo puedo ser un agente de paz en mi familia?",
                scripture: "Mateo 5:9"
            }
        ]
    },
    {
        title: "Orgullo",
        description: "Plan: Corazón Humilde. Desinflado el ego para que la grandeza de Dios brille en ti.",
        days: [
            {
                dayNumber: 1,
                title: "El Síndrome del Espejo",
                bibleStudy: "El orgullo es la raíz de todos los pecados. Es ponerte en el centro donde debería estar Dios. El problema no es pensar que eres bueno, es pensar que eres mejor que los demás o que no necesitas a nadie. La verdadera humildad no es pensar menos de ti, sino pensar menos EN ti.",
                practicalExercise: "Misión Secundaria. Hoy, busca hacer algo bueno por alguien y NO se lo cuentes a nadie. Cero stories, cero menciones.",
                youthAdvice: "Si necesitas que todos vean lo que haces, no lo estás haciendo por Dios, lo haces por tu ego. ¡Bájale un cambio!",
                reflectionQuestions: "¿Necesito atención constante para sentirme valioso?",
                scripture: "Proverbios 16:18"
            },
            {
                dayNumber: 2,
                title: "El Grande que se hizo Pequeño",
                bibleStudy: "Mira a Jesús. Siendo Dios, se hizo servidor. Lavó los pies de sus amigos. La grandeza en el Reino de Dios se mide por cuánto sirves, no por cuántos te siguen. El orgullo te aísla, la humildad te conecta.",
                practicalExercise: "Servicio sorpresa. Limpia algo en tu casa que no te toca a ti, o ayuda a alguien en el cole que nadie ayuda. Sé un servidor hoy.",
                youthAdvice: "El nivel de tu éxito espiritual se mide por el tamaño de tu toalla para servir, no por tu corona.",
                reflectionQuestions: "¿A quién me cuesta más servir? ¿Por qué?",
                scripture: "Filipenses 2:3-5"
            },
            {
                dayNumber: 3,
                title: "Corrigiendo el Algoritmo",
                bibleStudy: "Al orgulloso le cuesta recibir consejos. Si te ofendes cuando alguien te corrige, tu orgullo es el que está hablando. La sabiduría entra cuando la defensa baja. Aprende a ser un estudiante de la vida, no un sabelotodo.",
                practicalExercise: "Pide Feedback. Pregúntale a alguien de confianza: '¿En qué crees que puedo mejorar?'. Escucha sin defenderte.",
                youthAdvice: "Si eres el más inteligente de la sala, estás en la sala equivocada. Abre tu mente.",
                reflectionQuestions: "¿Soy enseñable?",
                scripture: "Proverbios 12:15"
            },
            {
                dayNumber: 4,
                title: "Gratitud vs. Mérito",
                bibleStudy: "El orgullo dice: 'Yo lo logré'. La gratitud dice: 'Dios me lo dio'. Todo lo que tienes, desde tu talento hasta el aire que respiras, es un regalo. Cuando reconoces esto, el orgullo se desinfla porque no tienes nada que no hayas recibido.",
                practicalExercise: "Lista de Créditos. Escribe 5 cosas en las que eres bueno y luego escribe al lado quién te ayudó y por qué le debes gracias a Dios por eso.",
                youthAdvice: "Caminar por la vida creyendo que te 'deben' todo es la receta para la amargura. La gratitud es la clave.",
                reflectionQuestions: "¿A quién me he olvidado de darle las gracias?",
                scripture: "1 Corintios 4:7"
            },
            {
                dayNumber: 5,
                title: "La Trampa de la Comparación",
                bibleStudy: "El orgullo se alimenta de compararse. O te sientes superior y te vuelves arrogante, o te sientes inferior y te vuelves envidioso. Ambas son formas de orgullo. Humildad es aceptar tu lugar único en el plan de Dios sin mirar el plato del vecino.",
                practicalExercise: "Elogio Real. Busca a alguien que haga algo mejor que tú y dile: '¡Qué buen trabajo haces! Te admiro por esto'. Rompe la barrera de la competencia.",
                youthAdvice: "Tu carrera es contigo mismo y con Dios. No pierdas tiempo mirando el carril de al lado.",
                reflectionQuestions: "¿Me alegro genuinamente cuando a otros les va mejor que a mí?",
                scripture: "Gálatas 6:4"
            },
            {
                dayNumber: 6,
                title: "Dependencia Radical",
                bibleStudy: "Jesús dijo: 'Separados de mí, nada podéis hacer'. El orgullo dice 'puedo solo'. La madurez espiritual es darte cuenta de que cada segundo necesitas a Dios. La oración es el mayor acto de humildad porque admite: 'Te necesito, Señor'.",
                practicalExercise: "Día de Consulta. Hoy, antes de cada decisión importante (o pequeña), susurra: 'Señor, ¿qué opinas Tú de esto?'.",
                youthAdvice: "Consultar a Dios no es de inseguros, es de sabios que no quieren chocar el auto.",
                reflectionQuestions: "¿Intento arreglar todo yo solo antes de orar?",
                scripture: "Juan 15:5"
            },
            {
                dayNumber: 7,
                title: "Pequeño para ser Grande",
                bibleStudy: "¡Llegaste! La humildad no te hace menos persona, te hace más como Cristo. Ahora Dios puede usarte de verdad porque no le robas la gloria. Mantente así, caminando bajo Su sombra y verás cómo Él te exalta a Su tiempo. ¡Sigue siendo un servidor!",
                practicalExercise: "Plan de Bajada. Elige una tarea 'humilde' en tu iglesia o comunidad y ofrécete a hacerla regularmente.",
                youthAdvice: "Felicidades. Has vencido al gigante del Ego. ¡Ahora Dios puede hacer cosas gigantes a través de ti!",
                reflectionQuestions: "¿Cómo puedo mantener el corazón en el suelo mientras Dios me lleva a las alturas?",
                scripture: "Santiago 4:10"
            }
        ]
    },
    {
        title: "Envidia",
        description: "Plan: Gratitud Pro. Dejando de mirar el jardín del vecino para cultivar el propio con Dios.",
        days: [
            {
                dayNumber: 1,
                title: "El Veneno de los Ojos",
                bibleStudy: "La envidia no es querer lo que el otro tiene, es desear que el otro NO lo tenga. Es un veneno que corroe tus huesos. Nace de creer que Dios se quedó sin bendiciones para ti y tuvo que dárselas a alguien más. ¡Alerta de mentira!",
                practicalExercise: "Misión Anti-Veneno. Busca la cuenta de alguien que te de envidia y escribe un comentario positivo real en su post. Bendice lo que antes maldecías en tu mente.",
                youthAdvice: "La envidia es como un software que te nubla la vista. ¡Desinstálalo hoy!",
                reflectionQuestions: "¿A quién siento que Dios le dio 'demasiado'?",
                scripture: "Proverbios 14:30"
            },
            {
                dayNumber: 2,
                title: "El Dios de la Abundancia",
                bibleStudy: "Dios no tiene favoritos, tiene hijos únicos. Que a otro le vaya bien no significa que a ti te vaya a ir mal. El Reino de Dios no es un pastel que se acaba; es un océano infinito. Hay suficiente gracia, talento y amor para todos.",
                practicalExercise: "Visualización de Favor. Haz una lista de 3 promesas de Dios para TU vida. Enfócate en lo que Él ya te dio.",
                youthAdvice: "Deja de mirar el plato de los demás. En la mesa de Dios siempre hay buffet libre para todos.",
                reflectionQuestions: "¿Confío en que Dios tiene un plan específico para MÍ?",
                scripture: "Salmo 23:1"
            },
            {
                dayNumber: 3,
                title: "Instagram vs. Realidad",
                bibleStudy: "Comparamos nuestro 'detrás de cámaras' con el 'tráiler' de los demás. La envidia digital es real. Vemos una foto y creemos que su vida es perfecta. Pero todos luchamos. Nadie tiene una vida sin problemas, aunque usen 20 filtros.",
                practicalExercise: "Detox de Comparación. Hoy no entres a redes sociales. Quédate con tu realidad y con Dios. Agradece por tu vida 'sin filtros'.",
                youthAdvice: "Las redes sociales son el caldo de cultivo de la envidia. Si te hace daño, apaga el wifi.",
                reflectionQuestions: "¿Qué estoy ocultando yo detrás de mis posts?",
                scripture: "Gálatas 6:4"
            },
            {
                dayNumber: 4,
                title: "El Éxito del Hermano",
                bibleStudy: "La Biblia nos manda a 'gozarnos con los que se gozan'. Esto es nivel avanzado. Alegrarte por el éxito de otro sin sentir que te quitaron algo es la marca de un corazón sano. Si te duele el éxito de tu amigo, tu identidad está en el lugar equivocado.",
                practicalExercise: "Llamada de Felicitación. Llama o escribe a alguien que haya logrado algo grande y dile genuinamente: '¡Qué alegría por ti! Te lo mereces'.",
                youthAdvice: "Celebrar a otros te hace una persona magnética. La envidia te hace alguien amargado.",
                reflectionQuestions: "¿Puedo celebrar sin poner peros?",
                scripture: "Romanos 12:15"
            },
            {
                dayNumber: 5,
                title: "Contentamiento: El Gran Hack",
                bibleStudy: "El contentamiento no es conformismo, es estar satisfecho en Dios independientemente de lo que tengas. Pablo decía que aprendió a estar contento tanto en la abundancia como en la escasez. Si no eres feliz con lo que tienes hoy, no serás feliz con lo que sueñas tener mañana.",
                practicalExercise: "Caminata de Gracias. Camina por 10 minutos y solo di gracias por cosas que ya tienes (comida, familia, aire, salud, Cristo).",
                youthAdvice: "La felicidad no llega cuando tienes lo que quieres, sino cuando agradeces lo que tienes.",
                reflectionQuestions: "¿Soy feliz hoy, así como estoy?",
                scripture: "Filipenses 4:11-12"
            },
            {
                dayNumber: 6,
                title: "Sembrando lo Tuyo",
                bibleStudy: "En lugar de perder energía mirando el campo de otro, empieza a regar el tuyo. Dios te dio talentos únicos. Si estás distraído con la envidia, tus propios dones se están marchitando. ¡Ponte a trabajar en lo que Dios te dio!",
                practicalExercise: "Día de Desarrollo. Dedica 1 hora hoy a mejorar un talento que Dios te dio (leer, tocar, estudiar, ayudar). Enfócate en tu propio crecimiento.",
                youthAdvice: "El tiempo que pasas envidiando es tiempo que pierdes ganando. ¡Enfócate!",
                reflectionQuestions: "¿Qué talento he estado descuidando por mirar a los demás?",
                scripture: "Mateo 25:14-30"
            },
            {
                dayNumber: 7,
                title: "Corazón de Oro",
                bibleStudy: "¡Victoria! Has roto las cadenas de la comparación. Ahora puedes caminar libre, admirando a otros sin sentirte menos, y agradeciendo tu propio camino. Un corazón agradecido es un imán de bendiciones. ¡Sigue brillando con luz propia!",
                practicalExercise: "Plan de Gratitud Pro. Empieza un diario de gratitud donde escribas 3 cosas cada noche. Mantén el músculo de la gratitud fuerte.",
                youthAdvice: "¡Felicidades! Eres libre para ser tú mismo. ¡Eso es lo más valioso que tienes!",
                reflectionQuestions: "¿Cómo voy a proteger mi paz de la comparación de ahora en adelante?",
                scripture: "1 Timoteo 6:6"
            }
        ]
    },
    {
        title: "Depresión / Tristeza",
        description: "Plan: Luz en la Sombra. Caminando hacia la esperanza cuando todo parece oscuro.",
        days: [
            {
                dayNumber: 1,
                title: "Se vale estar mal, no se vale quedarse ahí",
                bibleStudy: "Incluso los gigantes de la fe como Elías o David tuvieron momentos de profunda tristeza y ganas de rendirse. Estar deprimido no te hace un 'mal cristiano'. Dios no se asusta de tu oscuridad. Él está cerca de los quebrantados de corazón. El primer paso para salir del pozo es admitir que estás en él y que necesitas Su mano.",
                practicalExercise: "Oración de Sinceridad. Hoy no intentes sonar perfecto. Dile a Dios exactamente cuán mal te sientes, cuánto te duele y que no tienes fuerzas. La honestidad abre la puerta a la sanidad.",
                youthAdvice: "No sientas culpa por estar triste. La fe no es una sonrisa falsa permanente, es confiar en Dios incluso cuando lloras. ¡Suéltalo todo con Él!",
                reflectionQuestions: "¿Qué mentiras me está susurrando la tristeza hoy? ¿Creo que Dios puede con mi dolor?",
                scripture: "Salmo 34:18"
            },
            {
                dayNumber: 2,
                title: "Combatiendo el Aislamiento",
                bibleStudy: "La depresión ama la soledad y el silencio. Quiere que te encierres y creas que a nadie le importas. Pero Dios nos creó para cargar las cargas los unos de los otros. El aislamiento es el campo donde el enemigo mejor siembra desesperanza. Romper el silencio es romper el poder de la tristeza.",
                practicalExercise: "Luz en el Teléfono. Envía un mensaje a un amigo de confianza o familiar hoy. No tienes que dar detalles si no quieres, solo di 'hola, te necesito hoy'. No te quedes a solas con tu mente.",
                youthAdvice: "Tu mente puede ser un lugar peligroso para estar a solas cuando estás mal. ¡Busca refuerzos! La gente te ama más de lo que crees.",
                reflectionQuestions: "¿Por qué me alejo de las personas que me quieren ayudar?",
                scripture: "Eclesiastés 4:9-10"
            },
            {
                dayNumber: 3,
                title: "Verdades contra Sentimientos",
                bibleStudy: "Tus sentimientos son reales, pero no siempre son la verdad. La depresión te dice que no hay futuro, que eres una carga, que nada cambiará. Dios dice que tiene planes de bien para ti, que eres Su tesoro y que Su gracia basta. Tienes que aprender a predicarle a tu alma con la Verdad.",
                practicalExercise: "Scripture Wall. Escribe 3 promesas de Dios sobre esperanza en post-its o en tu fondo de pantalla. Cada vez que venga un pensamiento oscuro, lee la promesa en voz alta.",
                youthAdvice: "No creas todo lo que sientes. Tus emociones son como el clima: cambian. La Palabra de Dios es la Roca que no se mueve.",
                reflectionQuestions: "¿A quién estoy escuchando más hoy: a mis miedos o a las promesas de Dios?",
                scripture: "Jeremías 29:11"
            },
            {
                dayNumber: 4,
                title: "Pequeñas Victorias",
                bibleStudy: "A veces la victoria no es conquistar el mundo, sino simplemente levantarse de la cama y bañarse. Dios valora cada paso. No te abrumes por el mañana, enfócate en lo que puedes hacer hoy con Su ayuda. Él da fuerzas al cansado y multiplica las del que no tiene ninguna.",
                practicalExercise: "Checklist de Vida. Haz 3 cosas hoy: 1. Tiende tu cama, 2. Toma 15 minutos de sol, 3. Agradece por una comida. Celebra estas victorias como un guerrero.",
                youthAdvice: "No te midas con el ritmo de los demás. Hoy tu victoria es seguir respirando y confiar en Jesús. ¡Eso es suficiente!",
                reflectionQuestions: "¿Qué pequeña cosa puedo hacer hoy para ver un rayito de luz?",
                scripture: "Isaías 40:29-31"
            },
            {
                dayNumber: 5,
                title: "El Poder de la Alabanza en el Pozo",
                bibleStudy: "Pablo y Silas cantaban en la cárcel a medianoche, con los pies encadenados. La alabanza no es porque te sientas bien, es porque Dios es BUENO siempre. La adoración cambia el ambiente de tu corazón y ahuyenta el espíritu de pesadez. Es una declaración de guerra contra la tristeza.",
                practicalExercise: "Concierto de Esperanza. Pon tu playlist de adoración más potente por 20 minutos. Aunque no tengas ganas, canta o simplemente deja que la música inunde tu cuarto. Alaba a Dios por Quién es Él.",
                youthAdvice: "La música cristiana no es aburrida, es medicina. Dale play a la esperanza y deja que las letras peleen por ti.",
                reflectionQuestions: "¿Puedo alabar a Dios en medio de mi dolor?",
                scripture: "Hechos 16:25-26"
            },
            {
                dayNumber: 6,
                title: "Propósito en el Dolor",
                bibleStudy: "Dios no desperdicia ninguna lágrima. Algún día, el consuelo que estás recibiendo hoy servirá para consolar a alguien más que pase por lo mismo. Tu dolor se convertirá en una plataforma de ayuda. Tienes un propósito, incluso en los días oscuros. El mundo te necesita entero.",
                practicalExercise: "Misión Semilla. Escribe una nota de ánimo rápida (física o digital) para alguien que sepas que también está luchando. Dar amor te ayuda a sanar tu propio vacío.",
                youthAdvice: "Tu historia no termina en la tristeza. Este es solo un capítulo difícil, pero el Autor tiene un final épico preparado.",
                reflectionQuestions: "¿Cómo podría mi lucha ayudar a otros en el futuro?",
                scripture: "2 Corintios 1:3-4"
            },
            {
                dayNumber: 7,
                title: "Caminando hacia el Amanecer",
                bibleStudy: "¡Llegaste al día 7! Esto es una maratón, no una carrera de 100 metros. Habrá días grises, pero ahora sabes que no estás solo y que tienes armas. Sigue buscando a Dios, sigue buscando ayuda profesional si es necesario y no dejes de creer. ¡La luz siempre vence a la oscuridad!",
                practicalExercise: "Compromiso de Vida. Prométele a Dios que seguirás luchando y que cada vez que la sombra vuelva, correrás a Su refugio.",
                youthAdvice: "¡Felicidades por tu valentía! Eres un sobreviviente y un guerrero. ¡Sigue brillando, la mañana está cerca!",
                reflectionQuestions: "¿Cuál es mi plan de emergencia para el próximo día gris?",
                scripture: "Salmo 30:5"
            }
        ]
    },
    {
        title: "Soledad",
        description: "Plan: Nunca Solo. Descubriendo la presencia constante de Dios y construyendo comunidad real.",
        days: [
            {
                dayNumber: 1,
                title: "Soledad vs. Apartamiento",
                bibleStudy: "Estar solo no es lo mismo que sentirse solo. Jesús a menudo se apartaba para estar a solas con el Padre. La diferencia es la Presencia. El vacío que sientes es una invitación de Dios a tener una intimidad que no podrías tener rodeado de gente. ¡Él quiere ser tu mejor Amigo!",
                practicalExercise: "Cita con el Rey. Pasa 20 minutos hoy en silencio con Dios. Sin pedir nada, solo diciéndole: 'Señor, gracias por estar aquí conmigo'. Disfruta Su compañía.",
                youthAdvice: "Aprende a disfrutar tu propia compañía. Si no te aguantas a ti mismo, ¿por qué otros lo harían? Dios te ama, ¡empieza a amarte tú también!",
                reflectionQuestions: "¿A qué le tengo miedo del silencio y la soledad?",
                scripture: "Mateo 14:23"
            },
            {
                dayNumber: 2,
                title: "El Amigo que nunca falla",
                bibleStudy: "Los amigos fallan, se mudan o cambian. Pero hay un Amigo que es más unido que un hermano. Jesús prometió estar contigo todos los días, hasta el fin. No es una frase bonita, es una realidad espiritual. Nunca, repito, NUNCA estás solo en esa habitación.",
                practicalExercise: "Chat con el Cielo. Habla con Dios durante el día como si estuviera caminando al lado tuyo (porque lo está). Cuéntale tus chistes, tus dudas, lo que ves.",
                youthAdvice: "Dios es el único que te conoce 100% y te ama 100%. Esa es la amistad más segura que tendrás jamás.",
                reflectionQuestions: "¿Trato a Dios como a un Amigo real o como a un concepto lejano?",
                scripture: "Proverbios 18:24"
            },
            {
                dayNumber: 3,
                title: "El Espejismo de las Redes",
                bibleStudy: "Vemos a todos 'felices' en fotos y nos sentimos excluidos. Pero la conexión digital suele ser superficial y aumenta el sentimiento de soledad. La verdadera comunidad se construye cara a cara, con vulnerabilidad, no con likes. No te compares con una pantalla.",
                practicalExercise: "Fuera de Línea. Hoy, en lugar de scrollear por horas, llama a alguien o sal a un lugar donde haya gente (un parque, un café). Observa el mundo real.",
                youthAdvice: "Tener 1000 amigos en Facebook no quita la soledad. Tener 2 amigos de verdad sí. Calidad sobre cantidad.",
                reflectionQuestions: "¿Me siento más solo después de usar mi celular?",
                scripture: "Gálatas 6:2"
            },
            {
                dayNumber: 4,
                title: "Siendo el Amigo que necesitas",
                bibleStudy: "A veces nos sentimos solos porque esperamos que todos vengan a nosotros. Jesús dio el primer paso. Si quieres amigos, muéstrate amigo. La generosidad emocional mata la soledad. Cuando bendices a otros, el vacío en tu propio corazón empieza a llenarse.",
                practicalExercise: "Iniciativa Táctica. Busca a alguien que creas que también se siente solo y envíale un mensaje de ánimo o invítale un helado. Sé tú el que rompa el hielo.",
                youthAdvice: "Deja de esperar que te inviten. ¡Inicia tú el plan! La gente suele estar igual de asustada que tú de dar el primer paso.",
                reflectionQuestions: "¿Soy el tipo de amigo que a mí me gustaría tener?",
                scripture: "Lucas 6:38"
            },
            {
                dayNumber: 5,
                title: "El Desierto con Propósito",
                bibleStudy: "Dios permite temporadas de soledad para limpiar tus oídos y que escuches solo Su voz. Es un entrenamiento de élite. Grandes cosas nacen en la soledad con Dios (Moisés, Juan el Bautista, Pablo). No desperdicies tu soledad quejándote; úsala para crecer.",
                practicalExercise: "Estudio Profundo. Dedica una hora hoy a estudiar un tema de la Biblia que te apasione. Aprovecha el tiempo extra para conocer mejor el Reino.",
                youthAdvice: "Usa este tiempo para convertirte en la versión que Dios soñó de ti. ¡Cuando salgas del desierto, saldrás con poder!",
                reflectionQuestions: "¿Qué me está tratando de enseñar Dios en este silencio?",
                scripture: "Oseas 2:14"
            },
            {
                dayNumber: 6,
                title: "Perteneciendo al Cuerpo",
                bibleStudy: "No fuimos creados para ser islas. Eres parte de la Iglesia, el cuerpo de Cristo. Si te cortas un dedo, el dedo muere. Tienes que estar conectado. La soledad suele ser el resultado de estar desconectado del propósito colectivo de Dios.",
                practicalExercise: "Conexión con el Grupo. Si no vas a un grupo de jóvenes o iglesia, busca uno HOY. Si ya vas, involúcrate en un área de servicio. Trabajar con otros mata la soledad.",
                youthAdvice: "Busca tu tribu. Gente que hable tu idioma de fe. ¡Es imposible ser un cristiano solitario por mucho tiempo!",
                reflectionQuestions: "¿Estoy realmente conectado con mi comunidad espiritual?",
                scripture: "1 Corintios 12:27"
            },
            {
                dayNumber: 7,
                title: "Acompañado para Siempre",
                bibleStudy: "¡Felicidades! Has descubierto que el vacío tiene nombre y se llena con la Presencia. Ya no tienes que temer a estar solo, porque Dios es tu refugio. Camina con la seguridad de que el Creador del Universo es tu escolta personal. ¡Nunca más solo!",
                practicalExercise: "Promesa de Compañía. Escribe en un lugar visible: 'Él nunca me dejará'. Úsalo como escudo cada vez que el sentimiento de soledad intente volver.",
                youthAdvice: "¡Felicidades, guerrero! Has vencido al miedo al silencio. ¡Ahora ve y acompaña a otros en su camino!",
                reflectionQuestions: "¿Cómo voy a cultivar mi amistad con Dios hoy?",
                scripture: "Hebreos 13:5"
            }
        ]
    },
    {
        title: "Baja autoestima",
        description: "Plan: Identidad Real. Descubriendo quién eres según el Diseñador, no según las etiquetas del mundo.",
        days: [
            {
                dayNumber: 1,
                title: "El Error del Espejo",
                bibleStudy: "Nuestra autoestima suele basarse en lo que otros dicen, en cómo nos vemos o en lo que logramos. Todo eso es arena movediza. Dios dice que eres Su obra maestra, creado con un propósito infinito. No eres un accidente ni una 'falla técnica'. Eres un diseño de autor.",
                practicalExercise: "Declaración de Guerra. Mírate al espejo y, aunque no lo sientas, di: 'Soy creación de Dios, amado, valioso y con propósito'. Hazlo 3 veces hoy.",
                youthAdvice: "El espejo te muestra tu fachada, pero Dios ve tu gloria interna. Deja de compararte con estándares de gente que ni siquiera te conoce.",
                reflectionQuestions: "¿A quién le he dado el poder de definir cuánto valgo?",
                scripture: "Salmo 139:14"
            },
            {
                dayNumber: 2,
                title: "Hijo del Rey",
                bibleStudy: "Tu identidad no viene de tus errores del pasado ni de tus éxitos. Viene de tu relación con el Padre. Al recibir a Jesús, tienes ADN real. Eres un príncipe/princesa del Reino. Si supieras quién es tu Padre, caminarías con la cabeza mucho más alta.",
                practicalExercise: "Investigación de ADN. Busca 5 privilegios de ser hijo de Dios en la Biblia. Escríbelos como si fueran títulos de nobleza que te pertenecen.",
                youthAdvice: "No mendigues atención del mundo cuando tienes el amor total del Rey del Universo. ¡Valórate!",
                reflectionQuestions: "¿Actúo como un hijo de Dios o como un huérfano espiritual?",
                scripture: "Juan 1:12"
            },
            {
                dayNumber: 3,
                title: "Matando al Crítico Interno",
                bibleStudy: "Esa voz en tu cabeza que te dice 'no puedes', 'eres tonto', 'nadie te quiere', no es tuya y no es de Dios. Es el acusador. Tienes que llevar cautivo todo pensamiento y reemplazarlo con la Verdad. No dejes que el enemigo use tu propia voz contra ti.",
                practicalExercise: "Intercambio de Pensamientos. Cada vez que pienses algo malo de ti hoy, detente y di: 'Eso es mentira. Dios dice que... [añade versículo]'. Combate cada mentira con una verdad.",
                youthAdvice: "Si no le dirías eso a un amigo, ¿por qué te lo dices a ti mismo? ¡Sé más amable contigo!",
                reflectionQuestions: "¿Cuáles son las 3 mentiras más frecuentes que me digo?",
                scripture: "2 Corintios 10:5"
            },
            {
                dayNumber: 4,
                title: "Propósito sobre Perfección",
                bibleStudy: "Dios no busca gente perfecta, busca gente disponible. Moisés tartamudeaba, David falló, Pedro era impulsivo... y Dios los usó a todos. Tus debilidades son el escenario perfecto para que el poder de Dios se muestre. No necesitas ser perfecto para ser valioso.",
                practicalExercise: "Misión Debilidad. Escribe algo que no te guste de ti y dile a Dios: 'Señor, usa incluso esto para Tu gloria'. Entrega tus 'defectos' al Alfarero.",
                youthAdvice: "Tus cicatrices son parte de tu historia, no son manchas en tu currículum. Dios hace arte con nuestras grietas.",
                reflectionQuestions: "¿Qué parte de mí trato de esconder de Dios?",
                scripture: "2 Corintios 12:9"
            },
            {
                dayNumber: 5,
                title: "El ídolo de la Aprobación",
                bibleStudy: "Si vives para el aplauso de la gente, morirás por su rechazo. Buscar que todos te quieran es la receta para la infelicidad y la baja autoestima. Solo necesitas la aprobación de Uno, y Él ya te dio un 10 en la cruz. ¡Descansa en Su amor!",
                practicalExercise: "Día de Cero Likes. Haz algo hoy que te guste mucho pero NO lo subas a redes sociales. Disfruta de la aprobación de Dios en lo secreto.",
                youthAdvice: "No eres un producto para ser consumido y calificado por los demás. Eres un ser humano para ser amado por Dios.",
                reflectionQuestions: "¿Por qué necesito que todos me aprueben para sentirme bien?",
                scripture: "Gálatas 1:10"
            },
            {
                dayNumber: 6,
                title: "Sembrando en Otros",
                bibleStudy: "Una de las mejores formas de subir la autoestima es dejar de mirarse tanto el ombligo y empezar a servir. Cuando ayudas a alguien, te das cuenta de que tienes mucho para dar. El propósito activa el valor propio. Tienes un tesoro en tu interior, ¡compártelo!",
                practicalExercise: "Siembra de Valor. Busca a alguien que se vea decaído hoy y dile algo genuinamente bueno de él/ella. Da lo que te gustaría recibir.",
                youthAdvice: "Cuando te conviertes en una bendición para otros, te olvidas de tus propias inseguridades. ¡Muévete!",
                reflectionQuestions: "¿Cómo puedo usar mis dones para servir hoy?",
                scripture: "1 Pedro 4:10"
            },
            {
                dayNumber: 7,
                title: "Identidad Blindada",
                bibleStudy: "¡Felicidades! Has empezado a ver con los ojos de Dios. Tu valor es innegociable y eterno. No dejes que las críticas o los fracasos te lo quiten. Camina con la seguridad de quien se sabe amado por el Dueño de todo. ¡Eres un Tesoro del Cielo!",
                practicalExercise: "Carta de Identidad. Escríbete una carta a ti mismo desde la perspectiva de Dios (basada en la Biblia). Léela cada vez que te sientas mal.",
                youthAdvice: "¡Felicidades, guerrero/a! Has recuperado tu corona. ¡No dejes que nadie la mueva de su lugar!",
                reflectionQuestions: "¿Cómo voy a proteger mi identidad de las etiquetas del mundo?",
                scripture: "Efesios 2:10"
            }
        ]
    },
    {
        title: "Problemas familiares",
        description: "Plan: Hogar en Paz. Navegando los conflictos y siendo luz en el lugar más difícil: tu casa.",
        days: [
            {
                dayNumber: 1,
                title: "Tus Padres no son Dios",
                bibleStudy: "A veces esperamos que nuestros padres sean perfectos, y cuando fallan, nos resentimos. Pero ellos también son personas heridas y necesitadas de gracia. Honrar a tus padres no significa estar de acuerdo en todo, sino tratarlos con el respeto que Dios pide por su posición. La sanidad empieza con la realidad.",
                practicalExercise: "Escaneo de Empatía. Intenta pensar en la infancia de tus padres hoy. ¿Qué vivieron ellos que los hizo ser como son? Pide a Dios ojos de compasión.",
                youthAdvice: "Tus padres están aprendiendo a serlo al mismo tiempo que tú aprendes a vivir. ¡Dales un poco de aire!",
                reflectionQuestions: "¿Qué heridas del pasado de mis padres están afectando nuestra relación hoy?",
                scripture: "Efesios 6:1-3"
            },
            {
                dayNumber: 2,
                title: "El Poder de la Respuesta Blanda",
                bibleStudy: "En casa es donde más gritamos y menos escuchamos. Proverbios dice que la respuesta blanda quita la ira. Tienes el poder de detener un ciclo de gritos simplemente bajando tu volumen. La humildad en casa es el nivel máximo de madurez espiritual.",
                practicalExercise: "Extintor de Incendios. Hoy, si hay una discusión en casa, responde con calma o calla sabiamente. No eches gasolina al fuego.",
                youthAdvice: "No intentes ganar la discusión, intenta ganar la relación. El silencio inteligente vale más que mil gritos.",
                reflectionQuestions: "¿Soy yo el que suele encender la mecha en casa?",
                scripture: "Proverbios 15:1"
            },
            {
                dayNumber: 3,
                title: "Perdón en la Mesa",
                bibleStudy: "La familia puede herir muy profundo. Pero la falta de perdón te encadena a ese dolor. El perdón no es decir que estuvo bien lo que hicieron, es decidir que no vas a dejar que el rencor pudra tu futuro. Perdona para que TÚ seas libre.",
                practicalExercise: "Oración de Liberación. Ora específicamente por ese familiar que más te molesta o te hirió. Pide bendición para él/ella (sí, aunque te cueste).",
                youthAdvice: "El perdón es un músculo que se entrena más seguido en la sala de tu casa. ¡No dejes que la amargura se siente a cenar contigo!",
                reflectionQuestions: "¿A quién en mi familia necesito soltar hoy?",
                scripture: "Colosenses 3:13"
            },
            {
                dayNumber: 4,
                title: "Límites con Amor",
                bibleStudy: "Si vives en un ambiente tóxico o abusivo, honrar no significa dejarte destruir. Jesús se alejaba de quienes querían dañarlo. Poner límites claros y buscar ayuda si es necesario es sabio. Dios quiere que tu hogar sea un refugio, no una zona de guerra.",
                practicalExercise: "Comunicación Táctica. Si hay algo que te duele, busca un momento de calma y dilo con respeto: 'Me duele cuando pasa esto, quisiera que cambiara'. Sé claro y firme.",
                youthAdvice: "Honrar no es ser un tapete. Aprende a decir No con gracia y a alejarte del drama innecesario.",
                reflectionQuestions: "¿Qué límites necesito poner en mi casa para proteger mi paz mental?",
                scripture: "Mateo 10:16"
            },
            {
                dayNumber: 5,
                title: "Siendo el Manantial",
                bibleStudy: "A veces Dios te ha puesto en tu familia como el único que tiene Su luz. No esperes a que ellos cambien para tú ser cristiano. Sé el primero en servir, en abrazar, en pedir perdón. Tu testimonio silencioso habla más fuerte que mil sermones.",
                practicalExercise: "Acción de Gracia Inesperada. Haz algo bueno por ese familiar difícil hoy: lávale los platos, déjale una nota, dale un abrazo. Rompe el hielo con amor.",
                youthAdvice: "No seas el juez de tu familia, sé su servidor. El amor incondicional es lo único que realmente cambia a la gente.",
                reflectionQuestions: "¿Cómo puedo reflejar a Jesús en mi casa hoy?",
                scripture: "Mateo 5:16"
            },
            {
                dayNumber: 6,
                title: "Tu Familia Espiritual",
                bibleStudy: "Si tu casa es un lugar de mucho dolor, recuerda que tienes una familia más grande: el Cuerpo de Cristo. Dios nos dio hermanos y padres espirituales para llenar los vacíos. No te aísles en tu dolor familiar, busca refugio en tu comunidad de fe.",
                practicalExercise: "Busca un Mentor. Habla con un líder o adulto maduro de tu iglesia sobre tu situación familiar. No cargues esto solo.",
                youthAdvice: "La sangre te hace pariente, pero la fe te hace familia. ¡Apóyate en tus hermanos en Cristo!",
                reflectionQuestions: "¿Quién puede ser un apoyo para mí en este momento?",
                scripture: "Marcos 10:29-30"
            },
            {
                dayNumber: 7,
                title: "Embajador de Paz",
                bibleStudy: "¡Felicidades! Has dado pasos para sanar tu hogar. No será perfecto de la noche a la mañana, pero tú ya no eres el mismo. Sigue siendo el pacificador de tu casa. Dios restaurará lo que el enemigo quiso destruir. ¡Confía y descansa en Él!",
                practicalExercise: "Voto de Paz. Prométele a Dios que tu futura familia (si la tienes algún día) será diferente gracias a lo que estás aprendiendo hoy.",
                youthAdvice: "¡Felicidades, guerrero/a! Estás rompiendo ciclos generacionales. ¡Tu descendencia te lo agradecerá!",
                reflectionQuestions: "¿Qué victoria pequeña he visto en mi casa esta semana?",
                scripture: "Salmo 133:1"
            }
        ]
    },
    {
        title: "Falta de propósito",
        description: "Plan: Misión Asignada. Descubriendo que no eres un accidente, sino un agente del Reino con una asignación específica.",
        days: [
            {
                dayNumber: 1,
                title: "No eres un error de sistema",
                bibleStudy: "El mundo te dice que eres el resultado de la suerte o la evolución ciega. Dios dice que te formó en el vientre de tu madre con un plan. Antes de que nacieras, ya tenías una misión. No estás aquí para 'pasar el tiempo' o solo para consumir contenido; estás aquí para producir gloria para Dios.",
                practicalExercise: "Oración de Origen. Hoy dile a Dios: 'Señor, quito mi idea de que soy un accidente. Acepto que Tú me creaste a propósito. Muéstrame para qué'.",
                youthAdvice: "Si estás vivo, es porque Dios todavía tiene algo que hacer contigo. ¡Tu existencia es la prueba de tu propósito!",
                reflectionQuestions: "¿Qué cosas me apasionan y me hacen sentir que 'nací para esto'?",
                scripture: "Jeremías 1:5"
            },
            {
                dayNumber: 2,
                title: "El Éxito vs. El Propósito",
                bibleStudy: "El éxito es lograr lo que tú quieres; el propósito es lograr lo que Dios quiere. Puedes tener dinero y fama y sentirte vacío, porque el vacío del alma solo se llena con la asignación divina. El propósito le da sentido a tu lunes por la mañana. ¡Busca primero Su Reino!",
                practicalExercise: "Alineación de Metas. Escribe tus 3 sueños más grandes y pregúntate: '¿Cómo puede esto servir a Dios o a los demás?'. Si no sirve, rediséñalo.",
                youthAdvice: "No persigas el dinero, persigue el propósito. El dinero llegará solo si estás en el lugar correcto haciendo lo correcto.",
                reflectionQuestions: "¿Estoy viviendo para mi propio reino o para el de Dios?",
                scripture: "Mateo 6:33"
            },
            {
                dayNumber: 3,
                title: "Dones: Tu Equipamiento de Combate",
                bibleStudy: "Dios no te mandó a la guerra sin armas. Te dio talentos, habilidades y dones del Espíritu. Algunos son obvios, otros están escondidos bajo tus inseguridades. Usar tus dones es la forma más alta de adoración porque honras al que te los dio.",
                practicalExercise: "Inventario de Poder. Haz una lista de 5 cosas que haces bien (incluso cosas 'pequeñas' como escuchar o cocinar). Dedica 30 minutos a usar una de ellas para bendecir a alguien hoy.",
                youthAdvice: "No entierres tu talento por miedo al fracaso. ¡Sácalo y úsalo, así es como crece!",
                reflectionQuestions: "¿Qué dones he estado ignorando por compararme con otros?",
                scripture: "1 Pedro 4:10"
            },
            {
                dayNumber: 4,
                title: "El 'Por Qué' de tus Heridas",
                bibleStudy: "A menudo, tu mayor propósito nace de tu mayor dolor. Lo que venciste es lo que estás calificado para ayudar a otros a vencer. Tus cicatrices no son solo records de dolor, son medallas de guerra. Dios usa lo que el enemigo quiso para mal, para salvar a muchos.",
                practicalExercise: "Redención de Historia. Piensa en el problema más grande que hayas superado. Escribe cómo podrías usar esa experiencia para animar a alguien que esté pasando por eso hoy.",
                youthAdvice: "Tu 'lio' puede convertirse en tu 'mensaje'. ¡Deja que Dios use tu pasado para bendecir tu futuro!",
                reflectionQuestions: "¿Cómo puede mi dolor convertirse en el propósito de alguien más?",
                scripture: "Génesis 50:20"
            },
            {
                dayNumber: 5,
                title: "Pequeñas Obediencias",
                bibleStudy: "El propósito no siempre es un gran escenario; a menudo es ser fiel en lo poquito. Hacer tu cama, estudiar para el examen, ayudar a tu mamá... son pasos de obediencia que te preparan para cosas grandes. Quien no es fiel en lo poco, no lo será en lo mucho.",
                practicalExercise: "Día de Excelencia. Hoy, haz todo (hasta lo más aburrido) como si fuera para Jesús. Ponle todo el corazón a cada tarea pequeña.",
                youthAdvice: "No esperes 'el gran llamado' para empezar a servir. ¡Tu llamado es ser como Jesús hoy, donde estás!",
                reflectionQuestions: "¿En qué área de lo pequeño he estado siendo descuidado?",
                scripture: "Colosenses 3:23"
            },
            {
                dayNumber: 6,
                title: "Corriendo con Otros",
                bibleStudy: "No puedes cumplir tu propósito solo. Necesitas un equipo. Dios te puso en un cuerpo. Cuando encuentras a tu gente, tu propósito se potencia. Busca mentores y amigos que te empujen hacia tu destino, no que te distraigan de él.",
                practicalExercise: "Busca tu Pelotón. Habla con alguien que consideres un mentor o un amigo maduro y dile: 'Quiero servir a Dios, ¿en qué crees que puedo ayudar?'.",
                youthAdvice: "Dime con quién andas y te diré qué propósito estás matando o alimentando. ¡Elige bien!",
                reflectionQuestions: "¿Quiénes son los que me inspiran a ser más como Cristo?",
                scripture: "Hebreos 10:24"
            },
            {
                dayNumber: 7,
                title: "Agente del Reino",
                bibleStudy: "¡Felicidades! Ahora sabes que tienes una misión. No importa tu edad, eres un soldado del Reino. Camina con seguridad. Tu vida cuenta, tus palabras tienen poder y tu futuro está asegurado en las manos del Jefe. ¡Ve y cumple tu asignación!",
                practicalExercise: "Declaración de Misión. Escribe tu 'misión personal' en una frase: 'Yo existo para...'. Ponla donde la veas cada mañana.",
                youthAdvice: "¡Felicidades, agente! El mundo está esperando que te manifiestes. ¡No lo hagas esperar más!",
                reflectionQuestions: "¿Qué es lo primero que voy a hacer mañana para vivir mi propósito?",
                scripture: "Efesios 2:10"
            }
        ]
    },
    {
        title: "Miedo al futuro",
        description: "Plan: Destino Seguro. Cambiando la incertidumbre por la confianza radical en el Autor de tu historia.",
        days: [
            {
                dayNumber: 1,
                title: "Él ya estuvo ahí",
                bibleStudy: "Dios es eterno, lo que significa que Él ya está en tu futuro tanto como está en tu presente. No hay nada que te vaya a pasar mañana que Dios no haya visto ya hoy. No caminas hacia lo desconocido, caminas hacia los brazos de Dios que ya te está esperando allá.",
                practicalExercise: "Check-in de Mañana. Haz una lista de tus 3 miedos más grandes sobre el futuro. Escribe encima de cada uno: 'Dios ya está ahí y tiene el control'.",
                youthAdvice: "El miedo al futuro es como pagar intereses por un préstamo que ni siquiera has pedido. ¡Deja de sufrir por adelantado!",
                reflectionQuestions: "¿Qué escenario del futuro me quita más la paz hoy?",
                scripture: "Isaías 41:10"
            },
            {
                dayNumber: 2,
                title: "El Maná del Día",
                bibleStudy: "En el desierto, Dios enviaba maná solo para un día. No podían guardar para mañana. ¿Por qué? Porque Dios quería que dependieran de Él cada mañana. Tu futuro no se resuelve hoy, se resuelve viviendo hoy con Dios. La gracia de mañana llegará mañana, hoy usa la de hoy.",
                practicalExercise: "Día de Enfoque Total. Hoy prohíbete pensar en planes de más de 24 horas. Vive hoy al máximo con Jesús. Si viene un pensamiento de mañana, di: 'De eso se encarga Dios mañana'.",
                youthAdvice: "Deja de intentar resolver tu vida entera en una tarde. ¡Un día a la vez, guerrero!",
                reflectionQuestions: "¿Confío en que Dios me dará lo necesario cuando el momento llegue?",
                scripture: "Mateo 6:34"
            },
            {
                dayNumber: 3,
                title: "El Autor Perfecto",
                bibleStudy: "Si tú escribieras tu historia, quitarías los problemas. Pero Dios es un Autor mucho más interesante. Él usa las tensiones para crear crecimiento. Tu vida es un libro épico y el final ya está escrito: ¡Jesús gana! Confía en la pluma del Alfarero.",
                practicalExercise: "Mirada al Retrovisor. Recuerda una vez en el pasado donde tenías miedo y al final Dios te ayudó. Agradece por esa victoria del pasado para cobrar ánimo hoy.",
                youthAdvice: "Si el Autor es bueno, la historia terminará bien. ¡Relájate y disfruta el capítulo de hoy!",
                reflectionQuestions: "¿Dudo del amor de Dios cuando las cosas son inciertas?",
                scripture: "Salmo 138:8"
            },
            {
                dayNumber: 4,
                title: "La Trampa del Control",
                bibleStudy: "Tenemos miedo porque no tenemos el control. Pero la verdad es que NUNCA lo tuvimos. El control es una ilusión. La fe es aceptar nuestra impotencia y confiar en la omnipotencia de Dios. Soltar el volante es el acto más valiente que puedes hacer.",
                practicalExercise: "Gesto de Entrega. Abre tus manos físicamente ante Dios hoy y di: 'Señor, Te entrego mi futuro. Tú guías el barco'. Siente la libertad de no tener que ser el capitán.",
                youthAdvice: "Si intentas controlar todo, terminarás estresado y frustrado. Si confías en Dios, terminarás en paz.",
                reflectionQuestions: "¿Qué área de mi futuro sigo tratando de controlar yo solo?",
                scripture: "Proverbios 3:5-6"
            },
            {
                dayNumber: 5,
                title: "Inversión Eterna",
                bibleStudy: "Mucha ansiedad viene de preocuparnos por cosas que no duran (dinero, estatus, likes). Si inviertes tu corazón en lo eterno, nada te puede robar el futuro. Tu verdadera herencia está guardada en el cielo, donde no hay crisis económica ni virus que lleguen.",
                practicalExercise: "Ahorro Celestial. Haz algo hoy que tenga valor eterno: ayuda a alguien, comparte el evangelio, ora profundamente. Enfoca tu futuro en el Reino.",
                youthAdvice: "Si tu tesoro está en Dios, tu futuro nunca estará en bancarrota. ¡Garantizado!",
                reflectionQuestions: "¿En qué estoy invirtiendo mis esperanzas?",
                scripture: "Mateo 6:19-21"
            },
            {
                dayNumber: 6,
                title: "Paz en la Tormenta",
                bibleStudy: "Estar en paz no significa que no hay viento, significa que tienes a Jesús durmiendo en tu barca. Si Él está ahí, la barca no se hunde. Tu futuro puede parecer tormentoso, pero con la Palabra de Cristo '¡Calla, enmudece!', todo se calma dentro de ti.",
                practicalExercise: "Salmo de Poder. Lee el Salmo 23 en voz alta hoy, cambiando los 'él' por 'Señor'. Personalízalo: 'El Señor es MI pastor...'.",
                youthAdvice: "No temas a la tormenta, teme a estar sin Jesús. Pero si estás con Él, ¡qué importa la tormenta!",
                reflectionQuestions: "¿Realmente siento que Jesús está en mi barca hoy?",
                scripture: "Marcos 4:39"
            },
            {
                dayNumber: 7,
                title: "Destino Seguro",
                bibleStudy: "¡Meta alcanzada! Has decidido confiar. Tu futuro es brillante porque le pertenece a Dios. Camina con paso firme hacia lo que viene. No será fácil, pero será GLORIOSO. ¡Dios tiene cosas que ni te imaginas preparadas para ti!",
                practicalExercise: "Plan de Confianza Radicada. Escribe una promesa de Dios sobre el futuro y llévala contigo toda esta semana.",
                youthAdvice: "¡Felicidades, visionario! Tu futuro es tan seguro como el trono de Dios. ¡Atrévete a soñar en grande con Él!",
                reflectionQuestions: "¿Qué es lo que más me emociona de caminar hacia mi futuro con Dios?",
                scripture: "1 Corintios 2:9"
            }
        ]
    },
    {
        title: "Duelo / Pérdida",
        description: "Plan: Consuelo Eterno. Navegando el valle de sombra con el Dios de toda consolación.",
        days: [
            {
                dayNumber: 1,
                title: "Lágrimas que Dios cuenta",
                bibleStudy: "Perder a alguien o algo importante duele de una forma que las palabras no pueden explicar. Dios no te pide que 'seas fuerte' y no llores. Jesús lloró ante la tumba de Lázaro. El dolor es el precio de haber amado mucho. Dios recoge cada una de tus lágrimas en Su redoma. Se vale sufrir.",
                practicalExercise: "Espacio de Lamentación. Tómate un tiempo hoy para llorar o simplemente estar en silencio expresando tu pérdida ante Dios. No reprimas el dolor; entrégalo.",
                youthAdvice: "Llorar no es debilidad, es humanidad. Dios está ahí contigo, abrazándote en silencio.",
                reflectionQuestions: "¿He estado tratando de hacerme el fuerte ante Dios?",
                scripture: "Salmo 56:8"
            },
            {
                dayNumber: 2,
                title: "El Valle no es tu Casa",
                bibleStudy: "El Salmo 23 dice que caminamos POR el valle de sombra. No nos quedamos a vivir ahí. Es una transición. El dolor es real, pero no es eterno. Hay un camino de salida y Dios es el que lleva la antorcha. Sigue caminando, un paso a la vez.",
                practicalExercise: "Luz en el Valle. Haz una lista de 3 cosas que todavía tienes y por las que puedes dar gracias hoy, incluso en medio del dolor. Pequeñas luces en la sombra.",
                youthAdvice: "No te instales en el dolor. Sigue caminando con Jesús de la mano. ¡Hay luz al final!",
                reflectionQuestions: "¿Creo que algún día volveré a sentir alegría?",
                scripture: "Salmo 23:4"
            },
            {
                dayNumber: 3,
                title: "La Esperanza de la Vida Eterna",
                bibleStudy: "Para el cristiano, la muerte no es un 'adiós', es un 'hasta luego'. Si la persona que perdiste estaba en Cristo, ella está más viva que nunca. Y si es una pérdida material o de un sueño, Dios es capaz de restaurar y dar algo nuevo. La eternidad pone todo en perspectiva.",
                practicalExercise: "Visión Eterna. Lee sobre cómo será el Cielo en Apocalipsis 21. Deja que la esperanza de un lugar sin llanto sane un poquito tu corazón hoy.",
                youthAdvice: "El cielo es real. Tu pérdida aquí es temporal, la ganancia allá es eterna. ¡Ánimo!",
                reflectionQuestions: "¿Cómo cambia mi dolor cuando pienso en el Cielo?",
                scripture: "Apocalipsis 21:4"
            },
            {
                dayNumber: 4,
                title: "Dios es el Sanador de Corazones",
                bibleStudy: "Un corazón roto no se pega con pegamento, se sana con la presencia del Espíritu Santo. Él es llamado el 'Consolador'. Deja que Él entre en las grietas de tu alma. La sanidad lleva tiempo, no te apresures, pero deja que el Médico haga Su trabajo.",
                practicalExercise: "Cura de Reposo. Pasa un tiempo solo leyendo Salmos de consuelo. Deja que las palabras de la Biblia sean el bálsamo para tu herida.",
                youthAdvice: "No intentes llenar el vacío con cosas rápidas. Deja que sea Dios quien te sane de verdad.",
                reflectionQuestions: "¿Le he dado permiso al Espíritu Santo para consolarme?",
                scripture: "Salmo 147:3"
            },
            {
                dayNumber: 5,
                title: "Honrar a través del Propósito",
                bibleStudy: "Una forma de procesar la pérdida es haciendo algo significativo. Si perdiste a alguien, ¿cuál fue su mejor legado? Si perdiste un sueño, ¿qué aprendiste? Dios puede tomar tus cenizas y convertirlas en algo hermoso. No dejes que la pérdida detenga tu propósito.",
                practicalExercise: "Legado Vivo. Haz un acto de bondad hoy en memoria de lo que perdiste o como agradecimiento por lo que aprendiste. Convierte el dolor en amor.",
                youthAdvice: "La mejor forma de honrar a quien ya no está es viviendo tu vida al máximo para Dios.",
                reflectionQuestions: "¿Qué semilla de bien puedo sembrar hoy desde mi dolor?",
                scripture: "Isaías 61:3"
            },
            {
                dayNumber: 6,
                title: "Comunidad de Consuelo",
                bibleStudy: "No cargues el duelo solo. 'Llorad con los que lloran'. Necesitas que otros te sostengan cuando tus rodillas tiemblan. Permite que tus hermanos en Cristo sean las manos de Dios abrazándote. La vulnerabilidad en el duelo abre la puerta al consuelo colectivo.",
                practicalExercise: "Acepta Ayuda. Deja que alguien hoy haga algo por ti (te traiga comida, te escuche, ore por ti). No digas 'no hace falta', deja que te bendigan.",
                youthAdvice: "Cerrarte en tu cuarto no hace que el dolor se vaya, solo lo hace más pesado. ¡Abre la puerta!",
                reflectionQuestions: "¿A quién puedo dejar entrar en mi dolor hoy?",
                scripture: "Romanos 12:15"
            },
            {
                dayNumber: 7,
                title: "Paz que Sobrepasa",
                bibleStudy: "¡Llegaste! El dolor no se ha ido del todo, pero ahora tienes paz. El Dios de toda paz te ha sostenido. Ahora puedes caminar de nuevo, con cicatrices, sí, pero con una fe más fuerte y experimentada. ¡Sigue adelante, Jesús camina a tu lado!",
                practicalExercise: "Oración de Aceptación. Dile a Dios: 'Acepto lo que pasó y confío en Tu soberanía. Ayúdame a vivir de nuevo para Ti'.",
                youthAdvice: "¡Felicidades, valiente! Has atravesado el valle. ¡Ahora eres un puerto seguro para otros que sufran!",
                reflectionQuestions: "¿Cómo ha crecido mi relación con Dios después de esta pérdida?",
                scripture: "2 Corintios 1:3-4"
            }
        ]
    },
    {
        title: "Bullying / Rechazo",
        description: "Plan: Escudo de Gloria. Protegiendo tu identidad y perdonando en ambientes de hostilidad.",
        days: [
            {
                dayNumber: 1,
                title: "Jesús fue el primero en ser rechazado",
                bibleStudy: "Si te sientes rechazado, estás en buena compañía. A Jesús lo insultaron, lo escupieron y sus amigos lo abandonaron. Él entiende perfectamente tu dolor. No eres 'raro' ni 'inferior' por ser atacado. El rechazo del mundo a menudo es una prueba de que no perteneces al mundo, sino a Dios.",
                practicalExercise: "Escudo Mental. Cuando recibas un insulto hoy, susurra: 'Jesús me acepta, eso es todo lo que importa'. No dejes que las palabras entren a tu corazón.",
                youthAdvice: "La gente hiere porque está herida. No tomes como verdad las palabras de alguien que ni siquiera conoce su propio corazón.",
                reflectionQuestions: "¿Por qué me importa tanto lo que piensen personas que no aman a Dios?",
                scripture: "Juan 15:18-19"
            },
            {
                dayNumber: 2,
                title: "Tu Valor es Innegociable",
                bibleStudy: "El bullying intenta convencerte de que vales poco. Pero tu valor no es una opinión de tus compañeros, es un hecho pagado con sangre en la cruz. Si Dios cree que vales la vida de Su Hijo, ¿quién es un mortal para decir que vales menos? ¡Cierra tus oídos a la mentira!",
                practicalExercise: "Espejo de Verdad. Escribe en tu espejo con un marcador borrable (o pon un post-it): 'Soy tesoro especial de Dios'. Léelo cada vez que alguien te haga sentir menos.",
                youthAdvice: "Eres un diamante en medio de piedras. Las piedras solo chocan, ¡tú brilla!",
                reflectionQuestions: "¿He empezado a creer las mentiras que me dicen?",
                scripture: "Isaías 43:4"
            },
            {
                dayNumber: 3,
                title: "Bendecir al que te Persigue",
                bibleStudy: "Esto es nivel experto. Jesús dijo: 'Amad a vuestros enemigos'. No es que te gusten, es decidir desearles el bien a pesar del mal que te hacen. Bendecir te quita el poder de víctima y te pone en el lugar de un hijo de Dios. El rencor es una cadena que tú puedes romper.",
                practicalExercise: "Oración Radical. Ora hoy por esa persona que te hace bullying. Pide a Dios que sane su corazón y lo salve. Siente cómo el odio se va de TI.",
                youthAdvice: "Odiar es darle el control de tu felicidad al otro. Perdonar es quitarle ese poder de una vez por todas.",
                reflectionQuestions: "¿Puedo ver la herida emocional que tiene mi atacante?",
                scripture: "Mateo 5:44"
            },
            {
                dayNumber: 4,
                title: "Valentía y Sabiduría",
                bibleStudy: "Confiar en Dios no significa dejar que te pisoteen sin hacer nada. Dios te llamó a ser astuto como serpiente y sencillo como paloma. Busca ayuda, pon límites, aléjate de ambientes tóxicos. La sabiduría es un regalo de Dios para proteger tu integridad.",
                practicalExercise: "Plan de Acción. Habla con un adulto, maestro o líder hoy sobre lo que está pasando. No sufras en silencio. Dios usa a las personas para protegernos.",
                youthAdvice: "Denunciar lo que está mal no es cobardía, es valor. ¡No cargues este peso tú solo!",
                reflectionQuestions: "¿A quién le he tenido miedo de contarle mi situación?",
                scripture: "Salmo 27:1"
            },
            {
                dayNumber: 5,
                title: "Tu Identidad es tu Armadura",
                bibleStudy: "Efesios habla de la armadura de Dios. El escudo de la fe apaga los dardos de fuego (los insultos, las burlas). Si tu fe en lo que Dios dice de ti es fuerte, nada de lo que digan fuera te puede herir por dentro. ¡Vístete de Dios cada mañana!",
                practicalExercise: "Checklist de Armadura. Imagina hoy que te pones un casco de salvación y un escudo antes de salir. Visualiza que los insultos rebotan en el escudo de la Verdad divina.",
                youthAdvice: "Tú no eres lo que la gente dice. Eres lo que Dios hace. ¡No te saques la armadura!",
                reflectionQuestions: "¿Tengo mi escudo listo para hoy?",
                scripture: "Efesios 6:16"
            },
            {
                dayNumber: 6,
                title: "Saliendo a la Luz",
                bibleStudy: "El rechazo nos hace querer escondernos. Pero Dios te llamó a ser luz. No dejes que el bullying apague tu brillo. Sigue haciendo lo que amas, sigue sirviendo a Dios, sigue siendo 'tú'. Al final, Dios exalta a los humildes y avergüenza a los soberbios.",
                practicalExercise: "Brillo Propio. Hoy, haz algo que te haga feliz y que antes dejabas de hacer por miedo a la burla. Hazlo para la gloria de Dios.",
                youthAdvice: "¡No te escondas! El mundo necesita tu luz única. Los que te rechazan hoy se sorprenderán mañana.",
                reflectionQuestions: "¿Qué partes de mí he ocultado por miedo al rechazo?",
                scripture: "Salmo 37:5-6"
            },
            {
                dayNumber: 7,
                title: "Escudo de Gloria",
                bibleStudy: "¡Victoria! Has superado la barrera del rechazo. Ya no dependes de la opinión humana. Eres libre para ser amado por Dios y para amar a los demás, incluso a los difíciles. Camina con dignidad real. ¡Eres un hijo del Rey invencible!",
                practicalExercise: "Contrato de Libertad. Prométele a Dios que nunca más dejarás que un hombre defina tu valor. Tú le perteneces a Él.",
                youthAdvice: "¡Felicidades, invencible! Has ganado la batalla mental. ¡Ahora ve y ayuda a otros que se sienten rechazados!",
                reflectionQuestions: "¿Cómo voy a usar mi experiencia para proteger a otros?",
                scripture: "Romanos 8:31"
            }
        ]
    },
    {
        title: "Lectura Bíblica",
        description: "Plan: Conexión Vital. Descubriendo el poder de la Palabra para transformar tu mente y corazón cada día.",
        days: [
            {
                dayNumber: 1,
                title: "No es un libro, es una Persona",
                bibleStudy: "La Biblia no es un manual de reglas aburridas, es una carta de amor activa. Hebreos dice que es 'viva y eficaz'. Cuando la lees, Dios te lee a ti. No busques información, busca una relación. ¡Hoy Jesús quiere hablarte!",
                practicalExercise: "Lugar de Encuentro. Elige un lugar y una hora fija hoy para leer. Sin distracciones. Empieza con una oración simple: 'Señor, háblame hoy'.",
                youthAdvice: "No leas la Biblia porque 'tienes' que hacerlo, sino porque 'puedes' hacerlo. Es el cheat code para la vida.",
                reflectionQuestions: "¿Qué espero encontrar hoy en la Palabra?",
                scripture: "Hebreos 4:12"
            },
            {
                dayNumber: 2,
                title: "Luz en tu Laberinto",
                bibleStudy: "Tu Palabra es lámpara a mis pies. El mundo es oscuro y confuso, pero la Biblia ilumina el siguiente paso. No necesitas ver todo el camino, solo el siguiente escalón. Confía en la guía del Diseñador.",
                practicalExercise: "Subrayado de Oro. Lee un capítulo hoy y subraya UNA sola frase que te dé paz o dirección. Guárdala en tu mente todo el día.",
                youthAdvice: "Cuando no sepas qué hacer, abre el Libro. Dios tiene mejores consejos que cualquier influencer.",
                reflectionQuestions: "¿En qué área de mi vida necesito luz hoy mismo?",
                scripture: "Salmo 119:105"
            },
            {
                dayNumber: 3,
                title: "El Pan del Campeón",
                bibleStudy: "No solo de pan vive el hombre. Tu espíritu tiene hambre, y la Biblia es su comida. Si no lees, te debilitas espiritualmente. Un guerrero bien alimentado gana batallas que otros pierden.",
                practicalExercise: "Dosis Diaria. Lee los Proverbios del día (ej. si hoy es 15, lee Proverbios 15). Es sabiduría práctica para la calle.",
                youthAdvice: "No salgas de casa en ayunas espiritual. ¡Desayuna la Palabra!",
                reflectionQuestions: "¿Cómo me siento cuando paso días sin leer la Biblia?",
                scripture: "Mateo 4:4"
            },
            {
                dayNumber: 4,
                title: "Espada de Combate",
                bibleStudy: "La Palabra es la espada del Espíritu. Jesús venció al diablo citando la Biblia. Cuando el enemigo te mienta, tú respóndele con un 'Escrito está'. Es tu arma defensiva y ofensiva.",
                practicalExercise: "Memorización Táctica. Memoriza UN versículo corto hoy. Repítelo hasta que sea parte de ti. Es tu bala de plata para la próxima tentación.",
                youthAdvice: "No vayas a la guerra con las manos vacías. ¡Lleva tu espada afilada!",
                reflectionQuestions: "¿Qué mentiras del enemigo necesito combatir con la verdad?",
                scripture: "Efesios 6:17"
            },
            {
                dayNumber: 5,
                title: "El Espejo de la Verdad",
                bibleStudy: "La Biblia es un espejo. Te muestra quién eres realmente en Dios, más allá de tus errores. No para juzgarte, sino para recordarte tu valor y pulir tu carácter. Deja que la Palabra corrija tu postura.",
                practicalExercise: "Escaneo de Corazón. Lee Santiago 1 y pregúntate: '¿Soy solo un oidor o también hago lo que dice?'. Pide ayuda a Dios para aplicar lo que leíste.",
                youthAdvice: "El espejo del baño te muestra la cara, el espejo de la Biblia te muestra el alma. ¡Dale una mirada!",
                reflectionQuestions: "¿Qué parte de mi carácter está tratando de pulir la Palabra?",
                scripture: "Santiago 1:22-25"
            },
            {
                dayNumber: 6,
                title: "Agua que Refresca",
                bibleStudy: "Si estás cansado, la Palabra te restaura. Es como agua fría en un desierto. Dios prometió que Su Palabra no vuelve vacía; siempre produce fruto. Deja que limpie tu mente de la basura del mundo.",
                practicalExercise: "Baño de Pureza. Dedica tiempo a leer un Salmo de alabanza (ej. Salmo 103) y deja que las promesas de Dios laven tus preocupaciones.",
                youthAdvice: "El mundo te ensucia la mente, la Biblia te la limpia. ¡Date un chapuzón diario!",
                reflectionQuestions: "¿De qué pensamientos necesito limpiar mi mente hoy?",
                scripture: "Isaías 55:11"
            },
            {
                dayNumber: 7,
                title: "Caminando con el Autor",
                bibleStudy: "¡Felicidades! Has completado 7 días de conexión. Pero esto es solo el inicio. El Autor de la Biblia quiere caminar contigo cada kilómetro de tu vida. La Biblia no se termina de leer, se empieza a vivir.",
                practicalExercise: "Plan de Carrera. Elige un libro de la Biblia para leer completo a partir de mañana (ej. el Evangelio de Juan o Efesios). No te detengas.",
                youthAdvice: "¡Eres un campeón de la Palabra! Mantén el fuego encendido. ¡Nos vemos en las páginas!",
                reflectionQuestions: "¿Cómo ha cambiado mi perspectiva de la Biblia en estos 7 días?",
                scripture: "Josué 1:8"
            }
        ]
    },
    {
        title: "Ansiedad / Estrés",
        description: "Plan: Calma en el Caos. Navegando las tormentas de la mente con la paz que sobrepasa todo entendimiento.",
        days: [
            {
                dayNumber: 1,
                title: "El Mito del Control",
                bibleStudy: "Vivimos estresados porque queremos ser el GPS de nuestra vida. La ansiedad es el humo que sale cuando intentas controlar cosas que solo le pertenecen a Dios. ¡Relájate, tu Padre alimenta a los pájaros y ellos no tienen cuenta de ahorro!",
                practicalExercise: "Vaciado de Papel. Escribe todo lo que te quita el sueño. Luego, orando, dáselo a Dios y rompe el papel. ¡No es tu problema hoy!",
                youthAdvice: "Vive en 'modo un día a la vez'. Dios te da batería para 24 horas, no para el próximo mes.",
                reflectionQuestions: "¿Por qué me asusta tanto que Dios tenga el control?",
                scripture: "Mateo 6:25-34"
            },
            {
                dayNumber: 2,
                title: "La Paz no es un Sentimiento",
                bibleStudy: "La paz de Dios no es la ausencia de problemas, sino la presencia de una Persona. No esperes a 'sentirte bien' para tener paz. La paz se reclama como una herencia legal en medio del ruido.",
                practicalExercise: "Respiración Espiritual. Cierra los ojos y por 2 minutos solo repite: 'Tú eres mi paz'. Enfócate en Su presencia, no en tu crisis.",
                youthAdvice: "La paz es un músculo que se entrena cuando todo sale mal. ¡No te rindas!",
                reflectionQuestions: "¿Estoy buscando paz en las circunstancias o en Jesús?",
                scripture: "Juan 14:27"
            },
            {
                dayNumber: 3,
                title: "Cuidado con el Mañana",
                bibleStudy: "Jesús fue drástico: 'Basta a cada día su propio mal'. El 90% de las cosas que te angustian del futuro nunca pasarán. No pagues intereses por un problema que aún no ha llegado.",
                practicalExercise: "Filtro de Preocupación. Cada vez que pienses en '¿qué pasará si...?', cámbialo por 'Dios estará ahí cuando...'. Cambia el miedo por confianza.",
                youthAdvice: "No puedes pelear las batallas de mañana con las fuerzas de hoy. ¡Enfócate en el ahora!",
                reflectionQuestions: "¿Qué porcentaje de mis miedos son reales hoy mismo?",
                scripture: "Mateo 6:34"
            },
            {
                dayNumber: 4,
                title: "La Oración como Antídoto",
                bibleStudy: "Filipenses dice: 'Por nada estéis afanosos'. La receta es: Oración + Ruego + Acción de Gracias. Cuando conviertes tu preocupación en oración, Dios convierte tu ansiedad en paz.",
                practicalExercise: "Inventario de Gratitud. Escribe 5 cosas por las que estás agradecido HOY. La gratitud y la ansiedad no pueden vivir en el mismo corazón.",
                youthAdvice: "Si es lo suficientemente grande para preocuparte, es lo suficientemente grande para orar por ello.",
                reflectionQuestions: "¿He orado por lo que me preocupa hoy?",
                scripture: "Filipenses 4:6-7"
            },
            {
                dayNumber: 5,
                title: "Descansando en la Verdad",
                bibleStudy: "Dios no duerme. Si Él está despierto cuidando el universo, tú puedes dormir tranquilo. Tu ansiedad no ayuda a Dios a resolver nada, solo te agota a ti.",
                practicalExercise: "Salmo de Cuna. Lee el Salmo 4 en voz alta antes de dormir. Declara que Dios te hace vivir confiado.",
                youthAdvice: "Dormir bien es un acto de fe. Es confiar en que Dios sigue trabajando mientras tú descansas.",
                reflectionQuestions: "¿Me permito descansar realmente en Dios?",
                scripture: "Salmo 4:8"
            },
            {
                dayNumber: 6,
                title: "Pensamientos de Luz",
                bibleStudy: "Tu mente es un campo de batalla. Si dejas que la basura entre, tendrás ansiedad. Pablo nos dice en qué pensar: lo verdadero, lo honesto, lo puro. Filtra tus pensamientos antes de que ellos te filtren a ti.",
                practicalExercise: "Celo Digital. Deja de seguir cuentas o ver noticias que solo te den ansiedad hoy. Elige contenido que edifique tu fe.",
                youthAdvice: "Cuida lo que consumes en redes. El algoritmo de Dios siempre te lleva a la paz.",
                reflectionQuestions: "¿Qué estoy dejando entrar a mi mente hoy?",
                scripture: "Filipenses 4:8"
            },
            {
                dayNumber: 7,
                title: "Calma en el Caos",
                bibleStudy: "¡Felicidades! Has decidido no dejar que la ansiedad te domine. Recuerda: las tormentas vendrán, pero tú tienes al Calma-Tormentas en tu barca. Sigue confiando, sigue orando y sigue viviendo en paz.",
                practicalExercise: "Voto de Confianza. Escribe una promesa de paz y llévala en tu bolsillo o como fondo de pantalla esta semana.",
                youthAdvice: "¡Felicidades, guerrero/a de paz! El mañana le pertenece a Dios, y tú también.",
                reflectionQuestions: "¿Cómo voy a mantener mi paz a partir de mañana?",
                scripture: "Isaías 26:3"
            }
        ]
    },
    {
        title: "Pereza Espiritual",
        description: "Plan: ¡Despierta! ⚡ Saliendo de la apatía para incendiar tu propósito con el fuego de Dios.",
        days: [
            {
                dayNumber: 1,
                title: "Sal de la Matrix",
                bibleStudy: "Estar 'ni frío ni caliente' es el estado más peligroso. La pereza espiritual es una fe zombie: haces las cosas por rutina pero tu corazón está en modo avión. Dios te llamó para incendiar el mundo, no para dormirte en el sofá de la comodidad.",
                practicalExercise: "Shock de sistema. Hoy levántate 15 minutos antes de lo normal SOLO para hablar con Dios. Rompe la rutina de la pereza con un acto de voluntad.",
                youthAdvice: "La motivación es un sentimiento, la disciplina es un compromiso. ¡Hazlo y las ganas vendrán después!",
                reflectionQuestions: "¿En qué áreas de mi fe me he vuelto 'tibio'?",
                scripture: "Apocalipsis 3:15-16"
            },
            {
                dayNumber: 2,
                title: "El Peligro del Estancamiento",
                bibleStudy: "El agua estancada se pudre; el agua que corre da vida. Tu fe necesita movimiento. Si no estás creciendo, estás retrocediendo. No te conformes con lo que lograste ayer, hay niveles más profundos en Dios esperándote.",
                practicalExercise: "Misión Nueva. Haz algo por Dios hoy que nunca hayas hecho (habla con alguien, sirve en una nueva área, ora por un extraño). Rompe el molde.",
                youthAdvice: "La comodidad es la tumba del crecimiento. ¡Sal de tu zona de confort hoy!",
                reflectionQuestions: "¿Cuándo fue la última vez que sentí pasión por Dios?",
                scripture: "2 Timoteo 1:6"
            },
            {
                dayNumber: 3,
                title: "Alimentando el Fuego",
                bibleStudy: "Un fuego se apaga si no le echas leña. La leña es la Palabra, la oración y la comunidad. Si dejas de 'echarle leña' a tu espíritu, el frío de la apatía te va a ganar. Mantén la llama encendida cueste lo que cueste.",
                practicalExercise: "Dosis de Poder. Lee 3 capítulos de la Biblia hoy y pasa 15 minutos orando con intensidad. No lo hagas por cumplir, hazlo por necesidad.",
                youthAdvice: "No esperes a que tu líder te anime. ¡Aviva tú mismo el fuego de Dios en ti!",
                reflectionQuestions: "¿Qué leña le estoy echando a mi fuego hoy?",
                scripture: "Levítico 6:13"
            },
            {
                dayNumber: 4,
                title: "El Valor de lo Invisible",
                bibleStudy: "Buscamos cosas que se ven, pero lo que no se ve es eterno. La pereza viene cuando nos enfocamos demasiado en el mundo y poco en el Reino. Invierte tiempo en lo que realmente importa. Tu eternidad se construye en tus decisiones de hoy.",
                practicalExercise: "Ayuno de Distracción. Deja el celular por 2 horas hoy y dedícaselas a Dios. Sin ruidos, solo Tú y Él. Recupera el valor de la soledad con Dios.",
                youthAdvice: "Si tienes tiempo para scrollear en TikTok, tienes tiempo para buscar a Dios. ¡Prioridades!",
                reflectionQuestions: "¿A qué le estoy dando mi mejor energía hoy?",
                scripture: "Colosenses 3:2"
            },
            {
                dayNumber: 5,
                title: "Cuidado con las 'Zorras Pequeñas'",
                bibleStudy: "No es un gran pecado lo que te aleja de Dios, a veces son pequeñas desidias: 'hoy no oro', 'mañana leo', 'el domingo no voy'. Esas pequeñas zorras echan a perder el viñedo de tu fe. Atácalas hoy mismo.",
                practicalExercise: "Reparación Total. Identifica una 'zorra pequeña' (un mal hábito o descuido) y elimínala hoy de tu rutina. Toma el control.",
                youthAdvice: "Los grandes naufragios empiezan con una pequeña grieta. ¡Tapa el hueco ya!",
                reflectionQuestions: "¿Qué pequeñas cosas me están robando la pasión por Dios?",
                scripture: "Cantares 2:15"
            },
            {
                dayNumber: 6,
                title: "Corriendo por el Premio",
                bibleStudy: "Pablo comparaba la fe con una carrera. Un atleta no corre cuando tiene ganas, corre para ganar. Entrena tu espíritu. La autodisciplina es la madre de la libertad. No seas un espectador, sé un atleta del Reino.",
                practicalExercise: "Entrenamiento de Guerrero. Ponte una meta espiritual para el próximo mes (ej. leer todo el NT, orar 30 min diarios) y escríbela. Empieza hoy.",
                youthAdvice: "¡No te detengas! La meta está cerca y el premio es eterno. ¡Corre con todo!",
                reflectionQuestions: "¿Estoy corriendo para ganar o solo estoy paseando?",
                scripture: "1 Corintios 9:24-25"
            },
            {
                dayNumber: 7,
                title: "¡Despierto y Encendido!",
                bibleStudy: "¡Felicidades! Has roto el ciclo de la pereza. Ahora mantente alerta. El enemigo no quiere que brilles, pero Dios te ha dado un espíritu de poder, amor y dominio propio. ¡Ve y enciende a otros con tu fuego!",
                practicalExercise: "Plan de Acción 24/7. Escribe 3 compromisos innegociables para mantener tu vida espiritual vibrante. No vuelvas a dormirte.",
                youthAdvice: "¡Felicidades, antorcha humana! El mundo está oscuro, ¡ve y brilla fuerte por Dios!",
                reflectionQuestions: "¿A quién voy a animar hoy a despertar también?",
                scripture: "Efesios 5:14"
            }
        ]
    }
];

async function main() {
    console.log("Seeding Struggle Plans...");
    for (const plan of strugglePlans) {
        const createdPlan = await prisma.strugglePlan.upsert({
            where: { title: plan.title },
            update: { description: plan.description },
            create: {
                title: plan.title,
                description: plan.description,
            },
        });

        for (const day of plan.days) {
            await prisma.strugglePlanDay.upsert({
                where: {
                    planId_dayNumber: {
                        planId: createdPlan.id,
                        dayNumber: day.dayNumber,
                    },
                },
                update: {
                    title: day.title,
                    bibleStudy: day.bibleStudy,
                    practicalExercise: day.practicalExercise,
                    youthAdvice: day.youthAdvice,
                    reflectionQuestions: day.reflectionQuestions,
                    scripture: day.scripture,
                },
                create: {
                    planId: createdPlan.id,
                    dayNumber: day.dayNumber,
                    title: day.title,
                    bibleStudy: day.bibleStudy,
                    practicalExercise: day.practicalExercise,
                    youthAdvice: day.youthAdvice,
                    reflectionQuestions: day.reflectionQuestions,
                    scripture: day.scripture,
                },
            });
        }
    }
    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
