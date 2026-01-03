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
        { name: 'Conecta+', description: '¡Danos tu opinión! Valoraciones, preguntas y sugerencias sobre la app.', icon: '📱' },
        { name: 'Testimonios', description: 'Comparte lo que Dios ha hecho en tu vida. ¡Tu historia inspira!', icon: '✨' },
        { name: 'Ansiedad y Estrés', description: 'Encuentra paz y apoyo en momentos de ansiedad.', icon: '😰' },
        { name: 'Depresión y Tristeza', description: 'Un lugar seguro para caminar juntos en la oscuridad.', icon: '😔' },
        { name: 'Lujuria y Tentación', description: 'Venciendo la tentación y recuperando la pureza en Cristo.', icon: '💪' },
        { name: 'Adicciones', description: 'Libertad y apoyo para romper cadenas de adicción.', icon: '🚫' },
        { name: 'Relaciones y Familia', description: 'Consejos y apoyo para sanar vínculos y amistades.', icon: '❤️' },
        { name: 'Mentira y Honestidad', description: 'Caminando en la verdad y la integridad diaria.', icon: '🤐' },
        { name: 'Orgullo y Humildad', description: 'Buscando un corazón humilde como el de Jesús.', icon: '🙏' },
        { name: 'Enojo e Ira', description: 'Dominio propio y sanidad para el corazón herido.', icon: '💢' },
        { name: 'Soledad y Propósito', description: 'Descubriendo quién eres en Dios cuando te sientes solo.', icon: '🧭' },
        { name: 'Dudas de Fe', description: 'Preguntas honestas sobre la Biblia y el caminar cristiano.', icon: '❓' },
        { name: 'Oración', description: 'Deja tus peticiones y oremos unos por otros.', icon: '🕊️' },
    ];

    for (const category of forumCategories) {
        await prismaAny.forumCategory.upsert({
            where: { name: category.name },
            update: category,
            create: category,
        });
    }

    console.log(`✅ ${forumCategories.length} Forum Categories seeded`)

    // --- TRIVIA QUESTIONS ---
    console.log('🎮 Seeding Trivia Questions...')
    await prismaAny.triviaQuestion.deleteMany({});
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
            title: "Lujuria / Pornografía",
            description: "Plan de 21 días: Venciendo en la Mente. Una guía práctica y espiritual para recuperar tu libertad y pureza en Cristo.",
            days: [
                {
                    dayNumber: 1,
                    title: "El Despertar del Guerrero",
                    bibleStudy: "La batalla por la pureza no comienza en los ojos, sino en la identidad. Eres un guerrero de Dios, llamado a la libertad. El primer paso es reconocer que no fuiste diseñado para la esclavitud, sino para la gloria. La pornografía es un espejismo que promete saciar tu sed pero solo te deja más desierto. Hoy, Dios te llama a levantarte.",
                    practicalExercise: "Borra cualquier historial, aplicación o cuenta que sea piedra de tropiezo hoy mismo. No dejes 'puertas traseras' abiertas.",
                    youthAdvice: "No intentes ganar esta guerra solo. El orgullo dice 'puedo solo', la sabiduría dice 'necesito ayuda'. Busca a un mentor o amigo de confianza hoy.",
                    reflectionQuestions: "¿Qué es lo que realmente buscas cuando cedes a la tentación? ¿Amor, aceptación, escape? Cuéntaselo a Dios.",
                    scripture: "1 Corintios 10:13"
                },
                {
                    dayNumber: 2,
                    title: "La Mentira del Placer Fugaz",
                    bibleStudy: "El pecado siempre promete libertad pero entrega cadenas. El placer momentáneo no vale tu paz eterna ni tu integridad. Entender que el pecado es un fraude es vital para vencerlo. El enemigo te muestra el anzuelo, pero Dios te muestra el hilo y el dolor que viene después. Elige la paz duradera sobre el placer efímero.",
                    practicalExercise: "Instala un filtro de contenido en todos tus dispositivos. Haz que el acceso a lo malo sea difícil y el acceso a lo bueno sea fácil.",
                    youthAdvice: "La tentación no es pecado, es una invitación. Ceder es lo que te daña. Mantén la guardia alta y no te castigues por sentir la presión, úsala para correr a Dios.",
                    reflectionQuestions: "¿Cómo te sientes realmente 5 minutos después de caer? Guarda esa memoria para cuando la tentación vuelva.",
                    scripture: "Gálatas 5:1"
                },
                {
                    dayNumber: 3,
                    title: "El Poder de la Mirada",
                    bibleStudy: "Tus ojos son la lámpara de tu cuerpo. Lo que dejas entrar determina tu luz o tu oscuridad. Jesús fue radical: si tu ojo te hace caer, sácalo. No hablaba de mutilación física, sino de una determinación radical de no mirar lo que nos destruye. Aprender a disciplinar la mirada es aprender a proteger el alma.",
                    practicalExercise: "Aplica la 'regla de los 2 segundos': si ves algo inapropiado involuntariamente, desvía la mirada en menos de 2 segundos. No dejes que la imagen eche raíces.",
                    youthAdvice: "No alimentes al lobo que quieres matar. Si quieres vencer la lujuria, deja de darle comida visual.",
                    reflectionQuestions: "¿Qué contenido estás consumiendo (series, redes) que debilita tu resistencia espiritual aunque no sea pornografía explícita?",
                    scripture: "Mateo 6:22-23"
                },
                {
                    dayNumber: 4,
                    title: "Cuidando las Puertas del Corazón",
                    bibleStudy: "Sobre toda cosa guardada, guarda tu corazón. La pureza empieza en lo que amas y valoras. Si llenas tu corazón con el amor de Dios, el espacio para la basura del mundo se reduce. No se trata solo de dejar lo malo, sino de apasionarse por lo bueno. Tu corazón es el centro de mando de tu vida.",
                    practicalExercise: "Escribe una lista de 5 razones profundas por las que quieres ser libre (por Dios, por tu futura familia, por tu paz, etc.).",
                    youthAdvice: "Tu corazón es un tesoro de valor infinito. No dejes que el enemigo lo use como basurero.",
                    reflectionQuestions: "¿Qué áreas de tu corazón están descuidadas y necesitan el amor sanador de Jesús?",
                    scripture: "Proverbios 4:23"
                },
                {
                    dayNumber: 5,
                    title: "La Trampa de la Soledad",
                    bibleStudy: "El enemigo ataca cuando estamos solos, cansados o aburridos. La comunidad es tu escudo. Dios no nos hizo para ser llaneros solitarios de la fe. En la oscuridad del aislamiento, los pecados crecen; en la luz de la comunión, se mueren. Rodéate de gente que ame a Dios tanto como tú.",
                    practicalExercise: "Llama o escribe a un amigo hoy para saber cómo está. Invierte en relaciones reales y saludables.",
                    youthAdvice: "La soledad es el taller favorito del diablo. Si estás solo y tentado, ¡sal de tu habitación ahora mismo!",
                    reflectionQuestions: "¿En qué momentos del día te sientes más vulnerable? Planea actividades para esos momentos.",
                    scripture: "Eclesiastés 4:9-10"
                },
                {
                    dayNumber: 6,
                    title: "Identidad vs Esclavitud",
                    bibleStudy: "Ya no eres esclavo del temor ni del deseo desordenado, eres hijo de Dios. Tu pecado no define quién eres. El enemigo quiere que pienses 'soy un adicto', pero Dios te dice 'eres mi hijo redimido'. Camina según tu nuevo ADN espiritual, no según tus viejas debilidades.",
                    practicalExercise: "Mírate al espejo y declara con convicción: 'Soy un hijo amado de Dios, comprado por la sangre de Cristo, y el pecado no tiene señorío sobre mí'.",
                    youthAdvice: "Tu pasado está bajo la sangre de Jesús. No dejes que el enemigo te cobre una deuda que Cristo ya pagó.",
                    reflectionQuestions: "¿Te ves a ti mismo como un pecador que intenta ser santo o como un santo que a veces lucha con el pecado?",
                    scripture: "Romanos 8:1"
                },
                {
                    dayNumber: 7,
                    title: "El Valor de la Batalla",
                    bibleStudy: "Has completado una semana. ¡Felicidades! El camino hacia la libertad total es un maratón, no un sprint. Dios se alegra en cada paso que das hacia la luz. No te canses de hacer el bien, porque a su tiempo segarás si no desmayas. La perseverancia es la clave de la victoria.",
                    practicalExercise: "Revisa tus victorias de esta semana y dale gracias a Dios por cada momento que dijiste 'no' a la tentación.",
                    youthAdvice: "Cada día de victoria es un músculo espiritual que se fortalece. ¡Eres más fuerte de lo que eras hace 7 días!",
                    reflectionQuestions: "¿Qué ha sido lo más difícil de esta semana y cómo te ayudó Dios a superarlo?",
                    scripture: "2 Timoteo 4:7"
                },
                {
                    dayNumber: 8,
                    title: "Renovando la Mente",
                    bibleStudy: "La transformación real viene por renovar nuestra manera de pensar. Si metes basura, sale basura. Si metes la Palabra, sale vida. No puedes evitar que los pensamientos vengan, pero sí puedes elegir cuáles se quedan. Llena tu mente con verdades eternas que desplacen las mentiras del mundo.",
                    practicalExercise: "Memoriza Filipenses 4:8 hoy y úsalo como filtro para cada pensamiento que cruce tu mente.",
                    youthAdvice: "Lo que piensas en secreto hoy es lo que harás en público mañana. Cuida tu taller mental.",
                    reflectionQuestions: "¿Qué mentiras sobre la sexualidad y el placer has dejado que vivan en tu mente?",
                    scripture: "Romanos 12:2"
                },
                {
                    dayNumber: 9,
                    title: "Huyendo como José",
                    bibleStudy: "A veces la victoria no es quedarse a pelear, sino tener la sabiduría de huir. José no se puso a dialogar con la tentación, él corrió. Hay situaciones donde lo más valiente que puedes hacer es dar media vuelta y salir de ahí. No pongas a prueba tu fuerza, pon a prueba tu sabiduría.",
                    practicalExercise: "Establece un 'plan de escape': si sientes que la tentación sube, levántate, deja el celular y vete a un lugar público o con gente.",
                    youthAdvice: "No intentes ser el héroe contra la tentación sexual; sé el atleta que corre más rápido que ella.",
                    reflectionQuestions: "¿En qué situaciones o lugares estás siendo demasiado confiado y deberías empezar a huir?",
                    scripture: "Génesis 39:12"
                },
                {
                    dayNumber: 10,
                    title: "Círculos de Confianza",
                    bibleStudy: "La confesión trae sanidad. Traer el pecado a la luz le quita su poder oculto. El pecado florece en el secreto y se marchita en la transparencia. Cuando compartes tu lucha con alguien maduro en la fe, la carga se divide y la gracia se multiplica.",
                    practicalExercise: "Si has caído o estás muy tentado, confiésalo hoy mismo a tu mentor o amigo de confianza. No esperes a mañana.",
                    youthAdvice: "El secreto es el oxígeno del pecado. Si lo cuentas, le quitas el aire. ¡Sé valiente y habla!",
                    reflectionQuestions: "¿Qué es lo que más te asusta de que alguien sepa tu lucha real? ¿Es orgullo o miedo?",
                    scripture: "Santiago 5:16"
                },
                {
                    dayNumber: 11,
                    title: "La Gracia que Restaura",
                    bibleStudy: "Si caíste, no te quedes en el suelo pensando que todo se terminó. La gracia de Dios es más grande que tu fracaso. El justo cae siete veces, pero se vuelve a levantar. El enemigo quiere que la culpa te paralice, pero Dios quiere que Su perdón te movilice. Arrepiéntete, recíbela y sigue caminando.",
                    practicalExercise: "Si has tenido un tropiezo, pide perdón sinceramente, recibe la limpieza de Cristo y anota: 'Hoy empiezo de nuevo por Su gracia'.",
                    youthAdvice: "La diferencia entre un vencedor y un derrotado es que el vencedor se levantó una vez más. ¡No te rindas!",
                    reflectionQuestions: "¿Te cuesta aceptar que Dios te perdona totalmente? ¿Por qué intentas pagar tú una deuda que Cristo ya pagó?",
                    scripture: "Proverbios 24:16"
                },
                {
                    dayNumber: 12,
                    title: "Neurociencia y Pureza",
                    bibleStudy: "Dios diseñó tu cerebro de manera asombrosa. El consumo de pornografía crea 'caminos' neuronales destructivos, pero la plasticidad cerebral permite crear rutas nuevas de pureza a través de la obediencia. Cristo no solo sana tu alma, también renueva tu mente y tus procesos biológicos. Eres una obra maestra en reconstrucción.",
                    practicalExercise: "Realiza 30 minutos de ejercicio intenso hoy. Ayuda a equilibrar tu dopamina y fortalece tu voluntad física.",
                    youthAdvice: "Tu cerebro puede reprogramarse. Cada vez que vences una tentación, estás construyendo una 'autopista de libertad' en tu cabeza.",
                    reflectionQuestions: "¿Cómo notas que tu capacidad de concentrarte y valorar a las personas ha cambiado con este plan?",
                    scripture: "Salmos 139:14"
                },
                {
                    dayNumber: 13,
                    title: "Dominio Propio: Fruto, no Esfuerzo",
                    bibleStudy: "El dominio propio es un fruto del Espíritu Santo, no solo un producto de tu fuerza de voluntad. Si intentes controlarte solo, te agotarás. Si dejas que el Espíritu gobierne, Él te dará el poder de decir 'no' con paz. Conéctate a la Vid para que el fruto crezca naturalmente.",
                    practicalExercise: "Hoy, practica el dominio propio en algo pequeño: no comas ese postre, deja el celular un rato, levántate a la primera. Entrena tu voluntad.",
                    youthAdvice: "Tú eres el jinete, no el caballo. No dejes que tus impulsos te lleven a donde no quieres ir.",
                    reflectionQuestions: "¿En qué momentos del día sientes que el Espíritu Santo te está avisando que te detengas?",
                    scripture: "2 Timoteo 1:7"
                },
                {
                    dayNumber: 14,
                    title: "El Dios que te ve con Amor",
                    bibleStudy: "Dios te ve en lo secreto, pero no como un policía buscando atraparte, sino como un Padre que quiere protegerte. Su presencia no es una amenaza, es un refugio. Vivir ante Sus ojos es vivir en la seguridad de Su amor. Él sabe por lo que pasas y está a tu lado en la trinchera.",
                    practicalExercise: "Pasa 10 minutos hoy simplemente imaginando a Jesús a tu lado en tu habitación. Habla con Él como con tu mejor amigo.",
                    youthAdvice: "Si recordaras que Jesús es el espectador de tu vida, muchas tentaciones perderían su fuerza. Él está ahí y te ama.",
                    reflectionQuestions: "¿Te sientes cómodo o incómodo con la idea de que Dios te ve en todo momento?",
                    scripture: "Salmos 33:13"
                },
                {
                    dayNumber: 15,
                    title: "Venciendo el Aburrimiento",
                    bibleStudy: "La ociosidad es el terreno donde crecen las tentaciones. David cayó con Betsabé cuando debía estar en la guerra pero se quedó en casa sin hacer nada. Mantén tu vida llena de propósito y actividades que edifiquen. Una mente ocupada en el Reino tiene poco espacio para los ataques del enemigo.",
                    practicalExercise: "Busca un nuevo proyecto, hobby o servicio en tu iglesia hoy. Llena tus horas muertas con algo que te apasione y de gloria a Dios.",
                    youthAdvice: "Si no tienes nada que hacer, inventa algo bueno. La flojera es la mejor amiga de la lujuria.",
                    reflectionQuestions: "¿Qué haces en tus 'tiempos muertos'? ¿Cómo podrías redimirlos para Dios?",
                    scripture: "Efesios 5:15-16"
                },
                {
                    dayNumber: 16,
                    title: "La Belleza de la Paciencia",
                    bibleStudy: "La pornografía ofrece gratificación instantánea, pero vacía. Dios ofrece satisfacción duradera, pero requiere espera. Aprender a esperar es parte de la madurez cristiana. No cambies la bendición de toda una vida por un momento de placer robado. Lo que vale la pena, toma tiempo.",
                    practicalExercise: "Retrasa hoy una recompensa inmediata (comida, juego, compra) y dedica ese tiempo a orar. Practica la cultura de la espera.",
                    youthAdvice: "El mundo te dice 'hazlo ya', Dios te dice 'espera lo mejor'. Hazle caso al Diseñador.",
                    reflectionQuestions: "¿Eres demasiado impaciente con tu proceso de santificación? Recuerda que Dios no tiene prisa, tiene un plan.",
                    scripture: "Lamentaciones 3:25"
                },
                {
                    dayNumber: 17,
                    title: "Pureza en las Redes Sociales",
                    bibleStudy: "El algoritmo de las redes sociales no es neutral; a menudo está diseñado para explotar tus debilidades. Sé intencional con lo que sigues. Si un perfil, aunque no sea porno, te genera pensamientos de lujuria, es una trampa. Corta radicalmente con lo que te contamina la mirada.",
                    practicalExercise: "Haz un 'unfollow rush' hoy. Deja de seguir cualquier cuenta que sea un gatillo para tu tentación. Sin excusas.",
                    youthAdvice: "Tu feed de Instagram debe ser un reflejo de tu deseo de santidad, no un catálogo de tentaciones.",
                    reflectionQuestions: "¿Qué aplicación es la que más te hace tropezar? ¿Estás dispuesto a borrarla si es necesario?",
                    scripture: "Salmos 101:3"
                },
                {
                    dayNumber: 18,
                    title: "Cuidando tus Pensamientos Fantasiosos",
                    bibleStudy: "La batalla se pierde o se gana en el diálogo interno. No puedes evitar que un pensamiento pase volando, pero sí puedes evitar que haga nido en tu cabeza. Captura cada pensamiento y llévalo cautivo a la obediencia de Cristo. Tú tienes la autoridad para cambiar de canal en tu mente.",
                    practicalExercise: "Cada vez que venga una fantasía, repite en voz alta: 'Este pensamiento no me pertenece, soy de Cristo' y ponte a hacer una actividad física.",
                    youthAdvice: "No juegues con fuego en tu imaginación y esperes que tu cuerpo no se queme. Limpia tu cine mental.",
                    reflectionQuestions: "¿A qué historias o fantasías les das permiso de quedarse a vivir en tu cabeza?",
                    scripture: "2 Corintios 10:5"
                },
                {
                    dayNumber: 19,
                    title: "Sexualidad con Propósito Sagrado",
                    bibleStudy: "El sexo no es malo; es tan bueno que Dios lo puso dentro de un pacto de amor y compromiso absoluto: el matrimonio. La pornografía es una distorsión barata de un regalo divino. Honra tu futura sexualidad (o la actual) viviendo en integridad hoy. Prepárate para amar de verdad, no para consumir personas.",
                    practicalExercise: "Escribe una oración por tu futuro cónyuge (o el actual), pidiendo a Dios que te ayude a llegar a ese encuentro con un corazón puro.",
                    youthAdvice: "No desperdicies hoy la capacidad de asombro y entrega que Dios te dio para tu matrimonio.",
                    reflectionQuestions: "¿Ves a las personas como objetos para tu placer o como seres creados a imagen de Dios?",
                    scripture: "Hebreos 13:4"
                },
                {
                    dayNumber: 20,
                    title: "Un Estilo de Vida de Santidad",
                    bibleStudy: "La santidad no es una meta que alcanzas y ya, es un camino diario de amistad con Jesús. No se trata de cumplir reglas, sino de no querer lastimar el corazón de Alguien que te ama tanto. Cuando te enamoras de Dios, las atracciones del pecado pierden su brillo. La santidad es el camino del gozo máximo.",
                    practicalExercise: "Tómate un tiempo hoy para enumerar cómo tu vida ha mejorado en estos 20 días. ¿Qué nuevas libertades sientes?",
                    youthAdvice: "No vivas para 'no pecar', vive para 'amar a Jesús'. El amor es el motor más fuerte que existe.",
                    reflectionQuestions: "¿Qué te motiva más hoy: el miedo al castigo o el deseo de agradar a Dios?",
                    scripture: "1 Tesalonicenses 4:3-4"
                },
                {
                    dayNumber: 21,
                    title: "Victoria Completa en Cristo",
                    bibleStudy: "¡Felicidades, guerrero! Has completado 21 días de enfoque radical. No eres el mismo que empezó. Cristo ha vencido en ti y te ha dado las herramientas para seguir ganando. Esto no es el final de la lucha, pero sí es el inicio de una vida caminando en libertad real. Mantente alerta y sigue brillando.",
                    practicalExercise: "Firma hoy un 'Pacto de Pureza' contigo mismo y con Dios. Escribe tu testimonio de estas 3 semanas para recordarlo cuando vengan días difíciles.",
                    youthAdvice: "Has demostrado que con Dios es posible. ¡No vuelvas atrás! El mundo necesita jóvenes libres y encendidos por Su Espíritu.",
                    reflectionQuestions: "¿Cuál fue el momento de mayor victoria en estos 21 días? ¿Qué harás para mantener este fuego encendido?",
                    scripture: "1 Corintios 15:57"
                }
            ]
        },
        {
            title: "Ansiedad / Estrés",
            description: "Plan de 21 días: Calma en el Caos. Una guía profunda para navegar las tormentas de la mente con la paz de Dios.",
            days: [
                {
                    dayNumber: 1,
                    title: "El Mito del Control",
                    bibleStudy: "Vivimos estresados porque queremos ser el GPS de nuestra vida. La ansiedad es el humo que sale cuando intentas controlar cosas que solo le pertenecen a Dios. Dios te llama a confiar en Su soberanía. Si Él cuida de las flores que hoy están y mañana no, ¿cuánto más cuidará de ti?",
                    practicalExercise: "Escribe todo lo que te quita el sueño hoy. Luego, ora entregando cada punto a Dios y rompe el papel como símbolo de que ya no es tu carga.",
                    youthAdvice: "Vive en 'modo un día a la vez'. Dios te da batería de gracia para 24 horas, no para el próximo mes. Úsala bien hoy.",
                    reflectionQuestions: "¿Por qué te asusta tanto soltar el control y dejar que Dios sea el que dirija tu camino?",
                    scripture: "Mateo 6:25-34"
                },
                {
                    dayNumber: 2,
                    title: "La Paz es una Persona",
                    bibleStudy: "La paz de Dios no es un sentimiento zen ni la ausencia de problemas; es la presencia de una Persona: Jesús. Él es el Príncipe de Paz. No busques la paz como un producto, busca a Jesús y la paz vendrá con Él. En medio de la tormenta, Él sigue en la barca.",
                    practicalExercise: "Pasa 5 minutos en total silencio, solo repitiendo el nombre de Jesús y pidiéndole que llene tu habitación con Su presencia real.",
                    youthAdvice: "La paz no se fabrica, se recibe. No te esfuerces por 'sentirte tranquilo', deja que Él te tranquilice.",
                    reflectionQuestions: "¿Estás buscando paz en tus resultados, en tu dinero o en la presencia de Jesús?",
                    scripture: "Juan 14:27"
                },
                {
                    dayNumber: 3,
                    title: "Cuidado con el Mañana",
                    bibleStudy: "Jesús fue drástico: 'Basta a cada día su propio mal'. El 90% de las cosas que te angustian del futuro nunca pasarán. No pagues intereses emocionales por un problema que aún no ha llegado. Dios tiene la provisión lista para tus necesidades de mañana, pero te la dará mañana.",
                    practicalExercise: "Cada vez que pienses en '¿qué pasará si...?', cámbialo por 'Dios estará ahí cuando...'. Re-entrena tu cerebro para confiar.",
                    youthAdvice: "No puedes pelear las batallas de mañana con las fuerzas de hoy. Enfócate al 100% en lo que tienes frente a ti hoy.",
                    reflectionQuestions: "¿Qué tragedia imaginaria estás viviendo en tu mente que te está robando el gozo de este día?",
                    scripture: "Mateo 6:34"
                },
                {
                    dayNumber: 4,
                    title: "La Oración como Antídoto Real",
                    bibleStudy: "Filipenses nos da la receta: por nada estéis afanosos, sino presentad vuestras peticiones con acción de gracias. Cuando conviertes tu preocupación en oración, Dios convierte tu ansiedad en una paz que nadie puede explicar. Es un intercambio divino: tú le das tus miedos, Él te da Su calma.",
                    practicalExercise: "Haz un 'Inventario de Gratitud'. Anota 10 cosas por las que estás agradecido HOY antes de pedir nada. La gratitud es la enemiga número uno de la ansiedad.",
                    youthAdvice: "Si es lo suficientemente grande para preocuparte, es lo suficientemente grande para que lo hables con Dios. No hay detalle pequeño para Él.",
                    reflectionQuestions: "¿Cuántas veces hoy te has quejado y cuántas has dado gracias? Ese balance determina tu nivel de estrés.",
                    scripture: "Filipenses 4:6-7"
                },
                {
                    dayNumber: 5,
                    title: "Descansando en la Verdad Eterna",
                    bibleStudy: "Dios no duerme ni se toma vacaciones. Si Él está despierto manteniendo el universo en su lugar, tú puedes cerrar los ojos y dormir tranquilo. Tu ansiedad no ayuda a Dios a resolver nada, solo te agota a ti y te nubla el juicio. Confiar es descansar en que Dios es bueno y sabe lo que hace.",
                    practicalExercise: "Lee el Salmo 4 en voz alta antes de acostarte. Declara que Dios te hace vivir confiado aunque afuera haya caos.",
                    youthAdvice: "Dormir bien es un acto de fe. Es decirle a Dios: 'Señor, Tú te encargas mientras yo recargo energías'.",
                    reflectionQuestions: "¿Te sientes culpable por descansar? Recuerda que Dios diseñó el reposo como algo sagrado.",
                    scripture: "Salmo 4:8"
                },
                {
                    dayNumber: 6,
                    title: "Filtrando los Pensamientos de Luz",
                    bibleStudy: "Tu mente es un campo de batalla. Si dejas que el basurero del mundo (noticias tóxicas, chismes, comparaciones) se vacíe en ti, tendrás ansiedad. Pablo nos dice que llenemos la mente de lo verdadero, lo honesto, lo puro. Filtra tus pensamientos antes de que ellos se conviertan en tus emociones.",
                    practicalExercise: "Haz un 'Celo Digital': deja de seguir cuentas que te generen inseguridad o estrés injustificado. Elige contenido que alimente tu fe hoy.",
                    youthAdvice: "Cuida el algoritmo de tu mente. Lo que más ves es lo que más piensas. Asegúrate de que Dios sea tu tendencia número uno.",
                    reflectionQuestions: "¿Qué basura digital has consumido hoy que te ha dejado el corazón inquieto?",
                    scripture: "Filipenses 4:8"
                },
                {
                    dayNumber: 7,
                    title: "Calma en medio del Caos Vital",
                    bibleStudy: "¡Felicidades por tu primera semana! Has decidido no dejar que la ansiedad sea el capitán de tu vida. Recuerda: las tormentas vendrán, eso es parte del mundo, pero tú tienes al Calma-Tormentas en tu barca. Sigue confiando, sigue orando y sigue eligiendo la paz como tu estilo de vida.",
                    practicalExercise: "Escribe una 'Promesa de Paz' que te haya impactado esta semana y llévala contigo o ponla de fondo de pantalla.",
                    youthAdvice: "La paz no es algo que logras y ya, es una caminata con Jesús que se renueva cada mañana. ¡Vas por muy buen camino!",
                    reflectionQuestions: "¿Cómo ha cambiado tu forma de reaccionar ante los imprevistos en estos últimos 7 días?",
                    scripture: "Isaías 26:3"
                },
                {
                    dayNumber: 8,
                    title: "Identidad y Seguridad",
                    bibleStudy: "La ansiedad a menudo nace de la inseguridad sobre quiénes somos. Si crees que tu valor depende de tus éxitos, vivirás estresado. Si sabes que eres un hijo amado incondicionalmente, puedes fallar y seguir teniendo paz. Tu identidad está anclada en el cielo, no en las opiniones de la tierra.",
                    practicalExercise: "Haz una lista de 5 cosas que Dios dice de ti en Su Palabra (ej. soy Su especial tesoro). Léelas en voz alta cada vez que te sientas pequeño.",
                    youthAdvice: "No eres lo que haces, eres de Quién eres. ¡Descansa en tu apellido celestial!",
                    reflectionQuestions: "¿Qué opinión de qué persona te está robando más la paz actualmente? ¿Es más importante que la voz de Dios?",
                    scripture: "Salmos 139:13-16"
                },
                {
                    dayNumber: 9,
                    title: "El Poder de la Alabanza Radical",
                    bibleStudy: "La alabanza es una de las armas más poderosas contra la ansiedad. Alabar no es sentirte bien y cantar; es decidir que Dios es grande aunque tus problemas parezcan gigantes. Cuando adoras, tu perspectiva cambia: Dios se hace grande y tus miedos se achican.",
                    practicalExercise: "Pon tu canción de adoración favorita a todo volumen y detente solo a alabar. No pidas nada, solo reconoce lo grande que es Dios.",
                    youthAdvice: "La ansiedad te encierra en ti mismo, la adoración te abre a Dios. ¡Cambia el enfoque y siente el alivio!",
                    reflectionQuestions: "¿Puedes alabar a Dios incluso por las cosas que aún no han salido como esperas?",
                    scripture: "Habacuc 3:17-19"
                },
                {
                    dayNumber: 10,
                    title: "Cuidado con la Intoxicación de Noticias",
                    bibleStudy: "El mundo vende miedo porque el miedo genera clicks. Si pasas todo el día consumiendo tragedias y caos, tu alma lo sentirá. Dios te llama a estar informado pero no a vivir bajo el terror. Busca la Verdad que libera, no la noticia que aprisiona.",
                    practicalExercise: "Hoy, no veas noticias ni redes sociales por 4 horas seguidas. Dedica ese tiempo a leer un libro que edifique o a conversar con alguien sobre Dios.",
                    youthAdvice: "Tu cerebro no está diseñado para procesar todas las tragedias del mundo al mismo tiempo. Dale un respiro.",
                    reflectionQuestions: "¿Qué tanto de tu estrés es 'prestado' de situaciones que ni siquiera te afectan directamente?",
                    scripture: "Salmos 112:7"
                },
                {
                    dayNumber: 11,
                    title: "Gratitud: El Antídoto Químico",
                    bibleStudy: "Científicamente, el cerebro no puede sentir ansiedad y gratitud al mismo tiempo. Es un corto circuito para el miedo. Al agradecer, liberas dopamina y serotonina naturales que calman tu sistema nervioso. Dios sabía esto hace miles de años. Agradecer es medicina para el alma.",
                    practicalExercise: "Haz un 'Frasco de la Gratitud' o una lista digital de 20 cosas pequeñas que agradeces hoy (desde el café hasta el aire).",
                    youthAdvice: "Si no encuentras por qué agradecer, agradece por la salvación. Ese es el mayor regalo y nunca cambia.",
                    reflectionQuestions: "¿Sueles dar por sentadas las bendiciones diarias mientras te enfocas solo en los problemas?",
                    scripture: "1 Tesalonicenses 5:18"
                },
                {
                    dayNumber: 12,
                    title: "Tu Cuerpo es el Templo",
                    bibleStudy: "A veces la 'ansiedad espiritual' es simplemente falta de cuidado físico. El estrés afecta tu cuerpo y tu cuerpo afecta tu mente. Dios quiere que cuides Su templo. Dormir, comer bien y moverte son actos de administración espiritual. No descuides lo que Dios te prestó.",
                    practicalExercise: "Haz algo de ejercicio hoy (camina, corre, estira) y asegúrate de beber suficiente agua. Trata a tu cuerpo con el respeto que un templo merece.",
                    youthAdvice: "A veces, lo más espiritual que puedes hacer es dormir tus horas completas. No eres un robot.",
                    reflectionQuestions: "¿Cómo has estado maltratando tu cuerpo últimamente a causa de la prisa?",
                    scripture: "1 Corintios 6:19-20"
                },
                {
                    dayNumber: 13,
                    title: "La Fuerza de la Comunidad",
                    bibleStudy: "Cargar solo una preocupación la hace pesar el doble. Dios nos dio hermanos y amigos para que nos ayuden a llevar las cargas. No tengas miedo de decir 'no estoy bien'. La vulnerabilidad es el camino a la sanidad. En la luz de la amistad, la ansiedad pierde su peso.",
                    practicalExercise: "Llama a un amigo de confianza y cuéntale sinceramente cómo vas en este plan. Deja que alguien ore por ti hoy.",
                    youthAdvice: "No seas un 'Héroe Solitario'. Hasta Moisés necesitó que alguien le sostuviera los brazos.",
                    reflectionQuestions: "¿Por qué te da tanto miedo parecer vulnerable ante los demás?",
                    scripture: "Gálatas 6:2"
                },
                {
                    dayNumber: 14,
                    title: "La Soberanía Benevolente",
                    bibleStudy: "Dios no solo es poderoso para controlar el futuro, sino que es bueno para querer lo mejor para ti. Su soberanía está unida a Su amor. Si el Rey del universo es tu Papá y te ama con pasión loca, ¿de qué tienes que preocuparte realmente? Confía en Su corazón cuando no entiendas Su mano.",
                    practicalExercise: "Lee Jeremías 29:11 y escríbelo en primera persona: 'Dios tiene planes de bien para MÍ, para darME un futuro y una esperanza'.",
                    youthAdvice: "El futuro no es un monstruo oscuro, es un terreno donde Dios ya preparó bendiciones para ti.",
                    reflectionQuestions: "¿Confías en que Dios es BUENO incluso cuando las cosas no salen como planeaste?",
                    scripture: "Romanos 8:28"
                },
                {
                    dayNumber: 15,
                    title: "Venciendo el Perfeccionismo Paralizante",
                    bibleStudy: "El estrés a menudo viene de querer ser perfectos para que Dios o los demás nos amen. La gracia dice que ya eres amado a pesar de tus imperfecciones. No tienes que hacerlo todo bien para que Dios esté orgulloso de ti. Suelta la carga de la perfección y abraza la libertad de ser un hijo en proceso.",
                    practicalExercise: "Acepta hoy un error que hayas cometido sin castigarte. Dile a Dios: 'Señor, gracias por Tu gracia sobre mi imperfección'.",
                    youthAdvice: "El perfeccionismo es el orgullo disfrazado de excelencia. Relájate, Dios es el único perfecto aquí.",
                    reflectionQuestions: "¿De quién estás intentando comprar la aprobación con tu perfeccionismo?",
                    scripture: "Salmos 103:13-14"
                },
                {
                    dayNumber: 16,
                    title: "Distinguiendo las Voces",
                    bibleStudy: "En tu mente hay muchas voces: la de tus miedos, la del mundo, la del enemigo y la de Dios. El miedo grita, la culpa acusa, pero Dios habla con un susurro de paz. Aprende a sintonizar la voz de tu Pastor. Sus ovejas conocen Su voz y no siguen a los extraños. La voz de Dios siempre trae esperanza, incluso cuando corrige.",
                    practicalExercise: "Identifica un pensamiento de hoy. ¿Trajo paz o terror? If trajo terror, no viene de Dios. Reházlo.",
                    youthAdvice: "No creas todo lo que piensas. Tu mente te puede mentir, pero la Palabra de Dios no.",
                    reflectionQuestions: "¿A qué voz le has dado el micrófono principal de tu mente hoy?",
                    scripture: "Juan 10:27"
                },
                {
                    dayNumber: 17,
                    title: "Confiando en la Incertidumbre",
                    bibleStudy: "No saber qué pasará es la esencia de la vida de fe. Abraham salió sin saber a dónde iba. La seguridad no viene de tener el mapa, sino de conocer al Guía. Puedes caminar tranquilo en la niebla si sabes Quién tiene tu mano. La incertidumbre es la oportunidad perfecta para que tu fe crezca.",
                    practicalExercise: "Hoy, ante cualquier duda del futuro, di en voz alta: 'No sé qué pasará, pero sé Quién está conmigo'.",
                    youthAdvice: "La fe es el puente sobre el abismo de lo desconocido. ¡Camina con paso firme!",
                    reflectionQuestions: "¿Qué es lo que más te aterra de no tener todas las respuestas ahora mismo?",
                    scripture: "Salmos 56:3"
                },
                {
                    dayNumber: 18,
                    title: "La Terapia del Servicio",
                    bibleStudy: "Una de las curas más rápidas para la ansiedad es dejar de mirarse el ombligo y mirar las necesidades de otros. Al servir, tus problemas recuperan su tamaño real. Dios te bendice para que seas bendición. Al vaciarte de ti mismo para llenar a otros, Dios llena tu interior con una paz profunda.",
                    practicalExercise: "Haz algo desinteresado por alguien hoy: una llamada de aliento, una ayuda económica secreta o simplemente servir en casa sin que te lo pidan.",
                    youthAdvice: "Servir es el mejor recordatorio de que no eres el centro del universo, y eso es un alivio inmenso.",
                    reflectionQuestions: "¿A quién podrías ayudar hoy que te haga olvidar tus propias preocupaciones por un momento?",
                    scripture: "Filipenses 2:4"
                },
                {
                    dayNumber: 19,
                    title: "Tu Identidad como Especial Tesoro",
                    bibleStudy: "Eres la posesión más preciada de Dios. Él pagó un precio altísimo por ti. Si fuiste tan valioso para que Él diera a Su Hijo, ¿crees que te dejará solo con tus angustias? Eres Su especial tesoro. Él pelea tus batallas por ti, incluso las que ocurren dentro de tu cabeza.",
                    practicalExercise: "Declara el Salmo 91 sobre tu vida antes de dormir. Aprópiate de cada promesa de protección y paz.",
                    youthAdvice: "No eres un error ni un accidente. Eres un diseño amado y protegido por el Todopoderoso.",
                    reflectionQuestions: "¿Te sientes realmente valioso ante los ojos de Dios hoy?",
                    scripture: "Salmos 91:1-2"
                },
                {
                    dayNumber: 20,
                    title: "Constancia en la Práctica de la Paz",
                    bibleStudy: "Has llegado muy lejos en estos 20 días. La paz no es un lugar al que llegas, es un camino que recorres a diario con Jesús. Habrá días mejores y otros más difíciles, pero la constancia vence al miedo. Mantente firme en tus disciplinas espirituales. La paz es un músculo que se entrena con la repetición.",
                    practicalExercise: "Revisa tus notas del Día 1. ¿Cómo ha cambiado tu nivel de ansiedad y tu confianza en Dios?",
                    youthAdvice: "No te relajes ahora que te sientes mejor. ¡Mantén el motor de la fe encendido!",
                    reflectionQuestions: "¿Qué nuevos hábitos de paz vas a mantener por el resto de tu vida?",
                    scripture: "Isaías 26:3"
                },
                {
                    dayNumber: 21,
                    title: "¡Libertad y Victoria Real!",
                    bibleStudy: "¡Felicidades, guerrero de la paz! Has completado 21 días de transformación mental. El caos puede seguir afuera, pero ahora tienes un santuario de paz en tu interior. Cristo ha vencido y en Él, tú también eres más que vencedor. Camina hoy con la cabeza en alto, sabiendo que el Rey de la Paz es tu mejor amigo y defensor.",
                    practicalExercise: "Escribe una 'Declaración de Victoria' y fíjala en un lugar visible. Cuéntale a alguien cómo Dios te ha dado paz en este tiempo.",
                    youthAdvice: "Este es solo el comienzo. ¡Ve y brilla en la oscuridad de este mundo estresado!",
                    reflectionQuestions: "¿Qué es lo que más agradeces de haber hecho este plan de 21 días?",
                    scripture: "Juan 14:27"
                }
            ]
        },
        {
            title: "Pereza Espiritual",
            description: "Plan de 21 días: ¡Despierta! ⚡ Saliendo de la apatía para incendiar tu propósito con el fuego de Dios.",
            days: [
                {
                    dayNumber: 1,
                    title: "Sal de la Matrix Espiritual",
                    bibleStudy: "Estar 'ni frío ni caliente' es el estado más peligroso de la fe. La pereza espiritual es como una fe zombie: haces las cosas por inercia pero tu corazón está en modo avión. Dios no te llamó para una vida gris, te llamó para incendiar el mundo. Es hora de sacudirse la modorra y volver a sentir el fuego.",
                    practicalExercise: "Shock de sistema: hoy levántate 15 minutos antes de lo normal SOLO para hablar con Dios con intensidad. Rompe la rutina de la pereza con un acto de voluntad.",
                    youthAdvice: "La motivación es un sentimiento barato que viene y va; la disciplina es un compromiso de acero. ¡Hazlo y las ganas vendrán después!",
                    reflectionQuestions: "¿En qué áreas de tu vida cristiana te has vuelto un experto en 'aparentar' sin tener vida real?",
                    scripture: "Apocalipsis 3:15-16"
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

    // Trivia already seeded in first loop

    // --- SONGS ---
    console.log('🎵 Seeding songs...')
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

