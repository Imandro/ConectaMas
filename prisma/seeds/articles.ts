import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedArticles() {
    const articles = [
        // Vida Cristiana
        {
            title: "Cómo Mantener una Vida de Oración Constante",
            slug: "como-mantener-vida-oracion-constante",
            excerpt: "Descubre estrategias prácticas para desarrollar una vida de oración vibrante y constante, incluso en medio de un día ocupado.",
            content: `## La Importancia de la Oración Constante

La oración no es solo un ritual religioso, es una conversación continua con Dios. El apóstol Pablo nos exhorta a "orar sin cesar" (1 Tesalonicenses 5:17), pero ¿cómo podemos lograr esto en nuestra vida diaria?

### 1. Comienza Tu Día con Dios

Antes de revisar tu teléfono o redes sociales, dedica los primeros minutos de tu día a Dios. No tiene que ser una hora completa; incluso 5-10 minutos de oración sincera pueden transformar tu día.

**Práctica:** Establece una alarma 10 minutos antes de tu hora habitual de despertar. Usa ese tiempo para agradecer a Dios por un nuevo día y pedirle dirección.

### 2. Convierte las Actividades Cotidianas en Oración

La oración constante no significa estar de rodillas todo el día. Significa mantener una actitud de comunicación con Dios mientras realizas tus actividades.

- **En el transporte:** Ora por las personas que ves
- **Antes de estudiar:** Pide sabiduría y concentración
- **Durante el ejercicio:** Agradece por tu cuerpo y salud
- **Al comer:** Reconoce a Dios como proveedor

### 3. Usa Recordatorios Visuales

Coloca versículos o frases de oración en lugares estratégicos: tu espejo, pantalla de bloqueo del teléfono, o escritorio. Estos recordatorios te ayudarán a volver tu mente a Dios durante el día.

### 4. Lleva un Diario de Oración

Escribe tus oraciones y las respuestas de Dios. Esto te ayudará a:
- Ver cómo Dios responde con el tiempo
- Mantener el enfoque durante la oración
- Recordar por qué y qué estás orando

### 5. Encuentra un Compañero de Oración

Tener alguien con quien orar regularmente te mantiene responsable y fortalece tu vida de oración. Pueden orar juntos en persona, por teléfono, o incluso por mensajes.

## Superando Obstáculos Comunes

**"No tengo tiempo":** La oración no requiere bloques grandes de tiempo. Empieza con 5 minutos y crece desde ahí.

**"Me distraigo fácilmente":** Es normal. Cuando notes que tu mente divaga, simplemente vuelve a enfocarte. La oración es una disciplina que mejora con la práctica.

**"No sé qué decir":** Sé honesto con Dios. Él valora la sinceridad sobre las palabras elaboradas. Puedes usar el modelo del Padre Nuestro como guía.

## Conclusión

Una vida de oración constante transforma tu relación con Dios de un evento semanal a una amistad diaria. Empieza pequeño, sé consistente, y observa cómo Dios se acerca a ti mientras tú te acercas a Él.

**Desafío de esta semana:** Elige una de las estrategias mencionadas e impleméntala durante 7 días. Observa la diferencia que hace en tu vida espiritual.`,
            coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
            category: "Vida Cristiana",
            tags: "oración, disciplinas espirituales, crecimiento",
            readTime: 8,
            isFeatured: true,
        },
        {
            title: "El Poder del Ayuno en la Vida del Joven Cristiano",
            slug: "poder-ayuno-vida-joven-cristiano",
            excerpt: "El ayuno es más que dejar de comer; es una disciplina espiritual poderosa que puede transformar tu relación con Dios.",
            content: `## ¿Qué es Realmente el Ayuno?

El ayuno bíblico es abstenerse voluntariamente de alimentos (y a veces otras cosas) por un período específico con un propósito espiritual. No es una dieta, no es para impresionar a otros, y no es una forma de manipular a Dios.

### Tipos de Ayuno Bíblico

**1. Ayuno Completo:** Sin alimentos ni agua (solo por períodos cortos, como el ayuno de Ester de 3 días)

**2. Ayuno Normal:** Sin alimentos, pero sí agua (como el ayuno de Jesús de 40 días)

**3. Ayuno Parcial:** Restricción de ciertos alimentos (como el ayuno de Daniel con solo vegetales)

**4. Ayuno de Redes Sociales/Tecnología:** Abstenerse de distracciones digitales para enfocarse en Dios

### ¿Por Qué Ayunar?

**Buscar Dirección de Dios**
Cuando enfrentas decisiones importantes, el ayuno te ayuda a escuchar la voz de Dios con mayor claridad.

**Romper Ataduras Espirituales**
Jesús dijo que algunos demonios solo salen con oración y ayuno (Mateo 17:21). El ayuno fortalece tu autoridad espiritual.

**Profundizar Tu Relación con Dios**
Al negar tu cuerpo lo que desea, demuestras que Dios es más importante que tus necesidades físicas.

**Interceder por Otros**
El ayuno amplifica tus oraciones por situaciones difíciles o personas que necesitan un milagro.

### Cómo Empezar a Ayunar

**Para Principiantes:**
1. Empieza con un ayuno de una comida
2. Usa ese tiempo de comida para orar y leer la Biblia
3. Bebe mucha agua
4. Ten un propósito claro para tu ayuno

**Consejos Prácticos:**
- Prepara tu cuerpo comiendo ligero el día anterior
- Evita anunciar tu ayuno públicamente (Mateo 6:16-18)
- Si tienes condiciones médicas, consulta a un doctor primero
- Rompe el ayuno gradualmente con alimentos ligeros

### Qué Esperar Durante el Ayuno

**Físicamente:** Hambre (obviamente), posible dolor de cabeza, debilidad temporal
**Espiritualmente:** Mayor sensibilidad a Dios, claridad mental, tentaciones más fuertes
**Emocionalmente:** Irritabilidad inicial que da paso a paz

### Errores Comunes a Evitar

1. **Ayunar para impresionar:** Dios ve el corazón
2. **Ayunar sin propósito:** Ten claro por qué ayunas
3. **Ser legalista:** El ayuno es gracia, no ley
4. **Descuidar la oración:** El ayuno sin oración es solo pasar hambre

## Testimonios del Poder del Ayuno

A lo largo de la historia, Dios ha usado el ayuno para:
- Liberar a Israel de enemigos (Jueces 20:26)
- Revelar Su voluntad a líderes (Hechos 13:2-3)
- Traer avivamiento (Joel 2:12-13)
- Fortalecer a creyentes en tiempos difíciles

## Tu Desafío

Esta semana, intenta un ayuno de una comida. Usa ese tiempo para buscar a Dios intensamente. Escribe lo que Él te muestra y cómo te sientes al final del día.

Recuerda: El ayuno no cambia a Dios, te cambia a ti. Te hace más sensible a Su voz y más dependiente de Su gracia.`,
            coverImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=400&fit=crop",
            category: "Vida Cristiana",
            tags: "ayuno, disciplinas espirituales, poder espiritual",
            readTime: 10,
            isFeatured: false,
        },

        // Relaciones
        {
            title: "Cómo Establecer Límites Saludables en las Amistades",
            slug: "limites-saludables-amistades",
            excerpt: "Los límites no son muros, son puertas. Aprende a establecer límites que protejan tu bienestar sin alejar a las personas que amas.",
            content: `## ¿Qué Son los Límites y Por Qué Son Importantes?

Los límites son lineamientos personales que defines sobre cómo permites que otros te traten. No son egoístas; son esenciales para relaciones saludables.

**Proverbios 4:23** nos dice: "Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida."

### Señales de que Necesitas Mejores Límites

- Te sientes agotado después de pasar tiempo con ciertos amigos
- Dices "sí" cuando quieres decir "no"
- Sientes que siempre estás dando pero nunca recibiendo
- Tus amigos te presionan a hacer cosas que van contra tus valores
- Te sientes culpable por priorizar tu tiempo personal

### Tipos de Límites en las Amistades

**1. Límites de Tiempo**
- Está bien no estar disponible 24/7
- Puedes tener tiempo para ti sin sentirte culpable
- No tienes que responder mensajes inmediatamente

**2. Límites Emocionales**
- No eres responsable de las emociones de tus amigos
- Puedes empatizar sin absorber sus problemas
- Está bien no ser el terapeuta de todos

**3. Límites Físicos**
- Tu cuerpo es tu templo (1 Corintios 6:19-20)
- Puedes decir no a contacto físico incómodo
- Respeta y exige respeto por el espacio personal

**4. Límites de Valores**
- No comprometas tus convicciones por aceptación
- Puedes amar a alguien y no participar en sus decisiones
- Tus valores cristianos no son negociables

### Cómo Establecer Límites Sin Sentirte Culpable

**1. Sé Claro y Directo**
"No puedo salir esta noche, necesito descansar" es mejor que inventar excusas.

**2. No Te Justifiques Excesivamente**
Un "no" es una oración completa. No necesitas una lista de razones.

**3. Usa Declaraciones "Yo"**
"Yo necesito tiempo para mí" en lugar de "Tú siempre me presionas"

**4. Sé Consistente**
Los límites solo funcionan si los mantienes. La inconsistencia confunde a las personas.

**5. Prepárate para Resistencia**
Algunos amigos pueden reaccionar mal inicialmente. Los verdaderos amigos respetarán tus límites.

### Límites Bíblicos en Acción

**Jesús estableció límites:**
- Se alejaba de las multitudes para orar (Lucas 5:16)
- Dijo "no" a peticiones que no alineaban con Su misión (Juan 6:15)
- Confrontó comportamientos inapropiados (Juan 2:13-16)

**Pablo estableció límites:**
- Se separó de compañeros de ministerio cuando fue necesario (Hechos 15:36-40)
- Confrontó a Pedro públicamente cuando estaba equivocado (Gálatas 2:11-14)

### Qué Hacer Cuando Alguien Cruza Tus Límites

1. **Comunica:** "Cuando haces X, me hace sentir Y. Necesito que Z"
2. **Refuerza:** Si continúa, repite tu límite firmemente
3. **Actúa:** Si persiste, puede ser necesario distanciarte
4. **Ora:** Pide a Dios sabiduría y fortaleza

### Límites vs. Muros

**Límites:** Protegen tu bienestar mientras permiten conexión saludable
**Muros:** Aíslan completamente y previenen toda intimidad

Los límites dicen: "Puedes estar cerca, pero no puedes lastimarme"
Los muros dicen: "No puedes acercarte en absoluto"

## Conclusión

Establecer límites es un acto de amor propio y amor al prójimo. Proteges tu paz y enseñas a otros cómo tratarte. No es egoísmo; es mayordomía sabia de la vida que Dios te ha dado.

**Acción de esta semana:** Identifica un área donde necesitas un límite. Comunícalo claramente a la persona involucrada. Observa cómo mejora tu bienestar emocional.`,
            coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
            category: "Relaciones",
            tags: "límites, amistades, salud emocional",
            readTime: 9,
            isFeatured: true,
        },

        // Add more articles here - I'll create a few more key ones
    ];

    console.log('Seeding articles...');

    for (const article of articles) {
        await prisma.article.upsert({
            where: { slug: article.slug },
            update: article,
            create: article,
        });
    }

    console.log(`✅ Seeded ${articles.length} articles`);
}

// Run if called directly
if (require.main === module) {
    seedArticles()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
