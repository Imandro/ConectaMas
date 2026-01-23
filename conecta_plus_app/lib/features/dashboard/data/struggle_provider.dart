import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../auth/data/auth_provider.dart';
import 'models/struggle_model.dart';
import 'struggle_repository.dart';
import 'struggle_devotionals.dart';

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
  final auth = ref.watch(authProvider);
  return StruggleNotifier(StruggleRepository(), auth.user?.id);
});

class StruggleNotifier extends StateNotifier<StruggleState> {
  final StruggleRepository _repository;
  final String? _userId;

  StruggleNotifier(this._repository, this._userId) : super(StruggleState()) {
    refresh();
  }

  Future<void> refresh() async {
    if (_userId == null) return;
    state = state.copyWith(isLoading: true, error: null);
    try {
      final struggles = await _repository.fetchUserStruggles(_userId);

      // Populate days
      final populatedStruggles = struggles.map((s) {
        return s.copyWith(days: _getGenericDays(s.title));
      }).toList();

      state = state.copyWith(struggles: populatedStruggles, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'Error al conectar con la base de datos');
    }
  }

  Future<void> startStruggle(String id) async {
    try {
      await _repository.updateStruggleProgress(struggleId: id, action: 'start');
      await refresh();
    } catch (e) {
      state = state.copyWith(error: 'No se pudo iniciar el plan');
    }
  }

  Future<void> completeDay(String id, int dayNumber) async {
    try {
      await _repository.updateStruggleProgress(
        struggleId: id, 
        action: 'complete_day', 
        dayNumber: dayNumber
      );
      await refresh();
    } catch (e) {
      state = state.copyWith(error: 'Ocurrió un error al guardar progreso');
    }
  }

  Future<void> resetStruggle(String id) async {
    try {
      await _repository.updateStruggleProgress(struggleId: id, action: 'reset');
      await refresh();
    } catch (e) {
      state = state.copyWith(error: 'No se pudo reiniciar el plan');
    }
  }

  Future<void> addStruggle(String title) async {
    if (_userId == null) return;
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.addStruggle(userId: _userId, title: title);
      await refresh();
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'No se pudo agregar la batalla');
    }
  }

  List<StruggleDay> _getGenericDays(String title) {
    return StruggleDevotionals.getDaysForStruggle(title);
  }
}

