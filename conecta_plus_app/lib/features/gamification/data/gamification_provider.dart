import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../dashboard/data/mascot_provider.dart';
import 'gamification_repository.dart';

class GamificationState {
  final int manna;
  final int flamePoints; // Sync with Mascot
  final int triviaHighScore;
  final int scrambleHighScore;
  final DateTime? lastDailyReward;
  final int dailyStreak;
  final List<String> completedTriviaIds;
  final List<String> completedVerseIds;
  final bool isLoading;

  GamificationState({
    this.manna = 0,
    this.flamePoints = 0,
    this.triviaHighScore = 0,
    this.scrambleHighScore = 0,
    this.lastDailyReward,
    this.dailyStreak = 0,
    this.completedTriviaIds = const [],
    this.completedVerseIds = const [],
    this.isLoading = true,
  });

  GamificationState copyWith({
    int? manna,
    int? flamePoints,
    int? triviaHighScore,
    int? scrambleHighScore,
    DateTime? lastDailyReward,
    int? dailyStreak,
    List<String>? completedTriviaIds,
    List<String>? completedVerseIds,
    bool? isLoading,
  }) {
    return GamificationState(
      manna: manna ?? this.manna,
      flamePoints: flamePoints ?? this.flamePoints,
      triviaHighScore: triviaHighScore ?? this.triviaHighScore,
      scrambleHighScore: scrambleHighScore ?? this.scrambleHighScore,
      lastDailyReward: lastDailyReward ?? this.lastDailyReward,
      dailyStreak: dailyStreak ?? this.dailyStreak,
      completedTriviaIds: completedTriviaIds ?? this.completedTriviaIds,
      completedVerseIds: completedVerseIds ?? this.completedVerseIds,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class GamificationNotifier extends StateNotifier<GamificationState> {
  final GamificationRepository _repository;
  final MascotNotifier _mascotNotifier;

  GamificationNotifier(this._repository, this._mascotNotifier)
      : super(GamificationState()) {
    _init();
  }

  Future<void> _init() async {
    state = state.copyWith(isLoading: true);

    final manna = await _repository.getManna();
    final triviaHigh = await _repository.getHighScore('trivia');
    final scrambleHigh = await _repository.getHighScore('scramble');
    final lastDaily = await _repository.getLastDailyRewardDate();
    final streak = await _repository.getDailyStreak();
    final completedTrivia = await _repository.getCompletedTriviaIds();
    final completedVerses = await _repository.getCompletedVerseIds();

    // Sync flame points from mascot
    final flamePoints = _mascotNotifier.state.flamePoints;

    state = state.copyWith(
      manna: manna,
      flamePoints: flamePoints,
      triviaHighScore: triviaHigh,
      scrambleHighScore: scrambleHigh,
      lastDailyReward: lastDaily,
      dailyStreak: streak,
      completedTriviaIds: completedTrivia,
      completedVerseIds: completedVerses,
      isLoading: false,
    );
  }

  Future<void> addManna(int amount) async {
    final newManna = state.manna + amount;
    await _repository.saveManna(newManna);
    state = state.copyWith(manna: newManna);
  }

  Future<void> spendManna(int amount) async {
    if (state.manna >= amount) {
      final newManna = state.manna - amount;
      await _repository.saveManna(newManna);
      state = state.copyWith(manna: newManna);
    }
  }

  Future<void> updateHighScore(String gameId, int score) async {
    await _repository.saveHighScore(gameId, score);
    if (gameId == 'trivia') {
      state = state.copyWith(triviaHighScore: score);
    } else if (gameId == 'scramble') {
      state = state.copyWith(scrambleHighScore: score);
    }
  }

  Future<void> markTriviaCompleted(String id) async {
    if (!state.completedTriviaIds.contains(id)) {
      await _repository.saveCompletedTriviaId(id);
      state = state.copyWith(
        completedTriviaIds: [...state.completedTriviaIds, id],
      );
    }
  }

  Future<void> markVerseCompleted(String id) async {
    if (!state.completedVerseIds.contains(id)) {
      await _repository.saveCompletedVerseId(id);
      state = state.copyWith(
        completedVerseIds: [...state.completedVerseIds, id],
      );
    }
  }

  Future<bool> canClaimDailyReward() async {
    final lastDetails = await _repository.getLastDailyRewardDate();
    if (lastDetails == null) return true;

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final last = DateTime(lastDetails.year, lastDetails.month, lastDetails.day);

    return today.isAfter(last);
  }

  Future<void> claimDailyReward(int rewardAmount) async {
    final now = DateTime.now();

    // Update streak logic
    int newStreak = state.dailyStreak;
    final lastDetails = state.lastDailyReward;

    if (lastDetails != null) {
      final yesterday = DateTime.now().subtract(const Duration(days: 1));
      final lastDate =
          DateTime(lastDetails.year, lastDetails.month, lastDetails.day);
      final yesterdayDate =
          DateTime(yesterday.year, yesterday.month, yesterday.day);

      if (lastDate.isAtSameMomentAs(yesterdayDate)) {
        newStreak++;
      } else if (DateTime(now.year, now.month, now.day).isAfter(lastDate)) {
        final diff = now.difference(lastDetails).inDays;
        if (diff > 1) {
          newStreak = 1;
        } else {
          // If claimed same day, logic shouldn't hit here due to canClaim check,
          // but if it does, keep same? Or increment?
          // Logic above handles "isAfter". If same day, it won't be after.
          // If 1 day gap (yesterday), it increments.
          // If >1 day gap, reset.
          newStreak = 1;
        }
      }
    } else {
      newStreak = 1;
    }

    await _repository.saveLastDailyRewardDate(now);
    await _repository.saveDailyStreak(newStreak);
    await addManna(rewardAmount);

    state = state.copyWith(
      lastDailyReward: now,
      dailyStreak: newStreak,
    );
  }
}

final gamificationRepositoryProvider =
    Provider((ref) => GamificationRepository());

final gamificationProvider =
    StateNotifierProvider<GamificationNotifier, GamificationState>((ref) {
  final repository = ref.watch(gamificationRepositoryProvider);
  final mascotNotifier = ref.watch(mascotProvider.notifier);
  return GamificationNotifier(repository, mascotNotifier);
});
