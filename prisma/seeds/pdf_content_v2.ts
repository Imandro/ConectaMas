export const pdfContentData: Record<string, { title: string, category: string, introduction: string, sections: { subtitle: string, content: string }[], conclusion: string }> = {
    "identidad-cristo": {
        title: "Guía: ¿Quién soy en realidad?",
        category: "Identidad",
        introduction: "En un mundo de filtros y comparaciones constantes, descubrir quién eres en Cristo es la clave de la verdadera libertad.",
        sections: [
            {
                subtitle: "Fuera de los Filtros",
                content: "Tu identidad no es lo que los demás dicen de ti, ni siquiera lo que tú dices de ti mismo en tus días malos. Eres un diseño original de Dios (Salmo 139:14)."
            },
            {
                subtitle: "El Valor de la Cruz",
                content: "Tu precio fue la sangre de Jesús. No eres un accidente, eres un especial tesoro para el Creador del universo."
            }
        ],
        conclusion: "Camina hoy con la seguridad de que no necesitas la aprobación del mundo si ya tienes la del Padre."
    },
    "pureza-digital": {
        title: "Manual: Pureza en la Generación Z",
        category: "Pureza",
        introduction: "La santidad no es una lista de prohibiciones, sino un estilo de vida que protege tu corazón y tu futuro.",
        sections: [
            {
                subtitle: "Ojos que Ven",
                content: "Lo que permitimos entrar por nuestros ojos afecta directamente nuestra alma. No se trata solo de evitar lo malo, sino de abrazar lo puro (Filipenses 4:8)."
            },
            {
                subtitle: "Victoria en el Click",
                content: "La tentación suele ser solitaria. La victoria se encuentra en la luz y en la rendición de cuentas con hermanos de fe."
            }
        ],
        conclusion: "Dios te llamó a la libertad, no a ser esclavo de una pantalla."
    },
    "ansiedad-joven": {
        title: "Venciendo la Ansiedad Escolar y Social",
        category: "Salud Mental",
        introduction: "La paz de Dios sobrepasa todo entendimiento, incluso en medio de exámenes y presiones sociales.",
        sections: [
            {
                subtitle: "Suelta la Carga",
                content: "La ansiedad suele ser el resultado de intentar controlar el futuro. Dios nos invita a descansar en Su soberanía hoy (Mateo 6:34)."
            },
            {
                subtitle: "Respira en su Presencia",
                content: "Orar es el primer paso para intercambiar nuestra angustia por Su paz. No es solo pedir, es confiar."
            }
        ],
        conclusion: "Tu futuro está seguro en las manos de Aquel que conoce el final desde el principio."
    },
    "noviazgo-santo": {
        title: "Noviazgo: El Mapa de la Santidad",
        category: "Relaciones",
        introduction: "Una relación saludable es aquella que te acerca más a Jesús, no la que te distrae de Él.",
        sections: [
            {
                subtitle: "Banderas Rojas Bíblicas",
                content: "Si alguien no ama a Dios más de lo que te ama a ti, no podrá amarte como Dios manda. Busca integridad, no solo atracción."
            },
            {
                subtitle: "El Límite del Honor",
                content: "Poner límites no es 'anticuado'; es una forma de honrar el templo del Espíritu Santo y proteger el corazón de tu pareja."
            }
        ],
        conclusion: "El amor verdadero sabe esperar y sabe respetar los tiempos de Dios."
    },
    // Adding more gradually... I'll populate the rest in the actual file for brevity of this thought
    "proposito-joven": {
        title: "Manual: Tu Vocación y el Reino",
        category: "Propósito",
        introduction: "Tu carrera no es solo para ganar dinero, es tu campo misionero más grande.",
        sections: [
            { subtitle: "Talentos para Su Gloria", content: "Dios te dio habilidades específicas para un propósito eterno. Tu vocación es donde tu pasión se encuentra con la necesidad del mundo." },
            { subtitle: "Sin Crisis de Identidad", content: "Lo que haces no define quién eres. Puedes cambiar de empleo, pero tu llamado a servir a Dios permanece." }
        ],
        conclusion: "Trabaja para el Señor, no para los hombres, y encontrarás satisfacción real."
    },
    "dones-espirituales": {
        title: "Dones Espirituales: Test y Activación",
        category: "Discipulado",
        introduction: "El Espíritu Santo te ha equipado con regalos sobrenaturales para edificar a la iglesia.",
        sections: [
            { subtitle: "No eres un Espectador", content: "Todos los creyentes tienen al menos un don. Tu aporte es vital para que el Cuerpo de Cristo funcione correctamente." },
            { subtitle: "Amor: El Motor del Don", content: "Cualquier don espiritual sin amor es solo ruido. Sirve para bendecir, no para lucirte." }
        ],
        conclusion: "¡Activa tu fe y empieza a servir donde Dios te ha puesto!"
    },
    "autoesteem-biblica": {
        title: "Manual: Sanando la Baja Autoestima",
        category: "Salud Mental",
        introduction: "Tener una sana autoestima es verte como Dios te ve: amado y valioso.",
        sections: [
            { subtitle: "Verdad vs Mentira", content: "El enemigo te susurra que no vales nada. Dios te grita desde la cruz que vales Su vida." },
            { subtitle: "Perfección en la Debilidad", content: "Dios usa lo quebrantado para mostrar Su poder. Tus cicatrices son testimonios de Su gracia." }
        ],
        conclusion: "Eres Su obra maestra, en proceso de restauración continua."
    },
    "esperanza-depresion": {
        title: "Depresión: Luz en el Túnel",
        category: "Salud Mental",
        introduction: "Incluso en el valle de sombra de muerte, el Buen Pastor camina a tu lado.",
        sections: [
            { subtitle: "Es Válido Llorar", content: "Muchos salmos son lamentos. Dios no se asusta de tu dolor; Él recoge tus lágrimas en Su redoma." },
            { subtitle: "Pasos en la Oscuridad", content: "A veces la victoria es simplemente levantarse un día más. No camines solo; busca ayuda y comunidad." }
        ],
        conclusion: "La noche no es eterna; la alegría viene por la mañana."
    },
    "amistades-reales": {
        title: "Amistades: Círculo de Crecimiento",
        category: "Relaciones",
        introduction: "Dime con quién andas y te diré qué tan cerca estás de Dios.",
        sections: [
            { subtitle: "Hierro con Hierro", content: "Los amigos verdaderos te confrontan con amor y te impulsan a ser más como Jesús." },
            { subtitle: "Lealtad en la Prueba", content: "En el mundo de los contactos, sé un amigo fiel que está en las malas, no solo en las fiestas." }
        ],
        conclusion: "El mejor amigo es Jesús, y Él nos da amigos terrenales para reflejar Su amor."
    },
    "redes-sociales": {
        title: "Redes Sociales: ¿Dueño o Esclavo?",
        category: "Vida Cristiana",
        introduction: "Tu celular puede ser un púlpito o una prisión. Tú decides.",
        sections: [
            { subtitle: "Ayunando de Algoritmos", content: "Desconectarse para conectarse con Dios. Prueba un día a la semana sin redes y observa cómo cambia tu paz mental." },
            { subtitle: "Influencer del Reino", content: "Tus posts pueden dar luz o sombra. Usa tu alcance para compartir esperanza en un mundo lleno de envidia." }
        ],
        conclusion: "No dejes que el scroll infinito te robe la eternidad."
    },
    "apologetica-joven": {
        title: "Manual: Defendiendo tu Fe",
        category: "Evangelismo",
        introduction: "Tener fe no significa apagar el cerebro. Dios es la fuente de toda verdad.",
        sections: [
            { subtitle: "Razones para Creer", content: "La creación, la historia y la resurrección de Jesús ofrecen una base sólida para nuestra fe." },
            { subtitle: "Responder con Mansedumbre", content: "Ganar una discusión sin ganar una persona no sirve de nada. Defiende la verdad con amor." }
        ],
        conclusion: "Estudia para dar razón de tu esperanza a cualquiera que te la pida."
    },
    "gym-espiritual": {
        title: "Ayuno y Oración: El Gimnasio",
        category: "Oración",
        introduction: "La intensidad de tu vida pública depende de la profundidad de tu vida privada con Dios.",
        sections: [
            { subtitle: "Disciplina sobre Sentimiento", content: "No siempre tendrás ganas de orar. Hazlo por obediencia y el fuego se encenderá." },
            { subtitle: "El Silencio que Habla", content: "Aprende a callar y escuchar. El ayuno silencia la carne para que el espíritu oiga con claridad." }
        ],
        conclusion: "Entrena tu espíritu para las batallas que el mundo te presentará."
    },
    "leer-biblia": {
        title: "Guía: Leer la Biblia sin Aburrirse",
        category: "Estudio Bíblico",
        introduction: "La Biblia no es un libro viejo, es Dios hablándote en presente.",
        sections: [
            { subtitle: "Cambia el Método", content: "Prueba leer en diferentes versiones, subraya, escribe y pregunta. Haz que la lectura sea un diálogo." },
            { subtitle: "Encuntrate con el Autor", content: "No leas para saber más, lee para conocer mejor a Jesús. Él es el centro de cada página." }
        ],
        conclusion: "Su Palabra es lámpara a tus pies y lumbrera a tu camino."
    },
    "guerra-espiritual-joven": {
        title: "Manual de Guerra Espiritual",
        category: "Guerra Espiritual",
        introduction: "Nuestra lucha no es contra carne y sangre, sino contra potestades de malicia.",
        sections: [
            { subtitle: "Firmeza en la Verdad", content: "El cinturón de la verdad es tu primera defensa contra las mentiras del enemigo sobre tu pecado." },
            { subtitle: "La Espada: Palabra Activa", content: "No solo lleves la Biblia, úsala. Memoriza versículos para atacar los pensamientos de duda." }
        ],
        conclusion: "Ya somos vencedores en Cristo; solo necesitamos mantener la posición."
    },
    "liderazgo-joven": {
        title: "Liderazgo Influyente: Sé el Ejemplo",
        category: "Liderazgo",
        introduction: "Liderar es servir. Nadie tenga en poco tu juventud.",
        sections: [
            { subtitle: "Integridad a Puertas Cerradas", content: "Tu liderazgo público es tan fuerte como tu testimonio privado. Sé real, no perfecto." },
            { subtitle: "Formando a Otros", content: "Un líder exitoso no es el que tiene más seguidores, sino el que forma a más líderes." }
        ],
        conclusion: "Usa tu influencia para que otros vean a Jesús, no a ti."
    },
    "evangelismo-creativo": {
        title: "Manual: Evangelismo Creativo",
        category: "Evangelismo",
        introduction: "Compartir a Jesús es la aventura más grande que existe.",
        sections: [
            { subtitle: "Tu Historia cuenta", content: "Nadie puede discutir con tu testimonio. Cuenta cómo eras antes y cómo Jesús te cambió." },
            { subtitle: "Servir es Predicar", content: "A veces un acto de bondad abre más puertas que mil palabras. Sé las manos y pies de Jesús." }
        ],
        conclusion: "Ve y haz discípulos, empezando por los que tienes a un lado."
    },
    "finanzas-jovenes": {
        title: "Guía de Finanzas Cristianas",
        category: "Finanzas",
        introduction: "Dios es el dueño de todo; nosotros somos solo administradores.",
        sections: [
            { subtitle: "Generosidad Primero", content: "Dar es el antídoto contra el egoísmo. Honra a Dios con tus primicias y observa Su provisión." },
            { subtitle: "Contentamiento", content: "La felicidad no está en tener más, sino en estar satisfecho con lo que Dios te ha dado." }
        ],
        conclusion: "Administra bien lo poco y Dios te pondrá sobre lo mucho."
    },
    "honra-familia": {
        title: "Honrando a Padres Difíciles",
        category: "Relaciones",
        introduction: "La honra es un principio del Reino que trae bendición de larga vida.",
        sections: [
            { subtitle: "Honra no es Acuerdo", content: "Puedes honrar a tus padres aunque no estés de acuerdo con ellos. Se trata de tu corazón, no de sus méritos." },
            { subtitle: "El Ejemplo de Jesús", content: "Jesús honró a Su Padre celestial aun en la cruz. Tu obediencia educa y puede ganar a tu familia." }
        ],
        conclusion: "La paz en casa empieza con tu actitud de servicio y respeto."
    },
    "perdon-sanidad": {
        title: "Manual: El Camino del Perdón",
        category: "Salud Mental",
        introduction: "Perdonar no es olvidar, es soltar la deuda para que Dios sane la herida.",
        sections: [
            { subtitle: "Libérate del Rencor", content: "La falta de perdón es un veneno que tú te tomas esperando que el otro muera. Suéltalo." },
            { subtitle: "Perdonarte a ti mismo", content: "Si Dios ya te perdonó, ¿quién eres tú para seguir condenándote? Acepta Su gracia completa." }
        ],
        conclusion: "La libertad real comienza cuando dejas de ser prisionero de tu pasado."
    },
    "biblia-y-ciencia": {
        title: "Guía: Biblia y Ciencia",
        category: "Estudio Bíblico",
        introduction: "La ciencia descubre las leyes; la Biblia revela al Legislador.",
        sections: [
            { subtitle: "Sin Contradicción", content: "Muchos de los grandes científicos fueron hombres de fe. La naturaleza es el segundo libro de Dios." },
            { subtitle: "Diseño Inteligente", content: "La complejidad de la vida apunta a un Creador brillante, no a un accidente ciego." }
        ],
        conclusion: "Cuanto más aprendemos del universo, más nos asombramos del Creador."
    }
};
