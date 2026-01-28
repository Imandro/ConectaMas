import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'prayer_repository.dart';
import '../../auth/data/auth_provider.dart';

final prayerRepositoryProvider = Provider((ref) {
  final token = ref.watch(authProvider).token;
  return PrayerRepository(token: token);
});

final globalPrayersProvider = StateNotifierProvider<GlobalPrayersNotifier, AsyncValue<List<PrayerRequest>>>((ref) {
  final repository = ref.watch(prayerRepositoryProvider);
  return GlobalPrayersNotifier(repository);
});

class GlobalPrayersNotifier extends StateNotifier<AsyncValue<List<PrayerRequest>>> {
  final PrayerRepository _repository;

  GlobalPrayersNotifier(this._repository) : super(const AsyncValue.loading()) {
    fetchPrayers();
  }

  Future<void> fetchPrayers() async {
    state = const AsyncValue.loading();
    try {
      final prayers = await _repository.getGlobalPrayers();
      state = AsyncValue.data(prayers);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> createRequest(String content, bool isAnonymous) async {
    await _repository.createPrayerRequest(content, isAnonymous);
    await fetchPrayers();
  }

  Future<void> prayFor(String requestId) async {
    try {
      await _repository.prayForParticipant(requestId);
      // Optimistic update
      if (state is AsyncData) {
        final currentList = (state as AsyncData<List<PrayerRequest>>).value;
        state = AsyncValue.data(
          currentList.map((p) => p.id == requestId ? PrayerRequest(
            id: p.id,
            content: p.content,
            isAnonymous: p.isAnonymous,
            prayCount: p.prayCount + 1,
            createdAt: p.createdAt,
            user: p.user,
          ) : p).toList(),
        );
      }
    } catch (e) {
      // Handle error
    }
  }
}
