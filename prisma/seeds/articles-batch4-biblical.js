const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedChristianArticles() {
    const articles = [
        // Evangelismo
        {
            title: "Compartiendo a Cristo Sin Miedo: Evangelismo para Jóvenes",
            slug: "compartiendo-cristo-sin-miedo-evangelismo",
            excerpt: "Jesús nos llamó a hacer discípulos. Aprende a compartir el Evangelio con valentía, amor y sabiduría en tu generación.",
            content: `## El Gran Mandamiento

**Mateo 28:19-20:** "Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado."

Este no es un llamado solo para pastores. **Es para TODOS los seguidores de Cristo, incluyéndote a ti.**

## Por Qué Tenemos Miedo de Evangelizar

### Miedo #1: "No sé qué decir"

**La verdad:** No necesitas ser teólogo. Solo necesitas compartir lo que Cristo ha hecho en TU vida.

**Juan 9:25:** El ciego sanado dijo: "Una cosa sé, que habiendo yo sido ciego, ahora veo."

**Tu testimonio es poderoso porque es TUYO. Nadie puede debatirlo.**

### Miedo #2: "Me van a rechazar"

**La realidad:** Sí, algunos rechazarán el mensaje. Pero no te rechazan a ti, rechazan a Cristo.

**Juan 15:18:** "Si el mundo os aborrece, sabed que a mí me ha aborrecido antes que a vosotros."

**Recuerda:** Tu trabajo es plantar semillas. Dios da el crecimiento (1 Corintios 3:6).

### Miedo #3: "No vivo perfectamente"

**La verdad:** Nadie vive perfectamente. El Evangelio no es "mira qué bueno soy," es "mira qué bueno es Dios."

**2 Corintios 4:7:** "Tenemos este tesoro en vasos de barro, para que la excelencia del poder sea de Dios, y no de nosotros."

**Tu imperfección muestra la gracia de Dios aún más.**

## El Evangelio en 5 Minutos

Necesitas poder explicar el Evangelio claramente. Aquí está la estructura básica:

### 1. Dios te Ama y Tiene un Plan

**Juan 3:16:** "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."

**Punto clave:** Fuiste creado para relación con Dios.

### 2. El Pecado Nos Separó de Dios

**Romanos 3:23:** "Por cuanto todos pecaron, y están destituidos de la gloria de Dios."

**Romanos 6:23:** "La paga del pecado es muerte."

**Punto clave:** Nuestro pecado creó una brecha que no podemos cruzar solos.

### 3. Jesús Pagó el Precio

**Romanos 5:8:** "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros."

**Punto clave:** Jesús murió en nuestro lugar, resucitó, y venció la muerte.

### 4. Debemos Responder con Fe

**Romanos 10:9:** "Si confesares con tu boca que Jesús es el Señor, y creyeres en tu corazón que Dios le levantó de los muertos, serás salvo."

**Punto clave:** Salvación es por gracia mediante fe, no por obras.

### 5. Nueva Vida en Cristo

**2 Corintios 5:17:** "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas."

**Punto clave:** Cristo transforma vidas completamente.

## Métodos Prácticos de Evangelismo

### 1. Evangelismo Relacional

**El más efectivo:** Construye amistad genuina primero.

**Pasos:**
1. Ora por personas específicas en tu vida
2. Sé amigo real (no solo para "convertirlos")
3. Vive tu fe visiblemente
4. Cuando pregunten sobre tu vida, comparte a Cristo
5. Invítalos a eventos de iglesia
6. Comparte el Evangelio cuando el Espíritu guíe

**Clave:** Ama genuinamente, no como proyecto de evangelismo.

### 2. Evangelismo por Testimonio

**Tu historia tiene 3 partes:**

**Antes de Cristo:**
- Cómo era tu vida
- Qué vacío sentías
- Qué buscabas

**El Encuentro:**
- Cómo conociste a Cristo
- Qué te llevó a rendirte
- Cómo respondiste al Evangelio

**Después de Cristo:**
- Cómo cambió tu vida
- Qué diferencia hace Cristo diariamente
- Por qué vale la pena seguirle

**Práctica:** Escribe tu testimonio en 3 minutos. Memorízalo.

### 3. Evangelismo Digital

**Redes sociales pueden ser plataforma de evangelismo:**

**Instagram/TikTok:**
- Comparte versículos con diseño atractivo
- Testimonios cortos en video
- Responde preguntas sobre fe en stories

**YouTube:**
- Comparte tu testimonio
- Explica conceptos cristianos
- Responde objeciones comunes

**Twitter/X:**
- Versículos diarios
- Reflexiones breves
- Anima a otros públicamente

**Clave:** Sé auténtico, no religioso. Muestra a Cristo, no solo religión.

### 4. Evangelismo de Servicio

**Hechos 1:8:** "Recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos."

**Sirve en el nombre de Jesús:**
- Voluntariado en comunidad
- Ayuda a necesitados
- Usa tus talentos para bendecir
- Mientras sirves, comparte POR QUÉ lo haces

**La gente ve a Cristo en tus acciones antes de escucharlo en tus palabras.**

## Respondiendo Objeciones Comunes

### "Todas las religiones son iguales"

**Respuesta:** "Entiendo por qué piensas eso, pero hay una diferencia clave: todas las religiones dicen 'haz esto para llegar a Dios.' Solo el cristianismo dice 'Dios vino a ti.' Jesús hizo lo que nosotros no podíamos hacer."

**Juan 14:6:** "Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí."

### "La Biblia está llena de contradicciones"

**Respuesta:** "¿Puedes darme un ejemplo específico? Muchas 'contradicciones' se resuelven con contexto. La Biblia ha sido estudiada por 2000 años y sigue siendo el libro más confiable de la historia."

**Ofrece estudiar juntos el pasaje que mencionen.**

### "Los cristianos son hipócritas"

**Respuesta:** "Tienes razón, muchos lo somos. Yo también fallo. Por eso necesito a Jesús. El cristianismo no es seguir a cristianos perfectos, es seguir a Cristo perfecto."

**No defiendas lo indefendible. Reconoce fallas pero señala a Cristo.**

### "No creo en Dios"

**Respuesta:** "Respeto tu posición. ¿Puedo preguntarte qué te llevó a esa conclusión? ¿Estarías abierto a explorar evidencias?"

**Comparte:** Evidencia de diseño en creación, testimonios de vidas transformadas, profecías cumplidas, resurrección histórica.

## El Poder del Espíritu Santo

**Juan 16:8:** "Y cuando él venga, convencerá al mundo de pecado, de justicia y de juicio."

**Verdad crucial:** TÚ no convences a nadie. El Espíritu Santo lo hace.

**Tu rol:**
- Compartir fielmente
- Orar fervientemente
- Vivir consistentemente
- Confiar completamente

**El rol del Espíritu:**
- Convencer de pecado
- Abrir corazones
- Dar entendimiento
- Producir fe

## Preparándote para Evangelizar

### 1. Conoce la Palabra

**2 Timoteo 2:15:** "Procura con diligencia presentarte a Dios aprobado, como obrero que no tiene de qué avergonzarse, que usa bien la palabra de verdad."

**Estudia:**
- Evangelios (vida de Jesús)
- Romanos (plan de salvación)
- Respuestas a objeciones comunes
- Versículos clave de memoria

### 2. Ora Constantemente

**Colosenses 4:3:** "Orando también al mismo tiempo por nosotros, para que el Señor nos abra puerta para la palabra."

**Ora por:**
- Oportunidades de compartir
- Valentía para hablar
- Sabiduría en palabras
- Personas específicas por nombre

### 3. Vive el Evangelio

**1 Pedro 3:15:** "Estad siempre preparados para presentar defensa con mansedumbre y reverencia ante todo el que os demande razón de la esperanza que hay en vosotros."

**Tu vida debe hacer que otros pregunten: "¿Por qué eres diferente?"**

## Invitación a Decidir

Cuando compartes el Evangelio, invita a una respuesta:

**"¿Te gustaría recibir a Cristo hoy?"**

**Oración de salvación (guía):**
"Dios, reconozco que soy pecador y necesito tu perdón. Creo que Jesús murió por mis pecados y resucitó. Te pido que entres a mi vida, me perdones, y me hagas nueva criatura. Quiero seguirte todos los días de mi vida. En el nombre de Jesús, amén."

**Después de la decisión:**
1. Celebra con ellos
2. Conéctalos con una iglesia
3. Dales una Biblia
4. Discipúlalos (no solo "conviértelos y olvídalos")

## El Desafío

**Esta semana:**
1. Escribe tu testimonio (3 minutos)
2. Memoriza Romanos 6:23 y Juan 3:16
3. Ora por 3 personas no cristianas específicas
4. Pide a Dios UNA oportunidad de compartir
5. Cuando la oportunidad venga, ¡toma valentía y habla!

## Conclusión

**Romanos 1:16:** "No me avergüenzo del evangelio, porque es poder de Dios para salvación a todo aquel que cree."

El Evangelio es la mejor noticia del universo. Personas a tu alrededor están muriendo sin Cristo. **Tienes el mensaje que puede salvar vidas eternas.**

No necesitas ser perfecto. Solo necesitas ser obediente.

**¿Compartirás a Cristo esta semana?**`,
            coverImage: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&h=400&fit=crop",
            category: "Vida Cristiana",
            tags: "evangelismo, testimonio, gran comisión, salvación",
            readTime: 13,
            isFeatured: true,
        },

        // Guerra Espiritual
        {
            title: "Armadura de Dios: Guerra Espiritual para Jóvenes Cristianos",
            slug: "armadura-dios-guerra-espiritual",
            excerpt: "Estamos en una batalla espiritual real. Aprende a usar la armadura de Dios para vencer al enemigo y permanecer firme en Cristo.",
            content: `## La Realidad de la Guerra Espiritual

**Efesios 6:12:** "Porque no tenemos lucha contra sangre y carne, sino contra principados, contra potestades, contra los gobernadores de las tinieblas de este siglo, contra huestes espirituales de maldad en las regiones celestes."

**Verdad incómoda:** Tienes un enemigo real que quiere destruirte.

**Buena noticia:** Tienes un Salvador que ya venció.

## Conociendo al Enemigo

### Satanás es Real

**1 Pedro 5:8:** "Vuestro adversario el diablo, como león rugiente, anda alrededor buscando a quien devorar."

**Satanás NO es:**
- Igual a Dios (no es omnipotente, omnisciente, ni omnipresente)
- Un personaje de caricatura con cuernos rojos
- Solo una metáfora del mal

**Satanás ES:**
- Un ángel caído real
- Mentiroso y padre de mentira (Juan 8:44)
- Acusador de los hermanos (Apocalipsis 12:10)
- Derrotado en la cruz (Colosenses 2:15)

### Sus Tácticas

**1. Mentiras**
- "No eres suficiente"
- "Dios no te ama"
- "Este pecado no es tan malo"
- "Nunca cambiarás"

**2. Tentación**
- Presenta el pecado como atractivo
- Minimiza las consecuencias
- Usa tus debilidades

**3. Acusación**
- Te recuerda pecados pasados
- Te hace sentir indigno
- Te paraliza con culpa

**4. Distracción**
- Te aleja de la Palabra
- Te aísla de comunidad
- Te llena de ocupaciones "buenas" pero no de Dios

## La Armadura de Dios (Efesios 6:13-18)

### 1. Cinturón de la Verdad

**"Estad, pues, firmes, ceñidos vuestros lomos con la verdad"**

**Qué es:** Conocer y vivir la verdad de la Palabra de Dios.

**Cómo usarlo:**
- Lee la Biblia diariamente
- Memoriza versículos clave
- Cuando el enemigo mienta, declara la verdad

**Ejemplo:**
- Mentira: "Eres un fracaso"
- Verdad: "Soy más que vencedor en Cristo" (Romanos 8:37)

### 2. Coraza de Justicia

**"Vestidos con la coraza de justicia"**

**Qué es:** La justicia de Cristo que te cubre + vivir en santidad.

**Cómo usarla:**
- Confiesa pecados rápidamente (1 Juan 1:9)
- Huye de tentación (2 Timoteo 2:22)
- Vive en obediencia a Dios

**La coraza protege tu corazón. El pecado sin confesar es una brecha en tu armadura.**

### 3. Calzado del Evangelio de Paz

**"Calzados los pies con el apresto del evangelio de la paz"**

**Qué es:** Estar listo para compartir el Evangelio y caminar en paz con Dios.

**Cómo usarlo:**
- Mantén cuentas cortas con Dios
- Vive en paz con otros (Romanos 12:18)
- Comparte a Cristo donde vayas

**Pies firmes = estabilidad espiritual.**

### 4. Escudo de la Fe

**"Sobre todo, tomad el escudo de la fe, con que podáis apagar todos los dardos de fuego del maligno"**

**Qué es:** Confianza activa en Dios y Sus promesas.

**Cómo usarlo:**
- Cuando venga duda, declara fe
- Cuando venga miedo, declara confianza
- Cuando venga tentación, declara victoria en Cristo

**Dardos de fuego = pensamientos, tentaciones, acusaciones**

**Tu fe los apaga antes de que te quemen.**

### 5. Yelmo de la Salvación

**"Tomad el yelmo de la salvación"**

**Qué es:** Seguridad de tu salvación en Cristo.

**Cómo usarlo:**
- Recuerda que eres hijo/a de Dios (1 Juan 3:1)
- Tu salvación no depende de tus obras (Efesios 2:8-9)
- Nada te puede separar del amor de Dios (Romanos 8:38-39)

**El yelmo protege tu mente. El enemigo ataca tus pensamientos.**

### 6. Espada del Espíritu

**"La espada del Espíritu, que es la palabra de Dios"**

**Qué es:** La única arma ofensiva - la Palabra de Dios.

**Cómo usarla:**
- Jesús usó "Escrito está" contra Satanás (Mateo 4)
- Memoriza versículos para cada batalla
- Declara la Palabra en voz alta

**Ejemplos:**
- Contra tentación sexual: "Huiré de la fornicación" (1 Cor 6:18)
- Contra miedo: "Dios no me ha dado espíritu de cobardía" (2 Tim 1:7)
- Contra ansiedad: "Echando toda ansiedad sobre él" (1 Pedro 5:7)

### 7. Oración en el Espíritu

**"Orando en todo tiempo con toda oración y súplica en el Espíritu"**

**Qué es:** Comunicación constante con Dios.

**Cómo practicarla:**
- Ora sin cesar (1 Tesalonicenses 5:17)
- Ora en el Espíritu (Judas 1:20)
- Intercede por otros
- Pide discernimiento espiritual

**La oración es tu línea directa con el Comandante.**

## Campos de Batalla Comunes

### 1. Tu Mente

**2 Corintios 10:5:** "Llevando cautivo todo pensamiento a la obediencia a Cristo."

**Batalla:** Pensamientos negativos, lujuria, duda, ansiedad

**Victoria:**
- Reemplaza mentiras con verdad
- Medita en Filipenses 4:8
- Renueva tu mente con la Palabra (Romanos 12:2)

### 2. Tus Relaciones

**El enemigo usa:**
- Conflictos
- Chismes
- Amistades tóxicas
- Relaciones románticas impuras

**Victoria:**
- Perdona rápidamente
- Establece límites bíblicos
- Rodéate de creyentes fuertes
- Huye de inmoralidad sexual

### 3. Tu Tiempo

**El enemigo te distrae con:**
- Redes sociales sin fin
- Entretenimiento vacío
- Ocupaciones sin propósito

**Victoria:**
- Prioriza tiempo con Dios
- Establece límites digitales
- Invierte en lo eterno

### 4. Tu Fe

**El enemigo siembra:**
- Dudas sobre Dios
- Desánimo en pruebas
- Comparación con otros

**Victoria:**
- Recuerda fidelidad pasada de Dios
- Lee testimonios bíblicos
- Mantente en comunidad

## Armas Poderosas

### 1. El Nombre de Jesús

**Filipenses 2:10:** "Para que en el nombre de Jesús se doble toda rodilla."

**Cuando ores, declara: "En el nombre de Jesús..."**

Ese nombre tiene TODO poder.

### 2. La Sangre de Cristo

**Apocalipsis 12:11:** "Y ellos le han vencido por medio de la sangre del Cordero."

**La sangre de Jesús:**
- Te limpia de pecado
- Te protege del enemigo
- Te da acceso al Padre

### 3. El Ayuno

**Mateo 17:21:** "Pero este género no sale sino con oración y ayuno."

**El ayuno:**
- Intensifica tu oración
- Rompe fortalezas espirituales
- Aumenta sensibilidad al Espíritu

### 4. La Adoración

**2 Crónicas 20:22:** "Cuando comenzaron a entonar cantos de alabanza, Jehová puso contra los hijos de Amón... emboscadas."

**La adoración:**
- Cambia la atmósfera espiritual
- Declara victoria antes de verla
- Enfoca tu mente en Dios

## Señales de Ataque Espiritual

🚨 **Estás bajo ataque si:**
- Sientes opresión espiritual repentina
- Pensamientos suicidas o autodestructivos
- Tentación inusualmente fuerte
- Conflictos inexplicables en relaciones
- Desánimo profundo sin razón
- Alejamiento súbito de Dios

**Qué hacer:**
1. No entres en pánico
2. Ora inmediatamente
3. Declara la sangre de Cristo
4. Llama a un líder espiritual
5. Ayuna si es necesario
6. Mantente en la Palabra

## Victoria Garantizada

**1 Juan 4:4:** "Mayor es el que está en vosotros, que el que está en el mundo."

**Verdades poderosas:**
- Satanás es enemigo DERROTADO
- Cristo YA venció en la cruz
- Tienes TODO el poder del Espíritu Santo
- Ningún arma forjada contra ti prosperará (Isaías 54:17)

**No peleas POR victoria. Peleas DESDE victoria.**

## Práctica Diaria

**Cada mañana:**
1. Declara tu identidad en Cristo
2. Ponte la armadura (literalmente ora por cada pieza)
3. Declara victoria en el nombre de Jesús
4. Pide protección sobre tu mente, familia, y día

**Oración sugerida:**
"Padre, me cubro con la sangre de Jesús. Me pongo la armadura de Dios. Declaro que mayor es el que está en mí que el que está en el mundo. Ningún arma forjada contra mí prosperará. En el nombre de Jesús, amén."

## Conclusión

**Santiago 4:7:** "Someteos, pues, a Dios; resistid al diablo, y huirá de vosotros."

Estás en una guerra real. Pero sirves al Rey que ya ganó la guerra.

**Ponte la armadura. Pelea la buena batalla. Cristo te ha dado la victoria.**`,
            coverImage: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=400&fit=crop",
            category: "Vida Cristiana",
            tags: "guerra espiritual, armadura de Dios, victoria, poder",
            readTime: 14,
            isFeatured: false,
        },
    ];

    console.log('🌱 Seeding biblical Christian articles...');

    for (const article of articles) {
        await prisma.article.upsert({
            where: { slug: article.slug },
            update: article,
            create: article,
        });
    }

    console.log(`✅ Seeded ${articles.length} biblical articles`);
}

async function main() {
    console.log('🚀 Starting biblical content seed...');

    try {
        await seedChristianArticles();
        console.log('✨ Biblical content seed completed!');
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
