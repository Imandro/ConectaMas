import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'qa_repository.dart';
import 'question_model.dart';

class QAState {
  final List<Question> dailyQuestions;
  final List<Question> questions;
  final Question? currentQuestion;
  final List<Answer> currentAnswers;
  final bool isLoading;
  final String? error;

  QAState({
    this.dailyQuestions = const [],
    this.questions = const [],
    this.currentQuestion,
    this.currentAnswers = const [],
    this.isLoading = false,
    this.error,
  });

  QAState copyWith({
    List<Question>? dailyQuestions,
    List<Question>? questions,
    Question? currentQuestion,
    List<Answer>? currentAnswers,
    bool? isLoading,
    String? error,
    bool clearCurrent = false,
  }) {
    return QAState(
      dailyQuestions: dailyQuestions ?? this.dailyQuestions,
      questions: questions ?? this.questions,
      currentQuestion:
          clearCurrent ? null : (currentQuestion ?? this.currentQuestion),
      currentAnswers:
          clearCurrent ? [] : (currentAnswers ?? this.currentAnswers),
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class QANotifier extends StateNotifier<QAState> {
  final QARepository _repository = QARepository();

  QANotifier() : super(QAState()) {
    loadDailyQuestions();
    loadQuestions();
  }

  Future<void> loadDailyQuestions() async {
    // try {
    final data = await _repository.getDailyQuestions();
    state = state.copyWith(dailyQuestions: data);
    // } catch (e) { ... }
  }

  Future<void> loadQuestions({String? search}) async {
    state = state.copyWith(isLoading: true);
    try {
      final data = await _repository.getAllQuestions(search: search);
      state = state.copyWith(questions: data, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadQuestionDetail(String id) async {
    state = state.copyWith(isLoading: true, clearCurrent: true);
    try {
      final question = await _repository.getQuestionDetail(id);
      final answers = await _repository.getAnswers(id);
      state = state.copyWith(
          currentQuestion: question, currentAnswers: answers, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<bool> createQuestion(
      String userId, String title, String content) async {
    final success = await _repository.createQuestion(
        userId: userId, title: title, content: content);
    if (success) {
      loadQuestions(); // refresh list
    }
    return success;
  }

  Future<bool> createAnswer(
      String userId, String questionId, String content) async {
    final success = await _repository.createAnswer(
        userId: userId, questionId: questionId, content: content);
    if (success) {
      // Reload answers for current question
      final answers = await _repository.getAnswers(questionId);
      state = state.copyWith(currentAnswers: answers);
    }
    return success;
  }
}

final qaProvider = StateNotifierProvider<QANotifier, QAState>((ref) {
  return QANotifier();
});

class CommunityCategory {
  final String id;
  final String name;
  final String description;
  final String icon;
  final Color color;
  final int postCount;

  CommunityCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.color,
    this.postCount = 0,
  });
}

class CommunityState {
  final List<CommunityCategory> categories;
  final bool isLoading;

  CommunityState({
    this.categories = const [],
    this.isLoading = false,
  });
}

class CommunityNotifier extends StateNotifier<CommunityState> {
  CommunityNotifier() : super(CommunityState()) {
    _loadCategories();
  }

  void _loadCategories() {
    state = CommunityState(
      categories: [
        CommunityCategory(
            id: 'peticiones-oracion',
            name: 'Oración',
            description: 'Comparte tus peticiones',
            icon: '🙏',
            color: Colors.blue.withValues(alpha: 0.1),
            postCount: 15),
        CommunityCategory(
            id: 'estudio-biblico',
            name: 'Biblia',
            description: 'Profundiza en la Palabra',
            icon: '📖',
            color: Colors.green.withValues(alpha: 0.1),
            postCount: 24),
        CommunityCategory(
            id: 'testimonios',
            name: 'Testimonios',
            description: 'Lo que Dios ha hecho',
            icon: '✨',
            color: Colors.orange.withValues(alpha: 0.1),
            postCount: 8),
        CommunityCategory(
            id: 'preguntas-dudas',
            name: 'Preguntas',
            description: 'Resuelve tus inquietudes',
            icon: '💡',
            color: Colors.purple.withValues(alpha: 0.1),
            postCount: 42),
        CommunityCategory(
            id: 'consejos-vida',
            name: 'Consejos',
            description: 'Caminemos juntos',
            icon: '🌱',
            color: Colors.teal.withValues(alpha: 0.1),
            postCount: 12),
        CommunityCategory(
            id: 'alabanza-adoracion',
            name: 'Alabanza',
            description: 'Música y gratitud',
            icon: '🎸',
            color: Colors.red.withValues(alpha: 0.1),
            postCount: 5),
      ],
    );
  }
}

final communityProvider =
    StateNotifierProvider<CommunityNotifier, CommunityState>((ref) {
  return CommunityNotifier();
});
