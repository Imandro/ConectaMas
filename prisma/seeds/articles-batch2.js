const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMoreArticles() {
    const articles = [
        // Salud Mental
        {
            title: "Manejando la Ansiedad: Una Perspectiva Cristiana para Jóvenes",
            slug: "manejando-ansiedad-perspectiva-cristiana",
            excerpt: "La ansiedad es real, pero no tienes que enfrentarla solo. Descubre estrategias bíblicas y prácticas para encontrar paz en medio del caos.",
            content: `## La Ansiedad es Real (Y Está Bien Admitirlo)

Primero, necesitas saber esto: **sentir ansiedad no significa que tu fe sea débil**. Incluso grandes hombres de Dios como David, Elías y Pablo experimentaron momentos de profunda angustia.

### ¿Por Qué los Jóvenes Luchan con Ansiedad?

En la era digital, enfrentamos presiones únicas:
- **Comparación constante** en redes sociales
- **Presión académica** y expectativas de éxito
- **Incertidumbre sobre el futuro** (carrera, relaciones, propósito)
- **Información sobrecargada** 24/7
- **FOMO** (Fear of Missing Out - miedo a perderse algo)

## Estrategias Bíblicas para la Ansiedad

### 1. Practica la Presencia de Dios

**Filipenses 4:6-7** dice: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias."

**Práctica:** Cuando sientas ansiedad subiendo, detente y ora en voz alta. No tiene que ser elegante. Simplemente: "Dios, estoy ansioso por [situación]. Necesito tu paz."

### 2. Reemplaza Pensamientos Tóxicos

La ansiedad se alimenta de "¿y si...?" negativos:
- "¿Y si fracaso?"
- "¿Y si me rechazan?"
- "¿Y si no soy suficiente?"

**2 Corintios 10:5** nos enseña a "llevar cautivo todo pensamiento a la obediencia a Cristo."

**Práctica:** Cuando un pensamiento ansioso llegue, cuestiónalo:
1. ¿Es verdad?
2. ¿Es útil?
3. ¿Qué dice Dios sobre esto?

### 3. Ancla tu Identidad en Cristo

Mucha ansiedad viene de basar nuestra identidad en:
- Rendimiento académico
- Apariencia física
- Popularidad
- Logros

**La verdad:** Tu valor está en ser hijo/a de Dios, no en lo que haces o cómo te ven otros.

### 4. Establece Límites Digitales

**Práctica:**
- Desactiva notificaciones no esenciales
- Establece "horarios sin pantalla" (especialmente antes de dormir)
- Limita tiempo en redes sociales a 30-60 minutos diarios
- Sigue cuentas que te edifican, no que te hacen sentir inadecuado

### 5. Mueve Tu Cuerpo

El ejercicio reduce cortisol (hormona del estrés) y aumenta endorfinas. No necesitas ir al gym:
- Camina 20 minutos mientras escuchas música de adoración
- Baila en tu cuarto
- Haz yoga o estiramientos

**1 Corintios 6:19-20** nos recuerda que nuestro cuerpo es templo del Espíritu Santo.

## Técnicas Prácticas de Emergencia

### Técnica 5-4-3-2-1 (Para Ataques de Ansiedad)

Cuando sientas que la ansiedad te abruma, identifica:
- **5 cosas** que puedes ver
- **4 cosas** que puedes tocar
- **3 cosas** que puedes oír
- **2 cosas** que puedes oler
- **1 cosa** que puedes saborear

Esto te ancla al presente y saca tu mente del espiral ansioso.

### Respiración 4-7-8

1. Inhala por la nariz contando hasta 4
2. Sostén la respiración contando hasta 7
3. Exhala por la boca contando hasta 8
4. Repite 4 veces

Mientras respiras, repite: "Dios está conmigo. Estoy seguro/a."

## Cuándo Buscar Ayuda Profesional

Es sabio buscar un consejero cristiano o terapeuta si:
- La ansiedad interfiere con tu vida diaria
- Tienes ataques de pánico frecuentes
- Evitas situaciones normales por miedo
- Tienes pensamientos de hacerte daño

**Buscar ayuda profesional NO es falta de fe.** Es sabiduría. Dios usa doctores, terapeutas y medicamentos para sanar.

## Versículos para Memorizar

- **Isaías 41:10** - "No temas, porque yo estoy contigo"
- **Salmo 94:19** - "Cuando en mí se multiplicaron las angustias, tus consuelos alegraron mi alma"
- **Mateo 11:28** - "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar"

## Conclusión

La ansiedad no define quién eres. Eres amado, valioso y capaz de encontrar paz en Cristo. Toma un día a la vez, sé paciente contigo mismo, y recuerda: no estás solo en esta lucha.

**Desafío:** Esta semana, elige UNA estrategia de este artículo e impleméntala diariamente. Observa cómo Dios te da paz poco a poco.`,
            coverImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=400&fit=crop",
            category: "Salud Mental",
            tags: "ansiedad, salud mental, paz, bienestar",
            readTime: 11,
            isFeatured: true,
        },

        // Redes Sociales
        {
            title: "Redes Sociales y Fe: Cómo Usarlas Sin Que Te Usen",
            slug: "redes-sociales-fe-balance",
            excerpt: "Las redes sociales no son malas, pero pueden ser tóxicas. Aprende a usarlas de forma saludable sin comprometer tu salud mental o espiritual.",
            content: `## La Realidad de las Redes Sociales

Seamos honestos: las redes sociales son parte de nuestra vida. Pero también son una de las mayores fuentes de:
- Comparación
- Inseguridad
- Pérdida de tiempo
- Distracción espiritual

**La pregunta no es:** "¿Debo usar redes sociales?"
**La pregunta es:** "¿Cómo las uso de forma que honre a Dios y proteja mi paz?"

## El Lado Oscuro del Scroll Infinito

### 1. La Trampa de la Comparación

Instagram y TikTok nos muestran los "highlights" de la vida de otros. Comparamos nuestro detrás de cámaras con el escenario perfecto de otros.

**Resultado:** Sentimos que nuestra vida es aburrida, que no somos suficiente, que nos estamos perdiendo algo.

**Verdad bíblica:** "No nos comparemos unos con otros" (Gálatas 6:4). Tu camino es único. Dios tiene un plan específico para TI.

### 2. El Robo del Tiempo

¿Cuántas veces has abierto Instagram "solo por 5 minutos" y 2 horas después sigues scrolling?

**Estadística impactante:** El joven promedio pasa 7+ horas diarias en pantallas. Eso es casi un día completo a la semana.

**Pregunta:** ¿Qué podrías hacer con esas horas? ¿Leer la Biblia? ¿Orar? ¿Desarrollar un talento? ¿Servir a otros?

### 3. La Validación Falsa

Likes, comentarios, seguidores... se convierten en medidores de nuestro valor.

**Peligro:** Cuando nuestra autoestima depende de métricas digitales, estamos en terreno peligroso.

**Verdad:** Tu valor fue establecido en la cruz. No necesitas 1000 likes para ser valioso.

## Cómo Usar Redes Sociales de Forma Saludable

### 1. Establece Límites de Tiempo

**Práctica:**
- Usa la función "Tiempo de pantalla" en tu teléfono
- Establece un límite de 30-60 minutos diarios para redes sociales
- Crea "zonas libres de teléfono": comidas, devocional, antes de dormir

### 2. Haz una Limpieza Digital

**Acción inmediata:**
- Deja de seguir cuentas que te hacen sentir inadecuado
- Silencia personas que constantemente publican contenido negativo
- Sigue cuentas que te inspiran espiritualmente

**Pregunta filtro:** "¿Esta cuenta me acerca o me aleja de Dios?"

### 3. Consume con Propósito

En lugar de scroll sin sentido:
- Busca contenido educativo
- Sigue ministerios cristianos
- Lee testimonios edificantes
- Aprende algo nuevo

### 4. Crea con Intención

Si vas a publicar, hazlo con propósito:
- Comparte tu fe (sin ser predicador molesto)
- Inspira a otros
- Sé auténtico, no perfecto
- Usa tu plataforma para bien

### 5. Ayuna Digitalmente

**Desafío:** Una vez al mes, toma un "sabbath digital" de 24 horas.

**Beneficios:**
- Claridad mental
- Más tiempo con Dios
- Conexiones reales con personas
- Perspectiva sobre tu dependencia del teléfono

## Señales de que las Redes Te Están Usando

🚨 **Alerta si:**
- Revisas tu teléfono apenas despiertas (antes de orar)
- Te sientes ansioso sin tu teléfono
- Comparas constantemente tu vida con otros
- Pierdes horas sin darte cuenta
- Sientes FOMO constantemente
- Tu autoestima depende de likes
- Descuidas relaciones reales por virtuales

## El Desafío de los 7 Días

**Día 1-2:** Identifica cuánto tiempo pasas en redes (usa estadísticas del teléfono)
**Día 3-4:** Reduce ese tiempo a la mitad
**Día 5-6:** Haz limpieza digital (unfollow tóxico)
**Día 7:** Ayuno digital completo

**Después de 7 días:** Evalúa cómo te sientes. ¿Más paz? ¿Menos ansiedad?

## Usa Tu Influencia para Bien

Si tienes seguidores, úsalos para:
- Compartir versículos que te impactan
- Testimoniar de lo que Dios hace en tu vida
- Animar a otros
- Ser luz en un espacio a veces oscuro

**Mateo 5:16:** "Así alumbre vuestra luz delante de los hombres, para que vean vuestras buenas obras, y glorifiquen a vuestro Padre que está en los cielos."

## Conclusión

Las redes sociales son herramientas. Como cualquier herramienta, pueden usarse para bien o para mal. La clave es ser intencional, establecer límites, y recordar que tu identidad está en Cristo, no en tu feed.

**Acción:** Hoy mismo, elimina una app de redes sociales de tu teléfono por una semana. Observa cómo cambia tu vida.`,
            coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
            category: "Vida Cristiana",
            tags: "redes sociales, tecnología, balance, salud digital",
            readTime: 10,
            isFeatured: false,
        },

        // Relaciones y Dating
        {
            title: "Dating Cristiano: Navegando Relaciones en la Era Digital",
            slug: "dating-cristiano-era-digital",
            excerpt: "¿Apps de citas? ¿Cuándo es el momento correcto? ¿Cómo mantener límites? Una guía práctica y honesta sobre relaciones románticas para jóvenes cristianos.",
            content: `## Hablemos de Dating (Sin Rodeos)

Seamos reales: el dating es complicado. Agrégale fe cristiana, apps de citas, presión social, y hormonas... y tienes una receta para confusión.

Esta guía es honesta, práctica, y basada en principios bíblicos (no en reglas religiosas anticuadas).

## Antes de Empezar a Salir con Alguien

### 1. ¿Estás Listo/a?

**Preguntas honestas:**
- ¿Buscas una relación porque te sientes solo/a o porque realmente estás listo/a?
- ¿Conoces tu valor en Cristo o lo buscas en otra persona?
- ¿Estás emocionalmente saludable?
- ¿Tienes claro qué buscas en una pareja?

**Verdad:** Una relación no te completará. Solo Cristo lo hace. Una pareja debe complementarte, no completarte.

### 2. Define Tus No Negociables

Antes de empezar a salir, ten claro qué es innegociable:
- ✅ Debe compartir tu fe
- ✅ Debe respetar tus límites físicos
- ✅ Debe tener carácter, no solo carisma
- ✅ Debe tratarte con respeto
- ✅ Debe tener visión y propósito

**Proverbios 4:23:** "Guarda tu corazón más que cualquier otra cosa, porque de él mana la vida."

## Apps de Citas: ¿Sí o No?

**La realidad:** Muchas parejas cristianas se conocen online ahora. No es "menos espiritual."

**Pero ten cuidado:**
- Las apps pueden crear mentalidad de "consumo" (swipe hasta encontrar perfección)
- Es fácil presentar una versión editada de ti mismo
- Puede ser adictivo y superficial

**Si usas apps:**
1. Sé honesto sobre tu fe desde el inicio
2. Muévete a conversaciones reales rápido (no textes por meses)
3. Conoce en persona en lugares públicos
4. Involucra a amigos/mentores en el proceso

## Límites Físicos (La Conversación Incómoda)

Hablemos de lo que nadie quiere hablar pero todos necesitan escuchar.

### ¿Hasta Dónde es "Demasiado Lejos"?

**La pregunta equivocada:** "¿Qué tanto puedo hacer sin pecar?"
**La pregunta correcta:** "¿Cómo puedo honrar a Dios, a mi pareja, y a mi futuro matrimonio?"

**Principios bíblicos:**
- **1 Tesalonicenses 4:3-5:** "La voluntad de Dios es vuestra santificación; que os apartéis de fornicación"
- **1 Corintios 6:18:** "Huid de la fornicación"

### Límites Prácticos

**Nivel 1 - Seguro:**
- Tomarse de la mano
- Abrazos
- Besos casuales

**Nivel 2 - Zona Gris (Requiere Autocontrol):**
- Besos prolongados
- Acostarse juntos (sin actividad sexual)
- Estar solos en lugares privados por mucho tiempo

**Nivel 3 - Peligroso:**
- Cualquier cosa que despierte deseo sexual intenso
- Tocar áreas íntimas
- Dormir juntos

**Consejo práctico:**
1. Establece límites ANTES de estar en situaciones tentadoras
2. Comunica tus límites claramente
3. Evita situaciones que hagan difícil mantener límites
4. Ten un compañero de rendición de cuentas

## Red Flags (Señales de Alerta)

🚩 **Corre si:**
- No respeta tus límites físicos
- Te presiona a comprometer tu fe
- Es controlador o celoso excesivamente
- Te aísla de amigos/familia
- Tiene doble vida (diferente en público vs privado)
- No tiene rendición de cuentas espiritual
- Evita hablar del futuro
- Te hace sentir menos valioso/a

## Green Flags (Señales Positivas)

✅ **Buena señal si:**
- Te anima a crecer espiritualmente
- Respeta tus límites sin quejarse
- Es consistente en carácter
- Tiene relaciones saludables con otros
- Maneja conflictos con madurez
- Es honesto y transparente
- Te hace mejor persona
- Comparte tu visión de vida

## El Rol de la Comunidad

**No salgas en secreto.** Involucra a:
- Padres/tutores (si es apropiado)
- Mentores espirituales
- Amigos cercanos de confianza

**Beneficios:**
- Perspectiva objetiva
- Rendición de cuentas
- Protección contra decisiones impulsivas
- Apoyo en momentos difíciles

## Cuando Terminar una Relación

A veces, lo más espiritual es terminar una relación que no va a ningún lado o que te aleja de Dios.

**Es tiempo de terminar si:**
- La relación te aleja de Dios consistentemente
- No hay crecimiento o futuro claro
- Hay abuso (emocional, físico, verbal)
- Tus valores fundamentales son incompatibles
- Uno de los dos no está comprometido

**Cómo terminar con gracia:**
1. Sé honesto pero amable
2. Hazlo en persona (no por texto)
3. No des falsas esperanzas
4. Respeta el proceso de duelo
5. Establece límites claros post-ruptura

## El Propósito del Dating

**Dating no es:**
- Solo para divertirse
- Probar cuántas personas puedes conquistar
- Llenar un vacío emocional

**Dating es:**
- Conocer a alguien con intención de matrimonio eventual
- Aprender sobre ti mismo y qué necesitas en una pareja
- Practicar comunicación y resolución de conflictos
- Crecer en carácter y madurez

## Conclusión

El dating cristiano no tiene que ser complicado, pero sí requiere intencionalidad, límites claros, y dependencia de Dios.

**Recuerda:** La persona correcta te acercará a Dios, no te alejará. Si tienes que comprometer tu fe para mantener una relación, no es la relación correcta.

**Oración:** "Dios, ayúdame a estar completo en ti primero. Guíame a la persona correcta en tu tiempo perfecto. Dame sabiduría para establecer límites y valor para mantenerlos."`,
            coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=400&fit=crop",
            category: "Relaciones",
            tags: "dating, noviazgo, relaciones, pureza, límites",
            readTime: 12,
            isFeatured: false,
        },
    ];

    console.log('🌱 Seeding additional articles...');

    for (const article of articles) {
        await prisma.article.upsert({
            where: { slug: article.slug },
            update: article,
            create: article,
        });
    }

    console.log(`✅ Seeded ${articles.length} additional articles`);
}

async function main() {
    console.log('🚀 Starting additional seed...');

    try {
        await seedMoreArticles();
        console.log('✨ Additional seed completed successfully!');
    } catch (error) {
        console.error('❌ Error during seed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
