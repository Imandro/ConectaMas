import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'league_repository.dart';
import '../../auth/data/auth_provider.dart';
import '../../auth/data/models/user_model.dart';

final leagueRepositoryProvider = Provider((ref) {
  final token = ref.watch(authProvider).token;
  return LeagueRepository(token: token);
});

final leagueRankingProvider = StateNotifierProvider<LeagueRankingNotifier, AsyncValue<List<User>>>((ref) {
  final repository = ref.watch(leagueRepositoryProvider);
  return LeagueRankingNotifier(repository);
});

class LeagueRankingNotifier extends StateNotifier<AsyncValue<List<User>>> {
  final LeagueRepository _repository;

  LeagueRankingNotifier(this._repository) : super(const AsyncValue.loading()) {
    fetchRanking();
  }

  Future<void> fetchRanking() async {
    state = const AsyncValue.loading();
    try {
      final ranking = await _repository.getLeagueRanking();
      state = AsyncValue.data(ranking);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}
