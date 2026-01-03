import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/struggle_model.dart';
import 'struggle_service.dart';

class StruggleState {
  final List<Struggle> struggles;
  final bool isLoading;
  final String? error;

  StruggleState({
    this.struggles = const [],
    this.isLoading = false,
    this.error,
  });

  StruggleState copyWith({
    List<Struggle>? struggles,
    bool? isLoading,
    String? error,
  }) {
    return StruggleState(
      struggles: struggles ?? this.struggles,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

final struggleProvider =
    StateNotifierProvider<StruggleNotifier, StruggleState>((ref) {
  return StruggleNotifier(StruggleService());
});

class StruggleNotifier extends StateNotifier<StruggleState> {
  final StruggleService _service;

  StruggleNotifier(this._service) : super(StruggleState()) {
    refresh();
  }

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final struggles = await _service.fetchStruggles();

      // Populate days if they are empty from API
      final populatedStruggles = struggles.map((s) {
        if (s.days.isEmpty) {
          return s.copyWith(days: _getGenericDays(s.title));
        }
        return s;
      }).toList();

      state = state.copyWith(struggles: populatedStruggles, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> addStruggle(String title) async {
    // For now we'll just implement the API call if we had a create endpoint
    // Since the web app uses onboarding to create struggles, we'll focus on fetching
    refresh();
  }

  Future<void> startStruggle(String id) async {
    try {
      await _service.updateProgress(id, 'START');
      await refresh();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> completeDay(String id, int dayNumber) async {
    try {
      await _service.updateProgress(id, 'ADVANCE', dayNumber: dayNumber);
      await refresh();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> markAsOvercome(String id) async {
    try {
      await _service.updateProgress(id, 'OVERCOME');
      await refresh();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  List<StruggleDay> _getGenericDays(String title) {
    return List.generate(
        7,
        (index) => StruggleDay(
              dayNumber: index + 1,
              title: 'Día ${index + 1} de $title',
              bibleStudy: 'Estudio sobre $title.',
              practicalExercise: 'Ejercicio práctico para $title.',
              youthAdvice: 'Consejo para jóvenes sobre $title.',
              reflectionQuestions: 'Preguntas de reflexión sobre $title.',
              scripture: 'Filipenses 4:13',
            ));
  }
}
