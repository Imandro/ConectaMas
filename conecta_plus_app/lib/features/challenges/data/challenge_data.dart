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
      options: ['Cristo', 'Dios', 'Fe', 'Paz'],
    ),
    ChallengeModel(
      id: 'v2',
      type: ChallengeType.verse,
      content: 'El Señor es mi _____; nada me faltará.',
      reference: 'Salmos 23:1',
      missingWords: ['pastor'],
      options: ['pastor', 'rey', 'amigo', 'guía'],
    ),
    ChallengeModel(
      id: 'v3',
      type: ChallengeType.verse,
      content: 'Porque yo sé los _____ que tengo para vosotros.',
      reference: 'Jeremías 29:11',
      missingWords: ['planes'],
      options: ['planes', 'días', 'sueños', 'caminos'],
    ),
    ChallengeModel(
      id: 'v4',
      type: ChallengeType.verse,
      content: 'Echad toda vuestra _____ sobre él, porque él tiene cuidado de vosotros.',
      reference: '1 Pedro 5:7',
      missingWords: ['ansiedad'],
      options: ['ansiedad', 'carga', 'tristeza', 'fe'],
    ),
    ChallengeModel(
      id: 'v5',
      type: ChallengeType.verse,
      content: 'Mira que te mando que te _____.',
      reference: 'Josué 1:9',
      missingWords: ['esfuerces'],
      options: ['esfuerces', 'levantes', 'animes', 'prepares'],
    ),
    ChallengeModel(
      id: 'v6',
      type: ChallengeType.verse,
      content: 'Venid a mí todos los que estáis _____ y cargados.',
      reference: 'Mateo 11:28',
      missingWords: ['trabajados'],
      options: ['trabajados', 'cansados', 'tristes', 'solos'],
    ),
    ChallengeModel(
      id: 'v7',
      type: ChallengeType.verse,
      content: 'Lámpara es a mis pies tu _____.',
      reference: 'Salmos 119:105',
      missingWords: ['palabra'],
      options: ['palabra', 'voz', 'luz', 'fe'],
    ),
    ChallengeModel(
      id: 'v8',
      type: ChallengeType.verse,
      content: 'No temas, porque yo estoy _____.',
      reference: 'Isaías 41:10',
      missingWords: ['contigo'],
      options: ['contigo', 'aquí', 'velando', 'cerca'],
    ),
    ChallengeModel(
      id: 'v9',
      type: ChallengeType.verse,
      content: 'Fíate de Jehová de todo tu _____.',
      reference: 'Proverbios 3:5',
      missingWords: ['corazón'],
      options: ['corazón', 'alma', 'ser', 'espíritu'],
    ),
    ChallengeModel(
      id: 'v10',
      type: ChallengeType.verse,
      content: 'Porque no nos ha dado Dios espíritu de _____.',
      reference: '2 Timoteo 1:7',
      missingWords: ['cobardía'],
      options: ['cobardía', 'miedo', 'temor', 'duda'],
    ),
    ChallengeModel(
      id: 'v11',
      type: ChallengeType.verse,
      content: 'Mas el fruto del Espíritu es _____, gozo, paz...',
      reference: 'Gálatas 5:22',
      missingWords: ['amor'],
      options: ['amor', 'fe', 'bondad', 'esperanza'],
    ),
    ChallengeModel(
      id: 'v12',
      type: ChallengeType.verse,
      content: 'Porque por _____ sois salvos por medio de la fe.',
      reference: 'Efesios 2:8',
      missingWords: ['gracia'],
      options: ['gracia', 'obras', 'amor', 'perdón'],
    ),
    ChallengeModel(
      id: 'v13',
      type: ChallengeType.verse,
      content: 'Es, pues, la fe la _____ de lo que se espera.',
      reference: 'Hebreos 11:1',
      missingWords: ['certeza'],
      options: ['certeza', 'esperanza', 'convicción', 'luz'],
    ),
    ChallengeModel(
      id: 'v14',
      type: ChallengeType.verse,
      content: 'No seas vencido de lo malo, sino vence con el _____ el mal.',
      reference: 'Romanos 12:21',
      missingWords: ['bien'],
      options: ['bien', 'amor', 'perdón', 'Cristo'],
    ),
    ChallengeModel(
      id: 'v15',
      type: ChallengeType.verse,
      content: 'Someteos, pues, a Dios; resistid al _____.',
      reference: 'Santiago 4:7',
      missingWords: ['diablo'],
      options: ['diablo', 'pecado', 'mundo', 'miedo'],
    ),
    ChallengeModel(
      id: 'v16',
      type: ChallengeType.verse,
      content: 'No os ha sobrevenido ninguna _____ que no sea humana.',
      reference: '1 Corintios 10:13',
      missingWords: ['tentación'],
      options: ['tentación', 'prueba', 'duda', 'caída'],
    ),
    ChallengeModel(
      id: 'v17',
      type: ChallengeType.verse,
      content: 'Y todo lo que hagáis, hacedlo de _____.',
      reference: 'Colosenses 3:23',
      missingWords: ['corazón'],
      options: ['corazón', 'alma', 'ganas', 'fe'],
    ),
    ChallengeModel(
      id: 'v18',
      type: ChallengeType.verse,
      content: 'Dios es nuestro amparo y _____.',
      reference: 'Salmos 46:1',
      missingWords: ['fortaleza'],
      options: ['fortaleza', 'escudo', 'rey', 'amigo'],
    ),
    ChallengeModel(
      id: 'v19',
      type: ChallengeType.verse,
      content: 'Mas buscad primeramente el _____ de Dios.',
      reference: 'Mateo 6:33',
      missingWords: ['reino'],
      options: ['reino', 'amor', 'camino', 'perdón'],
    ),
    ChallengeModel(
      id: 'v20',
      type: ChallengeType.verse,
      content: 'Si _____ nuestros pecados, él es fiel y justo para perdonar.',
      reference: '1 Juan 1:9',
      missingWords: ['confesamos'],
      options: ['confesamos', 'dejamos', 'sentimos', 'creemos'],
    ),
    ChallengeModel(
      id: 'v21',
      type: ChallengeType.verse,
      content: 'Vestíos de toda la _____ de Dios.',
      reference: 'Efesios 6:11',
      missingWords: ['armadura'],
      options: ['armadura', 'fuerza', 'ropa', 'fe'],
    ),
    ChallengeModel(
      id: 'v22',
      type: ChallengeType.verse,
      content: 'He aquí, yo estoy a la _____ y llamo.',
      reference: 'Apocalipsis 3:20',
      missingWords: ['puerta'],
      options: ['puerta', 'vida', 'entrada', 'luz'],
    ),
    ChallengeModel(
      id: 'v23',
      type: ChallengeType.verse,
      content: 'Y sabemos que a los que _____ a Dios, todas las cosas les ayudan a bien.',
      reference: 'Romanos 8:28',
      missingWords: ['aman'],
      options: ['aman', 'buscan', 'claman', 'creen'],
    ),
    ChallengeModel(
      id: 'v24',
      type: ChallengeType.verse,
      content: 'El ángel de Jehová _____ alrededor de los que le temen.',
      reference: 'Salmos 34:7',
      missingWords: ['acampa'],
      options: ['acampa', 'vive', 'está', 'vuela'],
    ),
    ChallengeModel(
      id: 'v25',
      type: ChallengeType.verse,
      content: 'Porque de tal _____ amó Dios al mundo.',
      reference: 'Juan 3:16',
      missingWords: ['manera'],
      options: ['manera', 'forma', 'suerte', 'gracia'],
    ),
  ];

  static final List<ChallengeModel> truths = [
    ChallengeModel(
      id: 't1',
      type: ChallengeType.truth,
      content: 'Eres un hijo amado de Dios, sin importar tus errores.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'],
    ),
    ChallengeModel(
      id: 't2',
      type: ChallengeType.truth,
      content: 'Tu valor depende de tus logros.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'], // Answer is False
    ),
    ChallengeModel(
      id: 't3',
      type: ChallengeType.truth,
      content: 'El perdón de Dios es total y restaurador.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'],
    ),
    ChallengeModel(
      id: 't4',
      type: ChallengeType.truth,
      content: 'Fuiste diseñado con un propósito único y eterno.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'],
    ),
    ChallengeModel(
      id: 't5',
      type: ChallengeType.truth,
      content: 'No estás solo; el Espíritu Santo vive en ti.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'],
    ),
    ChallengeModel(
      id: 't6',
      type: ChallengeType.truth,
      content: 'La gracia de Dios es suficiente para tus debilidades.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'],
    ),
    ChallengeModel(
      id: 't7',
      type: ChallengeType.truth,
      content: 'Tu identidad está en tus luchas y pecados.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'], // Answer is False
    ),
    ChallengeModel(
      id: 't8',
      type: ChallengeType.truth,
      content: 'Dios tiene un plan de bien para tu vida.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'],
    ),
    ChallengeModel(
      id: 't9',
      type: ChallengeType.truth,
      content: 'La Biblia es solo un libro histórico sin poder hoy.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'], // Answer is False
    ),
    ChallengeModel(
      id: 't10',
      type: ChallengeType.truth,
      content: 'Jesús ya venció al mundo, y tú vences con Él.',
      reference: 'Verdad Bíblica',
      options: ['Verdadero', 'Falso'],
    ),
  ];
}
