// Challenge model and data for Bible verses and Biblical truths
// Wait, the previous view showed the class definition AT THE TOP of the file. I should overwrite the WHOLE file to include the class definition AND the new data.

class ChallengeModel {
  final String id;
  final ChallengeType type;
  final String content;
  final String reference;
  final List<String> missingWords;
  final List<String> options;

  ChallengeModel({
    required this.id,
    required this.type,
    required this.content,
    required this.reference,
    this.missingWords = const [],
    this.options = const [],
  });
}

enum ChallengeType { verse, truth }

class ChallengeData {
  static final List<ChallengeModel> verses = [
    ChallengeModel(
        id: 'v1',
        type: ChallengeType.verse,
        content: 'Todo lo puedo en _____ que me fortalece.',
        reference: 'Filipenses 4:13',
        missingWords: ['Cristo'],
        options: ['Cristo', 'Dios', 'Fe', 'Paz']),
    ChallengeModel(
        id: 'v2',
        type: ChallengeType.verse,
        content: 'El Señor es mi _____; nada me faltará.',
        reference: 'Salmos 23:1',
        missingWords: ['pastor'],
        options: ['pastor', 'rey', 'amigo', 'guía']),
    ChallengeModel(
        id: 'v3',
        type: ChallengeType.verse,
        content: 'Lámpara es a mis pies tu _____.',
        reference: 'Salmos 119:105',
        missingWords: ['palabra'],
        options: ['palabra', 'voz', 'luz', 'verdad']),
    ChallengeModel(
        id: 'v4',
        type: ChallengeType.verse,
        content: 'Jehová es mi _____ y mi salvación.',
        reference: 'Salmos 27:1',
        missingWords: ['luz'],
        options: ['luz', 'fuerza', 'roca', 'amparo']),
    ChallengeModel(
        id: 'v5',
        type: ChallengeType.verse,
        content: 'No temas, porque yo estoy _____.',
        reference: 'Isaías 41:10',
        missingWords: ['contigo'],
        options: ['contigo', 'aquí', 'velando', 'cerca']),
    ChallengeModel(
        id: 'v6',
        type: ChallengeType.verse,
        content: 'En el principio creó Dios los cielos y la _____.',
        reference: 'Génesis 1:1',
        missingWords: ['tierra'],
        options: ['tierra', 'vida', 'luz', 'noche']),
    ChallengeModel(
        id: 'v7',
        type: ChallengeType.verse,
        content: 'Yo soy el camino, la verdad y la _____.',
        reference: 'Juan 14:6',
        missingWords: ['vida'],
        options: ['vida', 'luz', 'paz', 'fe']),
    ChallengeModel(
        id: 'v8',
        type: ChallengeType.verse,
        content: 'Porque de tal manera amó Dios al _____.',
        reference: 'Juan 3:16',
        missingWords: ['mundo'],
        options: ['mundo', 'pueblo', 'hombre', 'justo']),
    ChallengeModel(
        id: 'v9',
        type: ChallengeType.verse,
        content: 'Honra a tu padre y a tu _____.',
        reference: 'Éxodo 20:12',
        missingWords: ['madre'],
        options: ['madre', 'hermano', 'prójimo', 'abuelo']),
    ChallengeModel(
        id: 'v10',
        type: ChallengeType.verse,
        content: 'El amor es sufrido, es _____.',
        reference: '1 Corintios 13:4',
        missingWords: ['benigno'],
        options: ['benigno', 'bueno', 'fiel', 'santo']),
    ChallengeModel(
        id: 'v11',
        type: ChallengeType.verse,
        content: 'Más bien, buscad primeramente el _____ de Dios.',
        reference: 'Mateo 6:33',
        missingWords: ['reino'],
        options: ['reino', 'amor', 'perdón', 'rostro']),
    ChallengeModel(
        id: 'v12',
        type: ChallengeType.verse,
        content: 'Mira que te mando que te esfuerces y seas _____.',
        reference: 'Josué 1:9',
        missingWords: ['valiente'],
        options: ['valiente', 'fuerte', 'santo', 'fiel']),
    ChallengeModel(
        id: 'v13',
        type: ChallengeType.verse,
        content: 'En paz me acostaré, y asimismo _____.',
        reference: 'Salmos 4:8',
        missingWords: ['dormiré'],
        options: ['dormiré', 'descansaré', 'soñaré', 'confiaré']),
    ChallengeModel(
        id: 'v14',
        type: ChallengeType.verse,
        content: 'El Señor es mi fuerza y mi _____.',
        reference: 'Salmos 28:7',
        missingWords: ['escudo'],
        options: ['escudo', 'espada', 'roca', 'canción']),
    ChallengeModel(
        id: 'v15',
        type: ChallengeType.verse,
        content: 'Echando toda vuestra _____ sobre él.',
        reference: '1 Pedro 5:7',
        missingWords: ['ansiedad'],
        options: ['ansiedad', 'culpa', 'carga', 'duda']),
    ChallengeModel(
        id: 'v16',
        type: ChallengeType.verse,
        content: 'Y la paz de Dios, que sobrepasa todo _____.',
        reference: 'Filipenses 4:7',
        missingWords: ['entendimiento'],
        options: ['entendimiento', 'amor', 'poder', 'saber']),
    ChallengeModel(
        id: 'v17',
        type: ChallengeType.verse,
        content: 'El gozo del Señor es mi _____.',
        reference: 'Nehemías 8:10',
        missingWords: ['fuerza'],
        options: ['fuerza', 'paz', 'vida', 'luz']),
    ChallengeModel(
        id: 'v18',
        type: ChallengeType.verse,
        content: 'Instruye al niño en su _____.',
        reference: 'Proverbios 22:6',
        missingWords: ['camino'],
        options: ['camino', 'verdad', 'vida', 'fe']),
    ChallengeModel(
        id: 'v19',
        type: ChallengeType.verse,
        content: 'Crea en mí, oh Dios, un _____ limpio.',
        reference: 'Salmos 51:10',
        missingWords: ['corazón'],
        options: ['corazón', 'espíritu', 'alma', 'ser']),
    ChallengeModel(
        id: 'v20',
        type: ChallengeType.verse,
        content: 'Yo soy la vid, vosotros los _____.',
        reference: 'Juan 15:5',
        missingWords: ['pámpanos'],
        options: ['pámpanos', 'frutos', 'siervos', 'hijos']),
    ChallengeModel(
        id: 'v21',
        type: ChallengeType.verse,
        content: 'Porque la paga del pecado es _____.',
        reference: 'Romanos 6:23',
        missingWords: ['muerte'],
        options: ['muerte', 'dolor', 'juicio', 'tristeza']),
    ChallengeModel(
        id: 'v22',
        type: ChallengeType.verse,
        content: 'Mas la dádiva de Dios es vida _____.',
        reference: 'Romanos 6:23',
        missingWords: ['eterna'],
        options: ['eterna', 'plena', 'sana', 'santa']),
    ChallengeModel(
        id: 'v23',
        type: ChallengeType.verse,
        content: 'Si confesamos nuestros _____, él es fiel y justo.',
        reference: '1 Juan 1:9',
        missingWords: ['pecados'],
        options: ['pecados', 'errores', 'temores', 'fallos']),
    ChallengeModel(
        id: 'v24',
        type: ChallengeType.verse,
        content: 'Hacedlo todo para la gloria de _____.',
        reference: '1 Corintios 10:31',
        missingWords: ['Dios'],
        options: ['Dios', 'Cristo', 'Jesús', 'Padre']),
    ChallengeModel(
        id: 'v25',
        type: ChallengeType.verse,
        content: 'No os conforméis a este _____.',
        reference: 'Romanos 12:2',
        missingWords: ['siglo'],
        options: ['siglo', 'mundo', 'tiempo', 'lugar']),
    ChallengeModel(
        id: 'v26',
        type: ChallengeType.verse,
        content: 'La fe es la certeza de lo que se _____.',
        reference: 'Hebreos 11:1',
        missingWords: ['espera'],
        options: ['espera', 've', 'siente', 'cree']),
    ChallengeModel(
        id: 'v27',
        type: ChallengeType.verse,
        content: 'Bienaventurados los de limpio _____.',
        reference: 'Mateo 5:8',
        missingWords: ['corazón'],
        options: ['corazón', 'pensamiento', 'espíritu', 'camino']),
    ChallengeModel(
        id: 'v28',
        type: ChallengeType.verse,
        content: 'Vosotros sois la _____ del mundo.',
        reference: 'Mateo 5:14',
        missingWords: ['luz'],
        options: ['luz', 'sal', 'esperanza', 'fuerza']),
    ChallengeModel(
        id: 'v29',
        type: ChallengeType.verse,
        content: 'Pedid, y se os _____.',
        reference: 'Mateo 7:7',
        missingWords: ['dará'],
        options: ['dará', 'abrirá', 'hará', 'oyera']),
    ChallengeModel(
        id: 'v30',
        type: ChallengeType.verse,
        content: 'Clama a mí, y yo te _____.',
        reference: 'Jeremías 33:3',
        missingWords: ['responderé'],
        options: ['responderé', 'oiré', 'ayudaré', 'salvaré']),
    ChallengeModel(
        id: 'v31',
        type: ChallengeType.verse,
        content: 'Torre fuerte es el nombre de _____.',
        reference: 'Proverbios 18:10',
        missingWords: ['Jehová'],
        options: ['Jehová', 'Jesús', 'Dios', 'Cristo']),
    ChallengeModel(
        id: 'v32',
        type: ChallengeType.verse,
        content: 'El que habita al abrigo del _____.',
        reference: 'Salmos 91:1',
        missingWords: ['Altísimo'],
        options: ['Altísimo', 'Omnipotente', 'Señor', 'Rey']),
    ChallengeModel(
        id: 'v33',
        type: ChallengeType.verse,
        content: 'Mis ovejas oyen mi _____.',
        reference: 'Juan 10:27',
        missingWords: ['voz'],
        options: ['voz', 'llamado', 'silbido', 'palabra']),
    ChallengeModel(
        id: 'v34',
        type: ChallengeType.verse,
        content: 'Y conoceréis la verdad, y la verdad os hará _____.',
        reference: 'Juan 8:32',
        missingWords: ['libres'],
        options: ['libres', 'sanos', 'sabios', 'fuertes']),
    ChallengeModel(
        id: 'v35',
        type: ChallengeType.verse,
        content: 'Nadie tiene mayor _____ que este.',
        reference: 'Juan 15:13',
        missingWords: ['amor'],
        options: ['amor', 'poder', 'fe', 'esperanza']),
    ChallengeModel(
        id: 'v36',
        type: ChallengeType.verse,
        content: 'Alzad vuestros ojos y mirad los _____.',
        reference: 'Juan 4:35',
        missingWords: ['campos'],
        options: ['campos', 'cielos', 'montes', 'reinos']),
    ChallengeModel(
        id: 'v37',
        type: ChallengeType.verse,
        content: 'Cercano está Jehová a los quebrantados de _____.',
        reference: 'Salmos 34:18',
        missingWords: ['corazón'],
        options: ['corazón', 'espíritu', 'alma', 'vida']),
    ChallengeModel(
        id: 'v38',
        type: ChallengeType.verse,
        content: 'No nos ha dado Dios espíritu de _____.',
        reference: '2 Timoteo 1:7',
        missingWords: ['cobardía'],
        options: ['cobardía', 'temor', 'duda', 'ira']),
    ChallengeModel(
        id: 'v39',
        type: ChallengeType.verse,
        content: 'Sino de poder, de amor y de _____.',
        reference: '2 Timoteo 1:7',
        missingWords: ['dominio propio'],
        options: ['dominio propio', 'paz', 'fe', 'gozo']),
    ChallengeModel(
        id: 'v40',
        type: ChallengeType.verse,
        content:
            '¿Qué, pues, diremos a esto? Si Dios es por nosotros, ¿quién contra _____?',
        reference: 'Romanos 8:31',
        missingWords: ['nosotros'],
        options: ['nosotros', 'ti', 'el mundo', 'todos']),
    ChallengeModel(
        id: 'v41',
        type: ChallengeType.verse,
        content: 'Por nada estéis _____.',
        reference: 'Filipenses 4:6',
        missingWords: ['afanosos'],
        options: ['afanosos', 'tristes', 'preocupados', 'cansados']),
    ChallengeModel(
        id: 'v42',
        type: ChallengeType.verse,
        content: 'He guardado la _____.',
        reference: '2 Timoteo 4:7',
        missingWords: ['fe'],
        options: ['fe', 'palabra', 'verdad', 'ley']),
    ChallengeModel(
        id: 'v43',
        type: ChallengeType.verse,
        content: 'He peleado la buena _____.',
        reference: '2 Timoteo 4:7',
        missingWords: ['batalla'],
        options: ['batalla', 'guerra', 'lucha', 'carrera']),
    ChallengeModel(
        id: 'v44',
        type: ChallengeType.verse,
        content: 'Porque para mí el vivir es _____.',
        reference: 'Filipenses 1:21',
        missingWords: ['Cristo'],
        options: ['Cristo', 'Dios', 'ganancia', 'amor']),
    ChallengeModel(
        id: 'v45',
        type: ChallengeType.verse,
        content: 'Y el morir es _____.',
        reference: 'Filipenses 1:21',
        missingWords: ['ganancia'],
        options: ['ganancia', 'descanso', 'paz', 'victoria']),
    ChallengeModel(
        id: 'v46',
        type: ChallengeType.verse,
        content: 'Hijo mío, dame tu _____.',
        reference: 'Proverbios 23:26',
        missingWords: ['corazón'],
        options: ['corazón', 'vida', 'mano', 'alma']),
    ChallengeModel(
        id: 'v47',
        type: ChallengeType.verse,
        content: 'El temor de Jehová es el principio de la _____.',
        reference: 'Proverbios 1:7',
        missingWords: ['sabiduría'],
        options: ['sabiduría', 'vida', 'inteligencia', 'fe']),
    ChallengeModel(
        id: 'v48',
        type: ChallengeType.verse,
        content: 'Venid a mí todos los estáis trabajados y _____.',
        reference: 'Mateo 11:28',
        missingWords: ['cargados'],
        options: ['cargados', 'cansados', 'tristes', 'enfermos']),
    ChallengeModel(
        id: 'v49',
        type: ChallengeType.verse,
        content: 'Y yo os haré _____.',
        reference: 'Mateo 11:28',
        missingWords: ['descansar'],
        options: ['descansar', 'felices', 'fuertes', 'libres']),
    ChallengeModel(
        id: 'v50',
        type: ChallengeType.verse,
        content: 'Jesús lloró. Dijeron entonces: Mirad cómo le _____.',
        reference: 'Juan 11:35-36',
        missingWords: ['amaba'],
        options: ['amaba', 'quería', 'conocía', 'seguía']),
  ];

