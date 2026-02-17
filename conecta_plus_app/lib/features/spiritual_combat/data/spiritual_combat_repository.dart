import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../domain/victory_record.dart';

final spiritualCombatRepositoryProvider =
    Provider((ref) => SpiritualCombatRepository());

final victoriesProvider =
    StateNotifierProvider<VictoriesNotifier, AsyncValue<List<VictoryRecord>>>(
        (ref) {
  return VictoriesNotifier(ref.watch(spiritualCombatRepositoryProvider));
});

class SpiritualCombatRepository {
  static const String _victoriesKey = 'spiritual_victories';

  Future<void> saveVictory(VictoryRecord victory) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await loadVictories();
    current.add(victory);
    final strings = current.map((v) => v.toJson()).toList();
    await prefs.setStringList(_victoriesKey, strings);
  }

  Future<List<VictoryRecord>> loadVictories() async {
    final prefs = await SharedPreferences.getInstance();
    final strings = prefs.getStringList(_victoriesKey) ?? [];
    return strings.map((s) => VictoryRecord.fromJson(s)).toList();
  }
}

class VictoriesNotifier extends StateNotifier<AsyncValue<List<VictoryRecord>>> {
  final SpiritualCombatRepository _repository;

  VictoriesNotifier(this._repository) : super(const AsyncValue.loading()) {
    _load();
  }

  Future<void> _load() async {
    try {
      final list = await _repository.loadVictories();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addVictory(String battleFront, String reflection) async {
    final newVictory = VictoryRecord(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      date: DateTime.now(),
      battleFront: battleFront,
      reflection: reflection,
    );

    final currentList = state.value ?? [];
    state = AsyncValue.data([...currentList, newVictory]);

    try {
      await _repository.saveVictory(newVictory);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
