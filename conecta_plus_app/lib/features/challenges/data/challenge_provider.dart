import 'dart:convert';
import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/challenge_data.dart';

class ChallengeState {
  final int dailyProgress; // 0 to 5
  final List<ChallengeModel> currentChallenges;
  final bool isCompletedToday;
  final DateTime? lastResetDate;

  ChallengeState({
    this.dailyProgress = 0,
    this.currentChallenges = const [],
    this.isCompletedToday = false,
    this.lastResetDate,
  });

  ChallengeState copyWith({
    int? dailyProgress,
    List<ChallengeModel>? currentChallenges,
    bool? isCompletedToday,
    DateTime? lastResetDate,
  }) {
    return ChallengeState(
      dailyProgress: dailyProgress ?? this.dailyProgress,
      currentChallenges: currentChallenges ?? this.currentChallenges,
      isCompletedToday: isCompletedToday ?? this.isCompletedToday,
      lastResetDate: lastResetDate ?? this.lastResetDate,
    );
  }
}

class ChallengeNotifier extends StateNotifier<ChallengeState> {
  ChallengeNotifier() : super(ChallengeState()) {
    _init();
  }

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();
    final now = DateTime.now();
    final lastResetStr = prefs.getString('last_challenge_reset');
    
    int progress = prefs.getInt('challenge_progress') ?? 0;
    bool completed = prefs.getBool('challenge_completed_today') ?? false;

    if (lastResetStr != null) {
      final lastReset = DateTime.parse(lastResetStr);
      if (now.day != lastReset.day || now.month != lastReset.month || now.year != lastReset.year) {
        // New day, reset
        progress = 0;
        completed = false;
        await prefs.setInt('challenge_progress', 0);
        await prefs.setBool('challenge_completed_today', false);
        await prefs.setString('last_challenge_reset', now.toIso8601String());
      }
    } else {
      await prefs.setString('last_challenge_reset', now.toIso8601String());
    }

    _loadDailyChallenges();
    state = state.copyWith(
      dailyProgress: progress,
      isCompletedToday: completed,
      lastResetDate: now,
    );
  }

  void _loadDailyChallenges() {
    final random = Random();
    final List<ChallengeModel> daily = [];
    
    // Pick 3 random verses
    final shuffledVerses = List<ChallengeModel>.from(ChallengeData.verses)..shuffle(random);
    daily.addAll(shuffledVerses.take(3));
    
    // Pick 2 random truths
    final shuffledTruths = List<ChallengeModel>.from(ChallengeData.truths)..shuffle(random);
    daily.addAll(shuffledTruths.take(2));
    
    // Shuffle the final 5
    daily.shuffle(random);
    
    state = state.copyWith(currentChallenges: daily);
  }

  Future<void> completeStep() async {
    if (state.dailyProgress < 5) {
      final newProgress = state.dailyProgress + 1;
      final completed = newProgress == 5;
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('challenge_progress', newProgress);
      if (completed) {
        await prefs.setBool('challenge_completed_today', true);
      }
      
      state = state.copyWith(
        dailyProgress: newProgress,
        isCompletedToday: completed,
      );
    }
  }
}

final challengeProvider = StateNotifierProvider<ChallengeNotifier, ChallengeState>((ref) {
  return ChallengeNotifier();
});