  static final List<ChallengeModel> truths = [
    ChallengeModel(
        id: 't1',
        type: ChallengeType.truth,
        content: '¿Qué dice Dios sobre tu pasado?',
        reference: 'Verdad Bíblica',
        options: ['Me perdonó', 'Me juzga', 'Me condena', 'Me ignora']),
    ChallengeModel(
        id: 't2',
        type: ChallengeType.truth,
        content: '¿Cómo te ve Dios?',
        reference: 'Verdad Bíblica',
        options: ['Como hijo', 'Como pecador', 'Como siervo', 'Como extraño']),
    ChallengeModel(
        id: 't3',
        type: ChallengeType.truth,
        content: 'Dios siempre está contigo, incluso en el silencio.',
        reference: 'Verdad Bíblica',
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't4',
        type: ChallengeType.truth,
        content: 'Tu valor depende de cuántos likes recibes.',
        reference: 'Verdad Bíblica',
        options: [
          'Falso',
          'Verdadero'
        ]), // Correct answer logic handled in UI? Assuming Falso is correct, we might need a flag or put correct first? The Web version had 'answer' field. The native model doesn't seem to have 'answer' field explicitly in the preview, it has 'missingWords' for verses. For truths, it might need adaptation.
    // Wait, looking at lines 23-30 of the original native file:
    // ChallengeModel(..., missingWords: ['Cristo'], options: ['Cristo', 'Dios'...])
    // So the FIRST option or the matching 'missingWords' is the key.
    // For TRUTH type, how is it handled?
    // Line 238: Content: 'Tu valor depende...', Options: ['Verdadero', 'Falso'].
    // Use missingWords to store the correct answer string for Truths too?
    // Let's assume missingWords contains the correct answer string.

    ChallengeModel(
        id: 't3',
        type: ChallengeType.truth,
        content: 'Dios siempre está contigo, incluso en el silencio.',
        reference: 'Verdad Bíblica',
        missingWords: ['Verdadero'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't4',
        type: ChallengeType.truth,
        content: 'Tu valor depende de cuántos likes recibes.',
        reference: 'Verdad Bíblica',
        missingWords: ['Falso'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't5',
        type: ChallengeType.truth,
        content: 'Dios te creó con un propósito específico.',
        reference: 'Verdad Bíblica',
        missingWords: ['Verdadero'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't6',
        type: ChallengeType.truth,
        content: 'Tus errores son más grandes que la gracia de Dios.',
        reference: 'Verdad Bíblica',
        missingWords: ['Falso'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't7',
        type: ChallengeType.truth,
        content: 'La oración es hablar con tu Padre que te ama.',
        reference: 'Verdad Bíblica',
        missingWords: ['Verdadero'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't8',
        type: ChallengeType.truth,
        content: 'Necesitas ser perfecto para acercarte a Dios.',
        reference: 'Verdad Bíblica',
        missingWords: ['Falso'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't9',
        type: ChallengeType.truth,
        content: 'El Espíritu Santo vive dentro de ti.',
        reference: 'Verdad Bíblica',
        missingWords: ['Verdadero'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't10',
        type: ChallengeType.truth,
        content: 'Dios puede transformar cualquier situación para bien.',
        reference: 'Verdad Bíblica',
        missingWords: ['Verdadero'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't11',
        type: ChallengeType.truth,
        content: 'Eres amado con amor eterno.',
        reference: 'Verdad Bíblica',
        missingWords: ['Verdadero'],
        options: ['Verdadero', 'Falso']),
    ChallengeModel(
        id: 't12',
        type: ChallengeType.truth,
        content: 'La Biblia es solo un libro antiguo.',
        reference: 'Verdad Bíblica',
        missingWords: ['Falso'],
        options: ['Verdadero', 'Falso']),
  ];
}
