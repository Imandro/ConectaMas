import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static final Map<String, Map<String, String>> _localizedValues = {
    'es': {
      'title': 'Conecta+ BETA',
      'welcome': 'Bienvenido',
      'challengeTitle': 'Reto Diario',
      'days': 'Días',
      'streak': 'Racha',
      'complete_challenge': 'Completar Reto',
      'settings': 'Configuración',
      'language': 'Idioma',
      'region': 'Región',
      'title_verse': 'Completa el versículo',
      'title_truth': 'Verdad Bíblica',
      'feedback_correct': '¡Excelente!',
      'feedback_incorrect': 'Casi...',
      'feedback_correct_msg': 'Vas por muy buen camino.',
      'feedback_incorrect_msg': 'La respuesta era:',
      'points': 'Puntos',
      'status': 'Estado',
      'completed': 'Completado',
      'return_home': 'Volver al Inicio',
      'mission_accomplished': '¡Misión Cumplida!',
      'mission_message': 'Has alimentado tu espíritu con la Verdad hoy.',
      'community_title': 'Comunidad',
      'community_subtitle': 'Comparte, aprende y crece junto a otros',
      'notifications_title': 'Notificaciones',
      'notifications_empty': 'No hay notificaciones',
      'mark_all_read': 'Marcar todas como leídas',
      'new_post': 'Nueva',
      'anonymous': 'Anónimo',
      'counselor': 'CONSEJERO',
      'replies_count': 'Respuestas ({count})',
      'posts_count': '{count} publicaciones',
      'write_reply': 'Escribe una respuesta...',
      'select_category': 'Selecciona una categoría',
      'which_category': '¿En qué categoría quieres publicar?',
      'title_label': 'Título',
      'content_label': 'Contenido',
      'publish': 'Publicar',
      'publish_anonymous': 'Publicar de forma anónima',
      'identity_hidden': 'Tu nombre no será visible para los demás.',
      'hint_title': 'Ej: Oración por fortaleza',
      'hint_content': 'Cuéntanos lo que tienes en el corazón...',
      'cat_prayer': 'Peticiones de Oración',
      'cat_bible': 'Estudio Bíblico',
      'cat_testimony': 'Testimonios',
      'cat_questions': 'Preguntas y Dudas',
      'cat_advice': 'Consejos de Vida',
      'cat_praise': 'Alabanza y Adoración',
      'desc_prayer': 'Apoyémonos los unos a los otros en oración.',
      'desc_bible': 'Profundicemos juntos en la Palabra de Dios.',
      'desc_testimony': 'Cuenta lo que Dios ha hecho en tu vida.',
      'desc_questions': 'Un espacio seguro para resolver inquietudes.',
      'desc_advice': 'Sabiduría práctica para el día a día.',
      'desc_praise': 'Comparte música y experiencias de adoración.',
      'hello': 'Hola, {name}',
      'days_victory': 'Días en victoria',
      'days_label': 'Días',
      'level_label': 'Nivel {level}',
      'mascot_msg_1': '¡Mira cómo creces!',
      'mascot_msg_2': 'Estoy orgulloso de ti',
      'mascot_msg_3': 'Dios sigue contigo',
      'mascot_msg_4': 'Un día a la vez',
      'mascot_msg_5': 'Sigue firme, tú puedes',
      'sos_label': 'Venciendo Tentación',
      'study_bible': 'Estudio Bíblico',
      'daily_verse': 'Versículo del día',
      'my_progress': 'Mi Seguimiento',
      'social_media': 'Redes Sociales',
      'intercession_prayer': 'Oración e Intercesión',
      'support_conecta': 'Apoyar Conecta+',
      'donate': 'Donar',
      'manage_transformation': 'Gestiona tus planes de transformación',
      'in_progress': 'En progreso',
      'available': 'Disponibles',
      'view_all_plans': 'Ver todos mis planes',
      'leave_request': 'Deja tu petición',
      'support_message': 'Ayúdanos a llegar a más personas',
      'donation_desc': 'Tu apoyo me ayuda a mantener los servidores y llevar la palabra de Dios a más jóvenes. Al ser Premium, tendrás una experiencia 100% libre de anuncios y me ayudarás a alcanzar la meta de la Google Play Store.',
      'no_ads': 'Sin anuncios de Google en toda la app',
      'premium_button': '¡Ser Premium por \$1 USD!',
      'paypal_note': '*Al donar, mándame tu email por PayPal para activar tu insignia.',
    },
    'en': {
      'title': 'Conecta+ BETA',
      'welcome': 'Welcome',
      'challengeTitle': 'Daily Challenge',
      'days': 'Days',
      'streak': 'Streak',
      'complete_challenge': 'Complete Challenge',
      'settings': 'Settings',
      'language': 'Language',
      'region': 'Region',
      'title_verse': 'Complete the Verse',
      'title_truth': 'Biblical Truth',
      'feedback_correct': 'Excellent!',
      'feedback_incorrect': 'Almost...',
      'feedback_correct_msg': 'You are on the right path.',
      'feedback_incorrect_msg': 'The answer was:',
      'points': 'Points',
      'status': 'Status',
      'completed': 'Completed',
      'return_home': 'Return Home',
      'mission_accomplished': 'Mission Accomplished!',
      'mission_message': 'You have fed your spirit with Truth today.',
      'community_title': 'Community',
      'community_subtitle': 'Share, learn and grow with others',
      'notifications_title': 'Notifications',
      'notifications_empty': 'No notifications',
      'mark_all_read': 'Mark all as read',
      'new_post': 'New',
      'anonymous': 'Anonymous',
      'counselor': 'COUNSELOR',
      'replies_count': 'Replies ({count})',
      'posts_count': '{count} posts',
      'write_reply': 'Write a reply...',
      'select_category': 'Select a category',
      'which_category': 'In which category do you want to publish?',
      'title_label': 'Title',
      'content_label': 'Content',
      'publish': 'Publish',
      'publish_anonymous': 'Publish anonymously',
      'identity_hidden': 'Your name will not be visible to others.',
      'hint_title': 'Ex: Prayer for strength',
      'hint_content': 'Tell us what is in your heart...',
      'cat_prayer': 'Prayer Requests',
      'cat_bible': 'Bible Study',
      'cat_testimony': 'Testimonies',
      'cat_questions': 'Questions and Doubts',
      'cat_advice': 'Life Advice',
      'cat_praise': 'Praise and Worship',
      'desc_prayer': 'Let\'s support each other in prayer.',
      'desc_bible': 'Let\'s deepen together in the Word of God.',
      'desc_testimony': 'Tell what God has done in your life.',
      'desc_questions': 'A safe space to resolve concerns.',
      'desc_advice': 'Practical wisdom for day to day.',
      'desc_praise': 'Share music and worship experiences.',
      'hello': 'Hello, {name}',
      'days_victory': 'Days in victory',
      'days_label': 'Days',
      'level_label': 'Level {level}',
      'mascot_msg_1': 'Watch how you grow!',
      'mascot_msg_2': 'I am proud of you',
      'mascot_msg_3': 'God is still with you',
      'mascot_msg_4': 'One day at a time',
      'mascot_msg_5': 'Stay firm, you can do it',
      'sos_label': 'Overcoming Temptation',
      'study_bible': 'Bible Study',
      'daily_verse': 'Daily Verse',
      'my_progress': 'My Progress',
      'social_media': 'Social Media',
      'intercession_prayer': 'Prayer & Intercession',
      'support_conecta': 'Support Conecta+',
      'donate': 'Donate',
      'manage_transformation': 'Manage your transformation plans',
      'in_progress': 'In progress',
      'available': 'Available',
      'view_all_plans': 'View all my plans',
      'leave_request': 'Leave your request',
      'support_message': 'Help us reach more people',
      'donation_desc': 'Your support helps me maintain the servers and bring God\'s word to more young people. By being Premium, you will have a 100% ad-free experience and help me reach the goal of the Google Play Store.',
      'no_ads': 'No Google ads in the whole app',
      'premium_button': 'Be Premium for \$1 USD!',
      'paypal_note': '*When donating, send me your email via PayPal to activate your badge.',
    },
    'pt': {
      'title': 'Conecta+ BETA',
      'welcome': 'Bem-vindo',
      'challengeTitle': 'Desafio Diário',
      'days': 'Dias',
      'streak': 'Sequência',
      'complete_challenge': 'Completar Desafio',
      'settings': 'Configurações',
      'language': 'Idioma',
      'region': 'Região',
      'title_verse': 'Complete o Versículo',
      'title_truth': 'Verdade Bíblica',
      'feedback_correct': 'Excelente!',
      'feedback_incorrect': 'Quase...',
      'feedback_correct_msg': 'Você está no caminho certo.',
      'feedback_incorrect_msg': 'A resposta era:',
      'points': 'Pontos',
      'status': 'Status',
      'completed': 'Completado',
      'return_home': 'Voltar ao Início',
      'mission_accomplished': 'Missão Cumprida!',
      'mission_message': 'Você alimentou seu espírito com a Verdade hoje.',
      'community_title': 'Comunidade',
      'community_subtitle': 'Compartilhe, aprenda e cresça junto com outros',
      'notifications_title': 'Notificações',
      'notifications_empty': 'Não há notificações',
      'mark_all_read': 'Marcar todas como lidas',
      'new_post': 'Nova',
      'anonymous': 'Anônimo',
      'counselor': 'CONSELHEIRO',
      'replies_count': 'Respostas ({count})',
      'posts_count': '{count} publicações',
      'write_reply': 'Escreva uma resposta...',
      'select_category': 'Selecione uma categoria',
      'which_category': 'Em qual categoria você deseja publicar?',
      'title_label': 'Título',
      'content_label': 'Conteúdo',
      'publish': 'Publicar',
      'publish_anonymous': 'Publicar anonimamente',
      'identity_hidden': 'Seu nome não será visível para os outros.',
      'hint_title': 'Ex: Oração por força',
      'hint_content': 'Conte-nos o que está em seu coração...',
      'cat_prayer': 'Pedidos de Oração',
      'cat_bible': 'Estudo Bíblico',
      'cat_testimony': 'Testemunhos',
      'cat_questions': 'Perguntas e Dúvidas',
      'cat_advice': 'Conselhos de Vida',
      'cat_praise': 'Louvor e Adoração',
      'desc_prayer': 'Apoiemo-nos uns aos outros em oração.',
      'desc_bible': 'Vamos aprofundar juntos na Palavra de Deus.',
      'desc_testimony': 'Conte o que Deus fez em sua vida.',
      'desc_questions': 'Um espaço seguro para resolver preocupações.',
      'desc_advice': 'Sabedoria prática para o dia a dia.',
      'desc_praise': 'Compartilhe música e experiências de adoração.',
      'hello': 'Olá, {name}',
      'days_victory': 'Dias em vitória',
      'days_label': 'Dias',
      'level_label': 'Nível {level}',
      'mascot_msg_1': 'Veja como você cresce!',
      'mascot_msg_2': 'Estou orgulhoso de você',
      'mascot_msg_3': 'Deus continua com você',
      'mascot_msg_4': 'Um dia de cada vez',
      'mascot_msg_5': 'Siga firme, você consegue',
      'sos_label': 'Vencendo a Tentação',
      'study_bible': 'Estudo Bíblico',
      'daily_verse': 'Versículo do dia',
      'my_progress': 'Meu Progresso',
      'social_media': 'Redes Sociais',
      'intercession_prayer': 'Oração e Intercessão',
      'support_conecta': 'Apoiar Conecta+',
      'donate': 'Doar',
      'manage_transformation': 'Gerencie seus planos de transformação',
      'in_progress': 'Em progresso',
      'available': 'Disponíveis',
      'view_all_plans': 'Ver todos os meus planos',
      'leave_request': 'Deixe seu pedido',
      'support_message': 'Ajude-nos a chegar a mais pessoas',
      'donation_desc': 'Seu apoio me ajuda a manter os servidores e levar a palavra de Deus a mais jovens. Ao ser Premium, você terá uma experiência 100% livre de anúncios e me ajudará a alcançar a meta da Google Play Store.',
      'no_ads': 'Sem anúncios do Google em todo o app',
      'premium_button': 'Ser Premium por \$1 USD!',
      'paypal_note': '*Ao doar, envie-me seu e-mail pelo PayPal para ativar seu selo.',
    },
  };

  String get title => _localizedValues[locale.languageCode]!['title']!;
  String get welcome => _localizedValues[locale.languageCode]!['welcome']!;
  String get challengeTitle => _localizedValues[locale.languageCode]!['challengeTitle']!;
  String get days => _localizedValues[locale.languageCode]!['days']!;
  String get streak => _localizedValues[locale.languageCode]!['streak']!;
  String get completeChallenge => _localizedValues[locale.languageCode]!['complete_challenge']!;
  String get settings => _localizedValues[locale.languageCode]!['settings']!;
  String get language => _localizedValues[locale.languageCode]!['language']!;
  String get region => _localizedValues[locale.languageCode]!['region']!;
  
  // Challenge Page
  String get titleVerse => _localizedValues[locale.languageCode]!['title_verse']!;
  String get titleTruth => _localizedValues[locale.languageCode]!['title_truth']!;
  String get feedbackCorrect => _localizedValues[locale.languageCode]!['feedback_correct']!;
  String get feedbackIncorrect => _localizedValues[locale.languageCode]!['feedback_incorrect']!;
  String get feedbackCorrectMsg => _localizedValues[locale.languageCode]!['feedback_correct_msg']!;
  String get feedbackIncorrectMsg => _localizedValues[locale.languageCode]!['feedback_incorrect_msg']!;
  String get points => _localizedValues[locale.languageCode]!['points']!;
  String get status => _localizedValues[locale.languageCode]!['status']!;
  String get completed => _localizedValues[locale.languageCode]!['completed']!;
  String get returnHome => _localizedValues[locale.languageCode]!['return_home']!;
  String get missionAccomplished => _localizedValues[locale.languageCode]!['mission_accomplished']!;
  String get missionMessage => _localizedValues[locale.languageCode]!['mission_message']!;

  // Community
  String get communityTitle => _localizedValues[locale.languageCode]!['community_title']!;
  String get communitySubtitle => _localizedValues[locale.languageCode]!['community_subtitle']!;
  String get notificationsTitle => _localizedValues[locale.languageCode]!['notifications_title']!;
  String get notificationsEmpty => _localizedValues[locale.languageCode]!['notifications_empty']!;
  String get markAllRead => _localizedValues[locale.languageCode]!['mark_all_read']!;
  String get newPost => _localizedValues[locale.languageCode]!['new_post']!;
  String get anonymous => _localizedValues[locale.languageCode]!['anonymous']!;
  String get counselor => _localizedValues[locale.languageCode]!['counselor']!;
  String get writeReply => _localizedValues[locale.languageCode]!['write_reply']!;
  String get selectCategory => _localizedValues[locale.languageCode]!['select_category']!;
  String get whichCategory => _localizedValues[locale.languageCode]!['which_category']!;
  String get titleLabel => _localizedValues[locale.languageCode]!['title_label']!;
  String get contentLabel => _localizedValues[locale.languageCode]!['content_label']!;
  String get publish => _localizedValues[locale.languageCode]!['publish']!;
  String get publishAnonymous => _localizedValues[locale.languageCode]!['publish_anonymous']!;
  String get identityHidden => _localizedValues[locale.languageCode]!['identity_hidden']!;
  String get hintTitle => _localizedValues[locale.languageCode]!['hint_title']!;
  String get hintContent => _localizedValues[locale.languageCode]!['hint_content']!;

  // Categories
  String get catPrayer => _localizedValues[locale.languageCode]!['cat_prayer']!;
  String get catBible => _localizedValues[locale.languageCode]!['cat_bible']!;
  String get catTestimony => _localizedValues[locale.languageCode]!['cat_testimony']!;
  String get catQuestions => _localizedValues[locale.languageCode]!['cat_questions']!;
  String get catAdvice => _localizedValues[locale.languageCode]!['cat_advice']!;
  String get catPraise => _localizedValues[locale.languageCode]!['cat_praise']!;
  String get descPrayer => _localizedValues[locale.languageCode]!['desc_prayer']!;
  String get descBible => _localizedValues[locale.languageCode]!['desc_bible']!;
  String get descTestimony => _localizedValues[locale.languageCode]!['desc_testimony']!;
  String get descQuestions => _localizedValues[locale.languageCode]!['desc_questions']!;
  String get descAdvice => _localizedValues[locale.languageCode]!['desc_advice']!;
  String get descPraise => _localizedValues[locale.languageCode]!['desc_praise']!;

  // Dashboard
  String get daysVictory => _localizedValues[locale.languageCode]!['days_victory']!;
  String get daysLabel => _localizedValues[locale.languageCode]!['days_label']!;
  String levelLabel(int level) => _localizedValues[locale.languageCode]!['level_label']!.replaceAll('{level}', level.toString());
  String get mascotMsg1 => _localizedValues[locale.languageCode]!['mascot_msg_1']!;
  String get mascotMsg2 => _localizedValues[locale.languageCode]!['mascot_msg_2']!;
  String get mascotMsg3 => _localizedValues[locale.languageCode]!['mascot_msg_3']!;
  String get mascotMsg4 => _localizedValues[locale.languageCode]!['mascot_msg_4']!;
  String get mascotMsg5 => _localizedValues[locale.languageCode]!['mascot_msg_5']!;
  String get sosLabel => _localizedValues[locale.languageCode]!['sos_label']!;
  String get studyBible => _localizedValues[locale.languageCode]!['study_bible']!;
  String get dailyVerse => _localizedValues[locale.languageCode]!['daily_verse']!;
  String get myProgress => _localizedValues[locale.languageCode]!['my_progress']!;
  String get socialMedia => _localizedValues[locale.languageCode]!['social_media']!;
  String get intercessionPrayer => _localizedValues[locale.languageCode]!['intercession_prayer']!;
  String get supportConecta => _localizedValues[locale.languageCode]!['support_conecta']!;
  String get donate => _localizedValues[locale.languageCode]!['donate']!;
  String get manageTransformation => _localizedValues[locale.languageCode]!['manage_transformation']!;
  String get inProgress => _localizedValues[locale.languageCode]!['in_progress']!;
  String get available => _localizedValues[locale.languageCode]!['available']!;
  String get viewAllPlans => _localizedValues[locale.languageCode]!['view_all_plans']!;
  String get leaveRequest => _localizedValues[locale.languageCode]!['leave_request']!;
  String get supportMessage => _localizedValues[locale.languageCode]!['support_message']!;
  String get donationDesc => _localizedValues[locale.languageCode]!['donation_desc']!;
  String get noAds => _localizedValues[locale.languageCode]!['no_ads']!;
  String get premiumButton => _localizedValues[locale.languageCode]!['premium_button']!;
  String get paypalNote => _localizedValues[locale.languageCode]!['paypal_note']!;

  // Parameterized strings
  String repliesCount(int count) => _localizedValues[locale.languageCode]!['replies_count']!.replaceAll('{count}', count.toString());
  String postsCount(int count) => _localizedValues[locale.languageCode]!['posts_count']!.replaceAll('{count}', count.toString());
  String hello(String name) => _localizedValues[locale.languageCode]!['hello']!.replaceAll('{name}', name);
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['es', 'en', 'pt'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
