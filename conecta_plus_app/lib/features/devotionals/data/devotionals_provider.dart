import 'package:flutter_riverpod/flutter_riverpod.dart';

enum DevotionalCategory {
  ansiedad,
  integridad,
  identidad,
  soledad,
  fe,
  relaciones,
  oracion,
  otros
}

class Devotional {
  final String id;
  final String title;
  final String category;
  final String time;
  final String image;
  final String bibleVerse;
  final String bibleReference;
  final List<String> content;
  final List<String> applicationSteps;
  final String prayer;
  final String author;
  final bool isRecommended;

  Devotional({
    required this.id,
    required this.title,
    required this.category,
    required this.time,
    required this.image,
    required this.bibleVerse,
    required this.bibleReference,
    required this.content,
    required this.applicationSteps,
    required this.prayer,
    required this.author,
    this.isRecommended = false,
  });
}

class DevotionalState {
  final List<Devotional> devotionals;
  final bool isLoading;

  DevotionalState({
    this.devotionals = const [],
    this.isLoading = false,
  });

  DevotionalState copyWith({
    List<Devotional>? devotionals,
    bool? isLoading,
  }) {
    return DevotionalState(
      devotionals: devotionals ?? this.devotionals,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class DevotionalNotifier extends StateNotifier<DevotionalState> {
  DevotionalNotifier() : super(DevotionalState()) {
    _init();
  }

  void _init() {
    state = state.copyWith(
      devotionals: [
        Devotional(
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
          author: 'Mario Alvarez',
          isRecommended: true,
        ),
        Devotional(
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
          author: 'Mario Alvarez',
          isRecommended: true,
        ),
        Devotional(
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
          author: 'Mario Alvarez',
          isRecommended: true,
        ),
        Devotional(
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
          author: 'Mario Alvarez',
          isRecommended: true,
        ),
      ],
    );
  }
}

final devotionalsProvider = StateNotifierProvider<DevotionalNotifier, DevotionalState>((ref) {
  return DevotionalNotifier();
});
