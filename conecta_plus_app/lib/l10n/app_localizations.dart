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
