import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const prismaAny = prisma as any

async function main() {
    console.log('🌱 Starting database seed...')

    // --- SONGS ---
    console.log('🎵 Seeding songs...')
    const songs = [
        {
            id: "song-1",
            title: "1000 Pedazos",
            artist: "Un Corazón",
            url: "https://www.dropbox.com/scl/fi/7v70onqnzf4276q4u0u12/Un-Coraz-n-1000-Pedazos-Video-Oficial.mp3?rlkey=v6l6m1v1n1v1v1v1v1v1&st=v1v1v1v1&raw=1",
            category: "Adoración",
        },
        {
            id: "song-2",
            title: "Paz en la Tormenta",
            artist: "René González",
            url: "https://www.dropbox.com/scl/fi/7v70onqnzf4276q4u0u13/Paz-En-La-Tormenta.mp3?rlkey=v6l6m1v1n1v1v1v1v1v1&st=v1v1v1v1&raw=1",
            category: "Paz",
        },
        {
            id: "song-3",
            title: "Tu Fidelidad",
            artist: "Marcos Witt",
            url: "https://www.dropbox.com/scl/fi/7v70onqnzf4276q4u0u14/Tu-Fidelidad.mp3?rlkey=v6l6m1v1n1v1v1v1v1v1&st=v1v1v1v1&raw=1",
            category: "Gratitud",
        },
        {
            id: "song-4",
            title: "Oceanos",
            artist: "Evan Craft",
            url: "https://www.dropbox.com/scl/fi/7v70onqnzf4276q4u0u15/Oceanos.mp3?rlkey=v6l6m1v1n1v1v1v1v1v1&st=v1v1v1v1&raw=1",
            category: "Confianza",
        }
    ]

    for (const song of songs) {
        await prismaAny.song.upsert({
            where: { id: song.id },
            update: song,
            create: song,
        })
    }

    // --- DAILY PRAYERS ---
    console.log('🙏 Seeding Daily Prayers...')

    const prayerTemplates = [
        {
            theme: 'Fe',
            content: 'Padre celestial, aumenta mi fe hoy. Ayúdame a confiar en ti incluso cuando no veo el camino. Que mi fe no se base en circunstancias, sino en tu fidelidad eterna. En el nombre de Jesús, Amén.'
        },
        {
            theme: 'Esperanza',
            content: 'Señor de esperanza, llena mi corazón de tu paz. Cuando todo parezca oscuro, recuérdame que tú eres mi luz. Que mi esperanza esté anclada en tus promesas que nunca fallan. Amén.'
        },
        {
            theme: 'Amor',
            content: 'Dios de amor, enséñame a amar como tú amas. Que tu amor fluya a través de mí hacia otros. Ayúdame a perdonar, a ser paciente y a mostrar compasión. En tu nombre, Amén.'
        },
        {
            theme: 'Perdón',
            content: 'Padre misericordioso, gracias por tu perdón inmerecido. Ayúdame a perdonar a quienes me han herido, así como tú me has perdonado. Libera mi corazón de resentimiento. Amén.'
        },
        {
            theme: 'Fuerza',
            content: 'Señor todopoderoso, dame fuerzas para enfrentar este día. Cuando me sienta débil, recuérdame que tu poder se perfecciona en mi debilidad. Sé mi fortaleza y mi refugio. Amén.'
        },
        {
            theme: 'Paz',
            content: 'Príncipe de paz, calma las tormentas de mi corazón. Que tu paz que sobrepasa todo entendimiento guarde mi mente y mis pensamientos. En medio del caos, tú eres mi paz. Amén.'
        },
        {
            theme: 'Sabiduría',
            content: 'Dios de sabiduría, guíame en todas mis decisiones. Dame discernimiento para conocer tu voluntad. Que tu Palabra ilumine mi camino y dirija mis pasos. En Cristo, Amén.'
        },
        {
            theme: 'Gratitud',
            content: 'Padre bueno, gracias por tus bendiciones diarias. Ayúdame a tener un corazón agradecido en toda circunstancia. Que nunca olvide tu fidelidad y tu amor constante. Amén.'
        },
        {
            theme: 'Protección',
            content: 'Señor mi protector, cúbreme bajo tus alas. Guárdame del mal y de toda tentación. Que tus ángeles acampen alrededor de mí y de mis seres queridos. Amén.'
        },
        {
            theme: 'Sanidad',
            content: 'Dios sanador, toca mi cuerpo, mente y espíritu. Restaura lo que está quebrantado y sana mis heridas. Confío en tu poder sanador y en tu amor restaurador. Amén.'
        },
        {
            theme: 'Provisión',
            content: 'Jehová Jireh, mi proveedor, confío en que suplirás todas mis necesidades. Ayúdame a no afanarme, sino a buscar primero tu reino. Gracias por tu fidelidad. Amén.'
        },
        {
            theme: 'Paciencia',
            content: 'Señor paciente, enséñame a esperar en tu tiempo perfecto. Dame paciencia en las pruebas y en las relaciones. Que aprenda a descansar en tu soberanía. Amén.'
        }
    ];

    const totalDays = 365;
    for (let i = 0; i < totalDays; i++) {
        const template = prayerTemplates[i % prayerTemplates.length];
        await prismaAny.dailyPrayer.upsert({
            where: { dayOfYear: i + 1 },
            update: {
                title: `Oración del día ${i + 1}`,
                content: template.content,
                theme: template.theme
            },
            create: {
                dayOfYear: i + 1,
                title: `Oración del día ${i + 1}`,
                content: template.content,
                theme: template.theme
            },
        })
    }

    console.log('✅ 365 Daily Prayers seeded')

    // --- FORUM CATEGORIES ---
    console.log('🗣️ Seeding Forum Categories...')

    const forumCategories = [
        { name: 'Sugerencias y Soporte', description: '¡Ayúdanos a mejorar! Deja tus dudas o ideas aquí sobre la aplicación.', icon: '🚀' },
        { name: 'Ansiedad', description: 'Comparte y encuentra apoyo sobre ansiedad y preocupaciones', icon: '😰' },
        { name: 'Depresión', description: 'Un espacio seguro para hablar sobre depresión y tristeza', icon: '😔' },
        { name: 'Adicciones', description: 'Apoyo en la lucha contra adicciones de todo tipo', icon: '🚫' },
        { name: 'Lujuria', description: 'Venciendo la tentación sexual juntos en Cristo', icon: '💪' },
        { name: 'Relaciones', description: 'Consejos sobre relaciones, familia y amistades', icon: '❤️' },
        { name: 'Fe y Dudas', description: 'Preguntas sobre la fe cristiana y la Biblia', icon: '🙏' },
        { name: 'Testimonios', description: 'Comparte tu historia de transformación y victoria', icon: '✨' },
        { name: 'Oración', description: 'Peticiones de oración y apoyo espiritual', icon: '🕊️' },
    ];

    for (const category of forumCategories) {
        await prismaAny.forumCategory.upsert({
            where: { name: category.name },
            update: category,
            create: category,
        });
    }

    console.log('✅ 8 Forum Categories seeded')

    // --- TRIVIA QUESTIONS ---
    console.log('🎮 Seeding Trivia Questions...')
    const triviaQuestions = [
        {
            question: "¿Quién construyó el arca para salvarse del diluvio?",
            options: JSON.stringify(["Moisés", "Abraham", "Noé", "David"]),
            correctIndex: 2,
            explanation: "Noé construyó el arca por mandato de Dios para salvar a su familia y a los animales. ¡No te confundas con Moisés!",
            reference: "Génesis 6:14",
            difficulty: "EASY"
        },
        {
            question: "¿Cuántos mandamientos entregó Dios a Moisés en el monte Sinaí?",
            options: JSON.stringify(["5", "10", "12", "7"]),
            correctIndex: 1,
            explanation: "Dios entregó los 10 Mandamientos a Moisés grabados en tablas de piedra.",
            reference: "Éxodo 20",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el hombre más fuerte mencionado en la Biblia?",
            options: JSON.stringify(["Sansón", "Goliat", "Salomón", "Pedro"]),
            correctIndex: 0,
            explanation: "Sansón fue un juez de Israel dotado de una fuerza sobrehumana por el Espíritu de Dios.",
            reference: "Jueces 13-16",
            difficulty: "EASY"
        },
        {
            question: "¿Qué mar dividió Moisés para que el pueblo de Israel cruzara?",
            options: JSON.stringify(["Mar Mediterráneo", "Mar Muerto", "Mar Rojo", "Mar de Galilea"]),
            correctIndex: 2,
            explanation: "Bajo el poder de Dios, Moisés extendió su vara y el Mar Rojo se dividió.",
            reference: "Éxodo 14:21",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue vendido por sus hermanos como esclavo en Egipto?",
            options: JSON.stringify(["Benjamín", "José", "Isaac", "Jacob"]),
            correctIndex: 1,
            explanation: "Los hermanos de José, celosos, lo vendieron a una caravana de ismaelitas.",
            reference: "Génesis 37",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál es el libro más corto del Antiguo Testamento?",
            options: JSON.stringify(["Abdías", "Joel", "Amós", "Jonás"]),
            correctIndex: 0,
            explanation: "Abdías contiene solo un capítulo de 21 versículos.",
            reference: "Abdías 1",
            difficulty: "HARD"
        },
        {
            question: "¿Cómo se llamaba el gigante que David derrotó?",
            options: JSON.stringify(["Anac", "Og", "Goliat", "Nimrod"]),
            correctIndex: 2,
            explanation: "David, siendo un joven pastor, derrotó al gigante filisteo Goliat con una honda y una piedra.",
            reference: "1 Samuel 17",
            difficulty: "EASY"
        },
        {
            question: "¿Cuál fue el primer milagro público de Jesús?",
            options: JSON.stringify(["Caminar sobre el agua", "Multiplicar los panes", "Convertir el agua en vino", "Sanar a un ciego"]),
            correctIndex: 2,
            explanation: "Jesús convirtió el agua en vino durante una boda en Caná de Galilea.",
            reference: "Juan 2:1-11",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién negó a Jesús tres veces antes de que el gallo cantara?",
            options: JSON.stringify(["Juan", "Pedro", "Judas", "Andrés"]),
            correctIndex: 1,
            explanation: "Tal como Jesús lo predijo, Pedro lo negó tres veces por temor.",
            reference: "Mateo 26:69-75",
            difficulty: "EASY"
        },
        {
            question: "¿Cuál es el fruto del Espíritu según Gálatas 5:22-23?",
            options: JSON.stringify(["Dinero y poder", "Amor, gozo, paz...", "Salud y bienestar", "Fama y honor"]),
            correctIndex: 1,
            explanation: "El fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza.",
            reference: "Gálatas 5:22-23",
            difficulty: "NORMAL"
        },
        // --- 110 more questions ---
        {
            question: "¿Cuántos animales de cada especie metió Moisés en el arca?",
            options: JSON.stringify(["Dos", "Siete", "Ninguno", "Diez"]),
            correctIndex: 2,
            explanation: "¡Pregunta trampa! Fue Noé quien construyó el arca, no Moisés.",
            reference: "Génesis 6",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el primer rey de Israel?",
            options: JSON.stringify(["David", "Salomón", "Saúl", "Samuel"]),
            correctIndex: 2,
            explanation: "Saúl fue ungido por Samuel como el primer rey de Israel.",
            reference: "1 Samuel 10",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál fue el regalo que Jacob le dio a su hijo José?",
            options: JSON.stringify(["Un anillo de oro", "Una túnica de colores", "Un cayado de mando", "Una corona"]),
            correctIndex: 1,
            explanation: "Jacob amaba a José más que a sus otros hijos y le dio una túnica especial de muchos colores.",
            reference: "Génesis 37:3",
            difficulty: "EASY"
        },
        {
            question: "¿Qué profeta fue llevado al cielo en un torbellino?",
            options: JSON.stringify(["Moisés", "Elías", "Eliseo", "Ezequiel"]),
            correctIndex: 1,
            explanation: "Elías fue llevado al cielo en un carro de fuego y un torbellino.",
            reference: "2 Reyes 2:11",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuántas veces dio vueltas el pueblo de Israel a Jericó el séptimo día?",
            options: JSON.stringify(["Una vez", "Tres veces", "Siete veces", "Doce veces"]),
            correctIndex: 2,
            explanation: "El séptimo día rodearon la ciudad siete veces antes de que los muros cayeran.",
            reference: "Josué 6:4",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién sucedió a Moisés como líder de Israel?",
            options: JSON.stringify(["Aarón", "Caleb", "Josué", "Gedeón"]),
            correctIndex: 2,
            explanation: "Josué fue el encargado de guiar al pueblo a la Tierra Prometida.",
            reference: "Josué 1",
            difficulty: "EASY"
        },
        {
            question: "¿Cuál era la profesión de Mateo antes de seguir a Jesús?",
            options: JSON.stringify(["Pescador", "Carpintero", "Cobrador de impuestos", "Médico"]),
            correctIndex: 2,
            explanation: "Mateo (Leví) estaba sentado a la mesa de recaudación cuando Jesús lo llamó.",
            reference: "Mateo 9:9",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue arrojado al foso de los leones?",
            options: JSON.stringify(["José", "Daniel", "Jeremías", "Jonás"]),
            correctIndex: 1,
            explanation: "Daniel fue arrojado al foso por orar a Dios contra el edicto real, pero Dios cerró la boca de los leones.",
            reference: "Daniel 6",
            difficulty: "EASY"
        },
        {
            question: "¿Qué pidió Salomón a Dios al comenzar su reinado?",
            options: JSON.stringify(["Riquezas", "Larga vida", "Sabiduría", "Victoria sobre enemigos"]),
            correctIndex: 2,
            explanation: "Salomón pidió sabiduría y entendimiento para gobernar bien al pueblo.",
            reference: "1 Reyes 3",
            difficulty: "EASY"
        },
        {
            question: "¿Cuál fue el primer nombre de Abraham?",
            options: JSON.stringify(["Abram", "Abimelec", "Absalón", "Aarón"]),
            correctIndex: 0,
            explanation: "Dios le cambió el nombre de Abram a Abraham, que significa padre de muchas naciones.",
            reference: "Génesis 17:5",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién escribió el libro de Hechos de los Apóstoles?",
            options: JSON.stringify(["Pedro", "Pablo", "Lucas", "Juan"]),
            correctIndex: 2,
            explanation: "Lucas, el médico amado, escribió tanto el Evangelio que lleva su nombre como el libro de Hechos.",
            reference: "Hechos 1:1",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuántos discípulos eligió Jesús originalmente?",
            options: JSON.stringify(["7", "10", "12", "70"]),
            correctIndex: 2,
            explanation: "Jesús llamó a doce hombres para que fueran sus apóstoles.",
            reference: "Marcos 3:14",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue la mujer que engañó a Sansón para descubrir su secreto?",
            options: JSON.stringify(["Jezabel", "Dalila", "Rut", "Ester"]),
            correctIndex: 1,
            explanation: "Dalila presionó a Sansón hasta que él le confesó que su fuerza residía en su cabello consagrado.",
            reference: "Jueces 16",
            difficulty: "EASY"
        },
        {
            question: "¿En qué idioma se escribió la mayor parte del Antiguo Testamento?",
            options: JSON.stringify(["Griego", "Latín", "Arameo", "Hebreo"]),
            correctIndex: 3,
            explanation: "El AT fue escrito principalmente en hebreo, con algunas partes en arameo.",
            reference: "Historia Bíblica",
            difficulty: "HARD"
        },
        {
            question: "¿Quién fue el profeta que desafió a los profetas de Baal en el monte Carmelo?",
            options: JSON.stringify(["Eliseo", "Isaías", "Elías", "Amós"]),
            correctIndex: 2,
            explanation: "Elías propuso la prueba del fuego del cielo para demostrar quién era el verdadero Dios.",
            reference: "1 Reyes 18",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál fue la señal del pacto que Dios hizo con Noé después del diluvio?",
            options: JSON.stringify(["Una paloma", "Un arcoíris", "Una zarza ardiente", "Una nube"]),
            correctIndex: 1,
            explanation: "El arcoíris es el recordatorio de la promesa de Dios de no volver a destruir la tierra con agua.",
            reference: "Génesis 9:13",
            difficulty: "EASY"
        },
        {
            question: "¿Quién era el esposo de María, la madre de Jesús?",
            options: JSON.stringify(["Juan el Bautista", "Zacarías", "José", "Jacob"]),
            correctIndex: 2,
            explanation: "José, un carpintero descendiente de David, fue el esposo de María y padre terrenal de Jesús.",
            reference: "Mateo 1",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue la reina que salvó a su pueblo, los judíos, de la exterminación?",
            options: JSON.stringify(["Ester", "Rut", "Sara", "Débora"]),
            correctIndex: 0,
            explanation: "Ester arriesgó su vida al presentarse ante el rey Asuero para interceder por su pueblo.",
            reference: "Ester 7",
            difficulty: "EASY"
        },
        {
            question: "¿Cuántos días y noches llovió durante el diluvio?",
            options: JSON.stringify(["7 días", "12 días", "40 días", "100 días"]),
            correctIndex: 2,
            explanation: "Llovió sobre la tierra cuarenta días y cuarenta noches sin cesar.",
            reference: "Génesis 7:12",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el primer mártir cristiano?",
            options: JSON.stringify(["Santiago", "Pedro", "Esteban", "Pablo"]),
            correctIndex: 2,
            explanation: "Esteban fue apedreado por su fe en Jesús, convirtiéndose en el primer mártir.",
            reference: "Hechos 7",
            difficulty: "NORMAL"
        },
        {
            question: "¿Qué regalo le llevó la reina de Sabá a Salomón?",
            options: JSON.stringify(["Especias", "Plata", "Oro", "Ovejas"]),
            correctIndex: 2,
            explanation: "La reina de Sabá llevó una cantidad inmensa de oro, especias y piedras preciosas.",
            reference: "1 Reyes 10:10",
            difficulty: "HARD"
        },
        {
            question: "¿Quién reconoció a Jesús como el Cristo cuando era solo un bebé en el templo?",
            options: JSON.stringify(["Herodes", "Simeón", "Caifás", "Pilato"]),
            correctIndex: 1,
            explanation: "Simeón, un hombre justo, había recibido del Espíritu Santo que no moriría sin ver al Mesías.",
            reference: "Lucas 2:25-30",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál es el mandamiento con promesa?",
            options: JSON.stringify(["No matarás", "Honra a tu padre y a tu madre", "No hurtarás", "No dirás falso testimonio"]),
            correctIndex: 1,
            explanation: "Efessios 6:2 identifica este mandamiento como el primero con promesa de larga vida.",
            reference: "Efesios 6:2",
            difficulty: "NORMAL"
        },
        {
            question: "¿Qué instrumento tocaba David para calmar al rey Saúl?",
            options: JSON.stringify(["La flauta", "La pandereta", "El arpa", "La trompeta"]),
            correctIndex: 2,
            explanation: "David era un hábil tañedor de arpa y su música aliviaba el espíritu atormentado de Saúl.",
            reference: "1 Samuel 16:23",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el autor del libro de Proverbios?",
            options: JSON.stringify(["David", "Moisés", "Salomón", "Isaías"]),
            correctIndex: 2,
            explanation: "Aunque hay varios autores, la mayoría de los proverbios se atribuyen a la sabiduría de Salomón.",
            reference: "Proverbios 1:1",
            difficulty: "NORMAL"
        },
        {
            question: "¿En qué monte se detuvo el arca de Noé?",
            options: JSON.stringify(["Monte Sinaí", "Monte Ararat", "Monte de los Olivos", "Monte Carmelo"]),
            correctIndex: 1,
            explanation: "El arca reposó sobre los montes de Ararat al bajar las aguas.",
            reference: "Génesis 8:4",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue la mujer que se convirtió en estatua de sal?",
            options: JSON.stringify(["La esposa de Lot", "Sara", "Rebeca", "Lea"]),
            correctIndex: 0,
            explanation: "Al mirar atrás hacia Sodoma, desobedeciendo la orden divina, se convirtió en estatua de sal.",
            reference: "Génesis 19:26",
            difficulty: "EASY"
        },
        {
            question: "¿Cuántas plagas envió Dios a Egipto?",
            options: JSON.stringify(["3", "7", "10", "12"]),
            correctIndex: 2,
            explanation: "Fueron 10 plagas las que azotaron Egipto para que el Faraón dejara ir al pueblo de Israel.",
            reference: "Éxodo 7-12",
            difficulty: "EASY"
        },
        {
            question: "¿Qué usó David para matar al gigante Goliat?",
            options: JSON.stringify(["Una espada", "Una lanza", "Una honda y una piedra", "Un arco"]),
            correctIndex: 2,
            explanation: "David rechazó la armadura del rey y venció al gigante con una honda y el poder de Dios.",
            reference: "1 Samuel 17:40",
            difficulty: "EASY"
        },
        {
            question: "¿Quién era el hermano de Moisés?",
            options: JSON.stringify(["Josué", "Caleb", "Aarón", "Miriam"]),
            correctIndex: 2,
            explanation: "Aarón fue el portavoz de Moisés ante el Faraón.",
            reference: "Éxodo 4:14",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue la nuera de Noemí que se quedó con ella y regresó a Belén?",
            options: JSON.stringify(["Orfa", "Rut", "Raquel", "Marta"]),
            correctIndex: 1,
            explanation: "Rut decidió no abandonar a Noemí, diciendo: 'Tu pueblo será mi pueblo, y tu Dios mi Dios'.",
            reference: "Rut 1:16",
            difficulty: "NORMAL"
        },
        {
            question: "¿Qué apóstol era médico?",
            options: JSON.stringify(["Mateo", "Marcos", "Lucas", "Juan"]),
            correctIndex: 2,
            explanation: "Lucas es referido por Pablo como 'el médico amado'.",
            reference: "Colosenses 4:14",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién subió a un árbol para ver pasar a Jesús?",
            options: JSON.stringify(["Zaqueo", "Bartimeo", "Lázaro", "Felipe"]),
            correctIndex: 0,
            explanation: "Zaqueo, que era de baja estatura, subió a un sicómoro para ver a Jesús en Jericó.",
            reference: "Lucas 19:1-4",
            difficulty: "EASY"
        },
        {
            question: "¿Qué visión tuvo Jacob en Betel?",
            options: JSON.stringify(["Una zarza ardiendo", "Una escalera que llegaba al cielo", "Un valle de huesos secos", "Cuatro jinetes"]),
            correctIndex: 1,
            explanation: "Jacob soñó con una escalera por la que subían y bajaban ángeles de Dios.",
            reference: "Génesis 28:12",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuántas tribus tenía Israel?",
            options: JSON.stringify(["3", "7", "10", "12"]),
            correctIndex: 3,
            explanation: "Las doce tribus de Israel descendían de los hijos de Jacob.",
            reference: "Génesis 35:22",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el profeta que huyó a Tarsis en lugar de ir a Nínive?",
            options: JSON.stringify(["Isaías", "Jonás", "Amós", "Zacarías"]),
            correctIndex: 1,
            explanation: "Jonás intentó escapar de la presencia del Señor tomando un barco hacia Tarsis.",
            reference: "Jonás 1:3",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue la madre de Juan el Bautista?",
            options: JSON.stringify(["María", "Isabel", "Marta", "Juana"]),
            correctIndex: 1,
            explanation: "Isabel concibió a Juan en su vejez, un milagro anunciado por el ángel Gabriel.",
            reference: "Lucas 1:13",
            difficulty: "NORMAL"
        },
        {
            question: "¿Qué hizo Jesús en la última cena antes de repartir el pan?",
            options: JSON.stringify(["Lavó los pies a los discípulos", "Cantó un salmo", "Realizó un milagro", "Predicó un sermón"]),
            correctIndex: 0,
            explanation: "Jesús mostró su humildad lavando los pies de sus discípulos, dejándoles un ejemplo de servicio.",
            reference: "Juan 13:5",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el hombre que reemplazó a Judas Iscariote como apóstol?",
            options: JSON.stringify(["Bernabé", "Matías", "Silas", "Timoteo"]),
            correctIndex: 1,
            explanation: "Los discípulos echaron suertes y la suerte cayó sobre Matías.",
            reference: "Hechos 1:26",
            difficulty: "HARD"
        },
        {
            question: "¿Cuál es el primer libro del Nuevo Testamento?",
            options: JSON.stringify(["Génesis", "Gálatas", "Mateo", "Marcos"]),
            correctIndex: 2,
            explanation: "El Evangelio según San Mateo abre la colección de libros del Nuevo Testamento.",
            reference: "Bíblia",
            difficulty: "EASY"
        },
        {
            question: "¿Qué animal tentó a Eva en el jardín del Edén?",
            options: JSON.stringify(["Un león", "Una serpiente", "Un mono", "Un ave"]),
            correctIndex: 1,
            explanation: "La serpiente engañó a Eva para que comiera del fruto prohibido.",
            reference: "Génesis 3",
            difficulty: "EASY"
        },
        {
            question: "¿Cuántas veces perdonó Jesús a Pedro después de su resurrección?",
            options: JSON.stringify(["Una", "Tres", "Siete", "Setenta veces siete"]),
            correctIndex: 1,
            explanation: "Jesús le preguntó tres veces si lo amaba, restaurándolo después de sus tres negaciones.",
            reference: "Juan 21:15-17",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el profeta que vio un valle de huesos secos cobrar vida?",
            options: JSON.stringify(["Jeremías", "Ezequiel", "Isaías", "Daniel"]),
            correctIndex: 1,
            explanation: "Dios llevó a Ezequiel a un valle de huesos secos y estos se cubrieron de carne por Su palabra.",
            reference: "Ezequiel 37",
            difficulty: "NORMAL"
        },
        {
            question: "¿Qué le sucedió a Saulo camino a Damasco?",
            options: JSON.stringify(["Fue encarcelado", "Vio una luz y quedó ciego", "Tuvo mucha hambre", "Se perdió en el desierto"]),
            correctIndex: 1,
            explanation: "Una luz del cielo lo rodeó y escuchó la voz de Jesús, quedando ciego por tres días.",
            reference: "Hechos 9",
            difficulty: "EASY"
        },
        {
            question: "¿Quién era la hermana de María y Lázaro que estaba preocupada por el quehacer?",
            options: JSON.stringify(["Marta", "Juana", "Ester", "Rut"]),
            correctIndex: 0,
            explanation: "Marta se quejaba de que María no le ayudaba a servir mientras escuchaba a Jesús.",
            reference: "Lucas 10:40",
            difficulty: "EASY"
        },
        {
            question: "¿Qué pidió Juan el Bautista cuando predicaba en el desierto?",
            options: JSON.stringify(["Dinero", "Sacrificios", "Arrepentimiento", "Guerra"]),
            correctIndex: 2,
            explanation: "Juan decía: 'Arrepentíos, porque el reino de los cielos se ha acercado'.",
            reference: "Mateo 3:2",
            difficulty: "EASY"
        },
        {
            question: "¿Cuánto tiempo estuvo Jesús en el desierto antes de ser tentado?",
            options: JSON.stringify(["7 días", "12 días", "40 días", "100 días"]),
            correctIndex: 2,
            explanation: "Jesús ayunó cuarenta días y cuarenta noches antes de que el tentador se le acercara.",
            reference: "Mateo 4:2",
            difficulty: "EASY"
        },
        {
            question: "¿Quién escribió el Salmo 23 ('El Señor es mi pastor')?",
            options: JSON.stringify(["Moisés", "Salomón", "David", "Asaf"]),
            correctIndex: 2,
            explanation: "Este es uno de los salmos más conocidos compuestos por el rey David.",
            reference: "Salmos 23",
            difficulty: "EASY"
        },
        {
            question: "¿Qué mar cruzaron los israelitas para entrar en la Tierra Prometida?",
            options: JSON.stringify(["El Mar Rojo", "El Río Jordán", "El Mar Muerto", "El Mar de Galilea"]),
            correctIndex: 1,
            explanation: "¡Cuidado! El Mar Rojo fue al salir de Egipto, el Jordán fue al entrar a la tierra prometida.",
            reference: "Josué 3",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el primer hijo de Adán y Eva?",
            options: JSON.stringify(["Abel", "Set", "Caín", "Enoc"]),
            correctIndex: 2,
            explanation: "Caín fue el primogénito, seguido por Abel.",
            reference: "Génesis 4:1",
            difficulty: "EASY"
        },
        {
            question: "¿Cómo se llamaba la esposa de Isaac?",
            options: JSON.stringify(["Sara", "Rebeca", "Raquel", "Lea"]),
            correctIndex: 1,
            explanation: "Abraham envió a su siervo a buscar una esposa para Isaac, y trajo a Rebeca.",
            reference: "Génesis 24:67",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el profeta que fue vendido en una cisterna seca por sus hermanos?",
            options: JSON.stringify(["Daniel", "José", "Jeremías", "Amós"]),
            correctIndex: 1,
            explanation: "José fue echado en una cisterna antes de ser vendido a los mercaderes.",
            reference: "Génesis 37:24",
            difficulty: "EASY"
        },
        {
            question: "¿Qué prometió Dios a Abraham sobre su descendencia?",
            options: JSON.stringify(["Que serían pocos", "Que serían como las estrellas", "Que serían reyes", "Que vivirían para siempre"]),
            correctIndex: 1,
            explanation: "Dios le dijo que su descendencia sería incontable como las estrellas del cielo.",
            reference: "Génesis 15:5",
            difficulty: "EASY"
        },
        {
            question: "¿Cuál de estos no es un evangelio?",
            options: JSON.stringify(["Mateo", "Marcos", "Lucas", "Hechos"]),
            correctIndex: 3,
            explanation: "Los cuatro evangelios son Mateo, Marcos, Lucas y Juan. Hechos es un libro histórico.",
            reference: "Biblia",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el discípulo que dudó de la resurrección de Jesús hasta tocar sus heridas?",
            options: JSON.stringify(["Pedro", "Juan", "Tomás", "Felipe"]),
            correctIndex: 2,
            explanation: "Tomás dijo que no creería hasta que viera las marcas de los clavos.",
            reference: "Juan 20:25",
            difficulty: "EASY"
        },
        {
            question: "¿Qué idioma hablaba Jesús cotidianamente?",
            options: JSON.stringify(["Hebreo", "Griego", "Latín", "Arameo"]),
            correctIndex: 3,
            explanation: "El arameo era la lengua común en Palestina en tiempos de Jesús.",
            reference: "Historia Bíblica",
            difficulty: "HARD"
        },
        {
            question: "¿Cómo murió Juan el Bautista?",
            options: JSON.stringify(["Crucificado", "Apedreado", "Decapitado", "De vejez"]),
            correctIndex: 2,
            explanation: "Fue decapitado por orden de Herodes debido a una promesa hecha a la hija de Herodías.",
            reference: "Mateo 14:10",
            difficulty: "NORMAL"
        },
        {
            question: "¿Qué ciudad fue destruida junto con Gomorra debido a su pecado?",
            options: JSON.stringify(["Babel", "Sodoma", "Nínive", "Jericó"]),
            correctIndex: 1,
            explanation: "Sodoma y Gomorra fueron destruidas con fuego y azufre por su gran maldad.",
            reference: "Génesis 19:24",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el autor del libro de Apocalipsis?",
            options: JSON.stringify(["Pedro", "Pablo", "Juan", "Esteban"]),
            correctIndex: 2,
            explanation: "El apóstol Juan recibió las visiones mientras estaba exiliado en la isla de Patmos.",
            reference: "Apocalipsis 1:1",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál fue el monte donde Jesús fue transfigurado?",
            options: JSON.stringify(["Monte Sinaí", "Monte Carmelo", "Monte Tabor", "Monte Horeb"]),
            correctIndex: 2,
            explanation: "Tradicionalmente se cree que fue el Monte Tabor.",
            reference: "Mateo 17",
            difficulty: "HARD"
        },
        {
            question: "¿Quién fue el juez que derrotó a los madianitas con solo 300 hombres?",
            options: JSON.stringify(["Sansón", "Gedeón", "Barac", "Jefté"]),
            correctIndex: 1,
            explanation: "Dios redujo el ejército de Gedeón a 300 hombres para demostrar que la victoria era suya.",
            reference: "Jueces 7",
            difficulty: "NORMAL"
        },
        {
            question: "¿A qué ciudad huía Jonás cuando ocurrió la tormenta?",
            options: JSON.stringify(["Nínive", "Jerusalén", "Tarsis", "Egipto"]),
            correctIndex: 2,
            explanation: "Jonás tomó un barco hacia Tarsis para huir de la misión a Nínive.",
            reference: "Jonás 1:3",
            difficulty: "NORMAL"
        },
        {
            question: "¿En qué día de la creación creó Dios al hombre?",
            options: JSON.stringify(["Tercer día", "Quinto día", "Sexto día", "Séptimo día"]),
            correctIndex: 2,
            explanation: "El hombre fue creado el sexto día, después de los animales terrestres.",
            reference: "Génesis 1:26-31",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién era el padre de Isaac?",
            options: JSON.stringify(["Adam", "Noé", "Abraham", "Jacob"]),
            correctIndex: 2,
            explanation: "Isaac fue el hijo de la promesa nacido a Abraham y Sara en su vejez.",
            reference: "Génesis 21:3",
            difficulty: "EASY"
        },
        {
            question: "¿Qué mujer se casó con Jacob primero pensando que era Raquel?",
            options: JSON.stringify(["Lea", "Marta", "Zilpa", "Bila"]),
            correctIndex: 0,
            explanation: "Labán engañó a Jacob dándole a su hija mayor, Lea, en lugar de Raquel.",
            reference: "Génesis 29:23",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién interpretó los sueños del Faraón en Egipto?",
            options: JSON.stringify(["Moisés", "Daniel", "José", "Abraham"]),
            correctIndex: 2,
            explanation: "José interpretó los sueños de las siete vacas flacas y las siete espigas marchitas.",
            reference: "Génesis 41",
            difficulty: "EASY"
        },
        {
            question: "¿Qué alimento llovía del cielo para alimentar a los israelitas en el desierto?",
            options: JSON.stringify(["Pan", "Maná", "Trigo", "Codornices"]),
            correctIndex: 1,
            explanation: "El maná era como una semilla blanca que sabía a hojuelas con miel.",
            reference: "Éxodo 16:31",
            difficulty: "EASY"
        },
        {
            question: "¿Cuántas veces dio vueltas Israel a Jericó el primer día?",
            options: JSON.stringify(["Una", "Siete", "Doce", "Ninguna"]),
            correctIndex: 0,
            explanation: "Durante los primeros seis días, solo dieron una vuelta cada día.",
            reference: "Josué 6:3",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el gigante que tenía 6 dedos en cada mano y pie?",
            options: JSON.stringify(["Goliat", "Og", "Un descendiente de Rafah", "Ishbi-benob"]),
            correctIndex: 2,
            explanation: "La Biblia menciona a un hombre de gran estatura en Gat con polidactilia.",
            reference: "2 Samuel 21:20",
            difficulty: "HARD"
        },
        {
            question: "¿Quién escribió la mayor parte del libro de Proverbios?",
            options: JSON.stringify(["Salomón", "David", "Ezequías", "Lemuel"]),
            correctIndex: 0,
            explanation: "Salomón es el autor principal de los Proverbios por su gran sabiduría.",
            reference: "Proverbios 1:1",
            difficulty: "EASY"
        },
        {
            question: "¿Cuál es el nombre del lugar donde Jesús fue crucificado?",
            options: JSON.stringify(["Getsemaní", "Gólgota", "Betania", "Sinaí"]),
            correctIndex: 1,
            explanation: "Gólgota significa 'Lugar de la Calavera'.",
            reference: "Juan 19:17",
            difficulty: "EASY"
        },
        {
            question: "¿Cuántas personas se salvaron en el arca de Noé?",
            options: JSON.stringify(["2", "4", "8", "12"]),
            correctIndex: 2,
            explanation: "Se salvaron Noé, su esposa, sus tres hijos y las esposas de estos.",
            reference: "Génesis 7:13",
            difficulty: "NORMAL"
        },
        {
            question: "¿A qué apóstol se le conoce como el 'discípulo amado'?",
            options: JSON.stringify(["Pedro", "Pablo", "Juan", "Andrés"]),
            correctIndex: 2,
            explanation: "Juan se refiere a sí mismo de esta manera en su evangelio.",
            reference: "Juan 13:23",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el profeta que vio a Dios en una zarza ardiente?",
            options: JSON.stringify(["Abraham", "Moisés", "Isaías", "Samuel"]),
            correctIndex: 1,
            explanation: "Dios llamó a Moisés desde una zarza que ardía pero no se consumía.",
            reference: "Éxodo 3:2",
            difficulty: "EASY"
        },
        {
            question: "¿Qué ciudad visitó Pablo después de su conversión para ver a los apóstoles?",
            options: JSON.stringify(["Antioquía", "Roma", "Jerusalén", "Tarsis"]),
            correctIndex: 2,
            explanation: "Después de tres años en Arabia, Pablo subió a Jerusalén para conocer a Pedro.",
            reference: "Gálatas 1:18",
            difficulty: "HARD"
        },
        {
            question: "¿Cuántos años vivió Matusalén?",
            options: JSON.stringify(["800", "950", "969", "999"]),
            correctIndex: 2,
            explanation: "Matusalén es el hombre que más años vivió registrado en la Biblia.",
            reference: "Génesis 5:27",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál fue el primer nombre de Saulo de Tarso?",
            options: JSON.stringify(["Pablo", "Saulo", "Silas", "Lucas"]),
            correctIndex: 1,
            explanation: "Saulo era su nombre hebreo antes de ser conocido por su nombre griego, Pablo.",
            reference: "Hechos 13:9",
            difficulty: "EASY"
        },
        {
            question: "¿Quién era la madre de Salomón?",
            options: JSON.stringify(["Mical", "Abigail", "Betsabé", "Maaca"]),
            correctIndex: 2,
            explanation: "Betsabé fue la esposa de Urías y luego del rey David, madre de Salomón.",
            reference: "2 Samuel 12:24",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál es el libro de la Biblia famoso por sus poemas de amor?",
            options: JSON.stringify(["Salmos", "Eclesiastés", "Cantar de los Cantares", "Lamentaciones"]),
            correctIndex: 2,
            explanation: "Cantar de los Cantares es un poema lírico que celebra el amor conyugal.",
            reference: "Cantares",
            difficulty: "EASY"
        },
        {
            question: "¿Qué hizo Jesús cuando vio a los mercaderes en el templo?",
            options: JSON.stringify(["Habló con ellos", "Los expulsó con un látigo", "Les pidió limosna", "Se unió a ellos"]),
            correctIndex: 1,
            explanation: "Jesús purificó el templo diciendo que la casa de su Padre era casa de oración.",
            reference: "Juan 2:15",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el hombre que vivió en el desierto y comía langostas y miel silvestre?",
            options: JSON.stringify(["Elías", "Juan el Bautista", "Jesús", "Pablo"]),
            correctIndex: 1,
            explanation: "Juan el Bautista vivía con sencillez anunciando la llegada del Mesías.",
            reference: "Mateo 3:4",
            difficulty: "EASY"
        },
        {
            question: "¿Cuántos panes y peces usó Jesús para alimentar a los 5000?",
            options: JSON.stringify(["5 panes y 2 peces", "7 panes y 3 peces", "12 panes y 5 peces", "Un solo pan"]),
            correctIndex: 0,
            explanation: "Con solo cinco panes y dos peces de un niño, Jesús alimentó a la multitud.",
            reference: "Mateo 14:17",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el hijo de Abraham con Agar?",
            options: JSON.stringify(["Isaac", "Ismael", "Jacob", "Esaú"]),
            correctIndex: 1,
            explanation: "Ismael fue el primer hijo de Abraham, nacido de la sierva Agar.",
            reference: "Génesis 16:15",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cómo se llama el río donde Juan bautizaba?",
            options: JSON.stringify(["Nilo", "Éufrates", "Jordán", "Tigris"]),
            correctIndex: 2,
            explanation: "El Jordán es el río principal de Israel donde fue bautizado incluso Jesús.",
            reference: "Mateo 3:6",
            difficulty: "EASY"
        },
        {
            question: "¿Qué recibió Moisés de Dios en el monte Horeb?",
            options: JSON.stringify(["Las tablas de la ley", "Maná", "Agua en una roca", "Un arca"]),
            correctIndex: 0,
            explanation: "Horeb es otro nombre para el monte Sinaí, donde recibió el Decálogo.",
            reference: "Éxodo 31:18",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue la mujer que escondió a los espías de Israel en Jericó?",
            options: JSON.stringify(["Rut", "Rahab", "Ester", "Jael"]),
            correctIndex: 1,
            explanation: "Rahab ayudó a los espías y por ello ella y su familia fueron salvados.",
            reference: "Josué 2",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién escribió la mayor parte del libro de los Salmos?",
            options: JSON.stringify(["Moisés", "David", "Salomón", "Esdras"]),
            correctIndex: 1,
            explanation: "David, el 'dulce cantor de Israel', es autor de al menos 73 salmos.",
            reference: "Salmos",
            difficulty: "EASY"
        },
        {
            question: "¿Cómo se llamaba la ciudad de la que huyó Lot antes de que fuera destruida?",
            options: JSON.stringify(["Jericó", "Nínive", "Sodoma", "Babel"]),
            correctIndex: 2,
            explanation: "Lot y su familia salieron de Sodoma antes de que cayera fuego sobre ella.",
            reference: "Génesis 19",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el profeta que multiplicó el aceite de una viuda?",
            options: JSON.stringify(["Elías", "Eliseo", "Isaías", "Jeremías"]),
            correctIndex: 1,
            explanation: "Eliseo realizó este milagro para que la viuda pagara sus deudas.",
            reference: "2 Reyes 4",
            difficulty: "HARD"
        },
        {
            question: "¿Cómo llamaron los israelitas al ídolo que construyeron mientras Moisés estaba en el monte?",
            options: JSON.stringify(["Baal", "Becerro de oro", "Moloc", "Dagon"]),
            correctIndex: 1,
            explanation: "Hicieron un becerro fundido de oro y le rindieron culto.",
            reference: "Éxodo 32:4",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el apóstol que escribió tres epístolas y un evangelio?",
            options: JSON.stringify(["Pedro", "Santiago", "Juan", "Judas"]),
            correctIndex: 2,
            explanation: "Juan escribió el Evangelio de Juan y las cartas 1, 2 y 3 de Juan.",
            reference: "Nuevo Testamento",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál fue el nombre de la montaña donde Abraham iba a sacrificar a Isaac?",
            options: JSON.stringify(["Monte Sinaí", "Monte Carmelo", "Monte Moriab", "Monte de los Olivos"]),
            correctIndex: 2,
            explanation: "Dios le pidió que fuera a la tierra de Moriah para ofrecer a su hijo.",
            reference: "Génesis 22:2",
            difficulty: "HARD"
        },
        {
            question: "¿Quién fue el discípulo que pidió caminar sobre el agua con Jesús?",
            options: JSON.stringify(["Juan", "Pedro", "Felipe", "Tomás"]),
            correctIndex: 1,
            explanation: "Pedro dijo: 'Señor, si eres tú, manda que yo vaya a ti sobre las aguas'.",
            reference: "Mateo 14:28",
            difficulty: "EASY"
        },
        {
            question: "¿Cuántos capítulos tiene el Salmo 119?",
            options: JSON.stringify(["150", "176 versículos", "Sólo uno", "10"]),
            correctIndex: 1,
            explanation: "Es el capítulo más largo de la Biblia, compuesto por 176 versículos.",
            reference: "Salmos 119",
            difficulty: "HARD"
        },
        {
            question: "¿Quién era el sacerdote que crió al profeta Samuel?",
            options: JSON.stringify(["Elí", "Aarón", "Zacarías", "Caifás"]),
            correctIndex: 0,
            explanation: "Ana entregó a Samuel al sacerdote Elí en el templo de Silo.",
            reference: "1 Samuel 1",
            difficulty: "NORMAL"
        },
        {
            question: "¿Qué ciudad visitaron los ángeles antes de destruir Sodoma?",
            options: JSON.stringify(["Betania", "Hebrón", "Sodoma", "Belén"]),
            correctIndex: 2,
            explanation: "Dos ángeles llegaron a Sodoma a la caída de la tarde para rescatar a Lot.",
            reference: "Génesis 19:1",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el rey que vio una mano escribiendo en la pared?",
            options: JSON.stringify(["Nabucodonosor", "Belsasar", "Darío", "Ciro"]),
            correctIndex: 1,
            explanation: "Belsasar vio la escritura 'Mene, Mene, Tequel, Uparsin'.",
            reference: "Daniel 5",
            difficulty: "HARD"
        },
        {
            question: "¿Quién fue la madre de Samuel?",
            options: JSON.stringify(["Ana", "Penina", "Isabel", "Marta"]),
            correctIndex: 0,
            explanation: "Ana oró fervientemente a Dios por un hijo y prometió dedicarlo a Él.",
            reference: "1 Samuel 1",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál es el libro de la Biblia después del libro de Job?",
            options: JSON.stringify(["Proverbios", "Eclesiastés", "Salmos", "Cantares"]),
            correctIndex: 2,
            explanation: "El orden es Esdrás, Nehemías, Ester, Job, Salmos...",
            reference: "Biblia",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién anunció el nacimiento de Jesús a María?",
            options: JSON.stringify(["Miguel", "Gabriel", "Rafael", "Un ángel sin nombre"]),
            correctIndex: 1,
            explanation: "El ángel Gabriel fue enviado por Dios a Nazaret.",
            reference: "Lucas 1:26",
            difficulty: "EASY"
        },
        {
            question: "¿Qué prenda de vestir tenía Juan el Bautista?",
            options: JSON.stringify(["Una túnica de lino", "Ropa de pelo de camello", "Serape de lana", "Piel de cordero"]),
            correctIndex: 1,
            explanation: "Juan vestía ropa de pelo de camello y un cinto de cuero.",
            reference: "Mateo 3:4",
            difficulty: "NORMAL"
        },
        {
            question: "¿Qué milagro hizo Jesús por un hombre que había nacido ciego?",
            options: JSON.stringify(["Puso saliva en sus ojos", "Le dijo que se lavara en Siloé", "Ambas son correctas", "Sólo oró por él"]),
            correctIndex: 2,
            explanation: "Hizo lodo con saliva, lo puso en sus ojos y le mandó lavarse en el estanque de Siloé.",
            reference: "Juan 9",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cómo llamaban los discípulos a Jesús frecuentemente?",
            options: JSON.stringify(["Amigo", "Maestro (Rabí)", "Rey", "Profeta"]),
            correctIndex: 1,
            explanation: "Rabí es un término hebreo para Maestro.",
            reference: "Biblia",
            difficulty: "EASY"
        },
        {
            question: "¿Quién fue el autor del libro de Eclesiastés según la tradición?",
            options: JSON.stringify(["David", "Salomón", "Isaías", "Moisés"]),
            correctIndex: 1,
            explanation: "El autor se identifica como el predicador, hijo de David, rey en Jerusalén.",
            reference: "Eclesiastés 1:1",
            difficulty: "HARD"
        },
        {
            question: "¿Quiénes fueron los dos espías que trajeron un buen reporte de Canaán?",
            options: JSON.stringify(["Josué y Caleb", "Moisés y Aarón", "Pedro y Juan", "Santiago y Mateo"]),
            correctIndex: 0,
            explanation: "Solo ellos dos confiaron en que Dios les daría la tierra a pesar de los gigantes.",
            reference: "Números 14:6",
            difficulty: "NORMAL"
        },
        {
            question: "¿Cuál es el último versículo de la Biblia, en qué libro está?",
            options: JSON.stringify(["Apocalipsis", "Mateo", "Judas", "Hebreos"]),
            correctIndex: 0,
            explanation: "Termina con: 'La gracia de nuestro Señor Jesucristo sea con todos vosotros. Amén'.",
            reference: "Apocalipsis 22:21",
            difficulty: "EASY"
        },
        {
            question: "¿Qué animal habló a Balaam para advertirle en el camino?",
            options: JSON.stringify(["Un león", "Una burra", "Una serpiente", "Un águila"]),
            correctIndex: 1,
            explanation: "Dios abrió la boca de la burra para que hablara a Balaam cuando este fue enviado a maldecir a Israel.",
            reference: "Números 22:28",
            difficulty: "HARD"
        },
        {
            question: "¿Cuál es el último libro del Antiguo Testamento?",
            options: JSON.stringify(["Zacarías", "Malaquías", "Joel", "Amós"]),
            correctIndex: 1,
            explanation: "Malaquías cierra el canon del Antiguo Testamento con profecías sobre el día del Señor.",
            reference: "Biblia",
            difficulty: "NORMAL"
        },
        {
            question: "¿Quién fue el primer hombre creado por Dios?",
            options: JSON.stringify(["Caín", "Abel", "Set", "Adán"]),
            correctIndex: 3,
            explanation: "Adán fue formado del polvo de la tierra y Dios sopló en él aliento de vida.",
            reference: "Génesis 2:7",
            difficulty: "EASY"
        },
        {
            question: "¿A quién resucitó Jesús después de llevar cuatro días muerto?",
            options: JSON.stringify(["La hija de Jairo", "El hijo de la viuda", "Lázaro", "Tabita"]),
            correctIndex: 2,
            explanation: "A pesar de llevar cuatro días en la tumba, Jesús llamó a Lázaro fuera y este resucitó.",
            reference: "Juan 11",
            difficulty: "NORMAL"
        }
    ];

    for (const q of triviaQuestions) {
        await prismaAny.triviaQuestion.upsert({
            where: { id: `trivia-${triviaQuestions.indexOf(q)}` }, // deterministic ID for seeding
            update: {
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                reference: q.reference,
                difficulty: q.difficulty
            },
            create: {
                id: `trivia-${triviaQuestions.indexOf(q)}`,
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                reference: q.reference,
                difficulty: q.difficulty
            }
        });
    }

    console.log(`✅ ${triviaQuestions.length} Trivia Questions seeded`)

    // --- STRUGGLE PLANS ---
    console.log('🛡️ Seeding Struggle Plans...')
    const strugglePlans = [
        {
            title: "Lectura Bíblica",
            description: "Plan de 7 días: Conexión Vital. Descubre el poder de la Palabra de Dios para transformar tu mente y fortalecer tu espíritu.",
            days: [
                {
                    dayNumber: 1,
                    title: "Más que Papel y Tinta",
                    bibleStudy: "La Biblia no es un libro común; es la voz de Dios escrita. No leemos para 'saber más', sino para conocer a Alguien. Hoy, pídele a Dios que abra tus ojos espirituales mientras lees.",
                    practicalExercise: "Encuentra un lugar tranquilo, sin distracciones, y lee el primer capítulo de Juan. Escribe un versículo que te llame la atención.",
                    youthAdvice: "¿Sabías que la Biblia es el único libro donde el Autor está presente cuando lo lees? ¡Aprovéchalo!",
                    reflectionQuestions: "¿Qué espero encontrar en la Biblia esta semana?",
                    scripture: "Juan 1:1-5"
                },
                {
                    dayNumber: 2,
                    title: "Lámpara a mis Pies",
                    bibleStudy: "En un mundo confuso, la Biblia es tu GPS espiritual. No te da todo el mapa de tu vida, pero sí la luz para el siguiente paso. Confía en Su dirección hoy.",
                    practicalExercise: "Hoy, antes de tomar una decisión (pequeña o grande), busca un versículo relacionado o simplemente pide sabiduría basada en lo que conoces de la Palabra.",
                    youthAdvice: "Si no sabes qué hacer con tu vida, empieza leyendo el manual del Fabricante.",
                    reflectionQuestions: "¿En qué área de mi vida necesito la luz de Dios hoy?",
                    scripture: "Salmo 119:105"
                },
                {
                    dayNumber: 3,
                    title: "Alimento para el Alma",
                    bibleStudy: "Tu espíritu necesita comer tanto como tu cuerpo. La Palabra es el 'pan de vida'. Si te sientes débil espiritualmente, revisa tu dieta: ¿estás consumiendo suficiente Biblia?",
                    practicalExercise: "Ayuno de Medios. Cambia 30 minutos de redes sociales por 30 minutos de lectura profunda hoy. Nota la diferencia en tu paz mental.",
                    youthAdvice: "No puedes pelear batallas de nivel 10 con una alimentación espiritual de nivel 1. ¡Come bien!",
                    reflectionQuestions: "¿Me siento nutrido o hambriento espiritualmente?",
                    scripture: "Mateo 4:4"
                },
                {
                    dayNumber: 4,
                    title: "Espada de doble Filo",
                    bibleStudy: "La Biblia corta la mentira y revela la verdad. A veces duele porque confronta nuestro pecado, pero es para sanarnos. Deja que la Palabra examine tus intenciones hoy.",
                    practicalExercise: "Examen de Corazón. Al leer hoy, pregunta: 'Señor, ¿hay algo en lo que estoy fallando que Tu Palabra me muestra?'. Sé honesto contigo mismo.",
                    youthAdvice: "La Biblia no es para golpear a otros, es para dejar que Dios trabaje en ti.",
                    reflectionQuestions: "¿Qué 'mentira' del mundo ha desmentido la Biblia hoy?",
                    scripture: "Hebreos 4:12"
                },
                {
                    dayNumber: 5,
                    title: "Espejo del Corazón",
                    bibleStudy: "La Palabra nos muestra quiénes somos realmente y quiénes podemos llegar a ser en Cristo. No olvides lo que ves en el espejo; actúa según la verdad que Dios te muestra.",
                    practicalExercise: "Acción Inmediata. Elige una enseñanza práctica que leas hoy y ponla en práctica antes de que termine el día. No seas solo un oidor.",
                    youthAdvice: "Tu identidad no la define Instagram, la define lo que Dios dice de ti en Su libro.",
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
                    bibleStudy: "Vivimos estresados porque queremos ser el GPS de nuestra vida. La ansiedad es el humo que sale when intentas controlar cosas que solo le pertenecen a Dios. ¡Relájate, tu Padre alimenta a los pájaros y ellos no tienen cuenta de ahorro!",
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

    for (const plan of strugglePlans) {
        const createdPlan = await prismaAny.strugglePlan.upsert({
            where: { title: plan.title },
            update: { description: plan.description },
            create: {
                title: plan.title,
                description: plan.description,
            },
        });

        for (const day of plan.days) {
            await prismaAny.strugglePlanDay.upsert({
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

    console.log(`✅ ${strugglePlans.length} Struggle Plans seeded`)

    // --- SONGS ---
    console.log('🎵 Seeding Songs...')
    const songsList = [
        {
            id: "local-song-1",
            title: "1000 Pedazos",
            artist: "Un Corazón",
            url: "/music/1000-pedazos.mp3",
            category: "Adoración",
        },
        {
            id: "local-song-2",
            title: "Trust In God",
            artist: "Elevation Worship",
            url: "/music/trust-in-god.mp3",
            category: "Confianza",
        },
        {
            id: "local-song-3",
            title: "Solo Hay Uno",
            artist: "Joel Rocco ft. Enoc Parra",
            url: "/music/solo-hay-uno.mp3",
            category: "Adoración",
        },
        {
            id: "local-song-4",
            title: "Los Brazos de Papá",
            artist: "Grupo Grace ft. OASIS MINISTRY",
            url: "/music/brazos-de-papa.mp3",
            category: "Consuelo",
        }
    ];

    for (const song of songsList) {
        await prismaAny.song.upsert({
            where: { id: song.id },
            update: song,
            create: song,
        });
    }
    console.log(`✅ ${songsList.length} Songs seeded`)

    console.log('🌳 Database seed completed')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

