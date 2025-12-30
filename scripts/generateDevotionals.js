const fs = require('fs');

const topics = [
    { name: 'Ansiedad', image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&q=80', focus: 'la paz de Dios' },
    { name: 'Fe', image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80', focus: 'la fe' },
    { name: 'Amor', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80', focus: 'el amor' },
    { name: 'Esperanza', image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80', focus: 'la esperanza' },
    { name: 'Propósito', image: 'https://images.unsplash.com/photo-1489659639091-8b687bc4386e?auto=format&fit=crop&q=80', focus: 'tu propósito' },
    { name: 'Perdón', image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8665?auto=format&fit=crop&q=80', focus: 'el perdón' },
    { name: 'Paz', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', focus: 'la paz' },
    { name: 'Fortaleza', image: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&q=80', focus: 'la fortaleza' },
    { name: 'Oración', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80', focus: 'la oración' },
    { name: 'Gratitud', image: 'https://images.unsplash.com/photo-1507643179173-617d6c13613e?auto=format&fit=crop&q=80', focus: 'la gratitud' }
];

const verses = [
    { ref: 'Filipenses 4:13', text: 'Todo lo puedo en Cristo que me fortalece.' },
    { ref: 'Salmos 23:1', text: 'Jehová es mi pastor; nada me faltará.' },
    { ref: 'Juan 3:16', text: 'Porque de tal manera amó Dios al mundo...' },
    { ref: 'Jeremías 29:11', text: 'Porque yo sé los pensamientos que tengo acerca de vosotros...' },
    { ref: 'Isaías 41:10', text: 'No temas, porque yo estoy contigo...' },
    { ref: 'Proverbios 3:5', text: 'Fíate de Jehová de todo tu corazón...' },
    { ref: 'Mateo 11:28', text: 'Venid a mí todos los que estáis trabajados y cargados...' },
    { ref: 'Romanos 8:28', text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien...' },
    { ref: 'Josué 1:9', text: 'Mira que te mando que te esfuerces y seas valiente...' },
    { ref: 'Salmos 46:1', text: 'Dios es nuestro amparo y fortaleza...' }
];

const generateDevotionals = () => {
    let devotionals = [];
    
    for (let i = 0; i < 110; i++) {
        const topic = topics[i % topics.length];
        const verse = verses[i % verses.length];
        
        devotionals.push({
            id: (100 + i).toString(), // IDs starting from 100 to avoid conflict
            title: `${topic.name}: Día ${Math.floor(i / topics.length) + 1}`,
            category: topic.name,
            time: `${3 + (i % 3)} min`,
            image: topic.image,
            bibleVerse: verse.text,
            bibleReference: verse.ref,
            content: [
                `En este día, queremos invitarte a detenerte un momento y reflexionar profundamente sobre el poder transformador de ${topic.focus} en tu vida cotidiana. A menudo, las prisas y las preocupaciones nos roban la capacidad de ver lo que Dios está haciendo en nosotros.`,
                `La Biblia es una fuente inagotable de sabiduría y consuelo. En ${verse.ref}, encontramos una verdad que trasciende el tiempo: "${verse.text}". Esta no es solo una frase bonita, es una promesa viva y activa para ti hoy.`,
                `Piensa en cuántas veces has intentado resolver las cosas con tus propias fuerzas, solo para terminar agotado. Dios te está llamando a soltar el control y a confiar plenamente en Él. ${topic.focus.charAt(0).toUpperCase() + topic.focus.slice(1)} no es algo que fabricamos, es un regalo que recibimos cuando nos rendimos a Su voluntad.`,
                `Hoy es un buen día para empezar de nuevo. No importa lo que haya pasado ayer o lo que te preocupe de mañana. El presente es el lugar donde Dios quiere encontrarse contigo. Abre tu corazón y permite que esta verdad eche raíces profundas en tu alma.`,
                `Recuerda que no estás caminando solo. Dios ha prometido estar contigo en cada paso del camino. Deja que Su paz, que sobrepasa todo entendimiento, guarde tu corazón y tus pensamientos en Cristo Jesús mientras practicas ${topic.focus}.`
            ],
            applicationSteps: [
                `Busca un lugar tranquilo y lee ${verse.ref} en voz alta tres veces, enfatizando una palabra diferente cada vez.`,
                `Escribe en tu diario o en tu celular cómo puedes aplicar ${topic.focus} en una situación específica que enfrentarás hoy.`,
                `Tómate 5 minutos para orar en silencio, escuchando lo que Dios quiere decirte sobre este tema.`,
                `Comparte este versículo o una palabra de ánimo con alguien que sepas que lo necesita.`
            ],
            prayer: `Señor, gracias por tu palabra. Ayúdame a vivir con ${topic.focus} hoy. Que ${verse.ref} sea mi guía y fortaleza. En el nombre de Jesús, Amén.`,
            author: 'Equipo Conecta+'
        });
    }
    
    const content = `export const generatedDevotionals = ${JSON.stringify(devotionals, null, 4)};`;

    fs.writeFileSync('app/lib/generatedDevotionals.ts', content);
    console.log('Devotionals generated successfully!');
};

generateDevotionals();
