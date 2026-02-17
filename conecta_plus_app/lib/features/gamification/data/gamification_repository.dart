import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

class GamificationRepository {
  static const String _keyManna = 'gamification_manna';
  static const String _keyDailyRewardLastDate = 'gamification_daily_last_date';
  static const String _keyDailyStreak = 'gamification_daily_streak';
  static const String _keyHighScorePrefix = 'gamification_highscore_';
  static const String _keyCompletedTrivia = 'gamification_completed_trivia';
  static const String _keyCompletedVerses = 'gamification_completed_verses';

  Future<int> getManna() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyManna) ?? 0;
  }

  Future<void> saveManna(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keyManna, amount);
  }

  Future<int> getHighScore(String gameId) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('$_keyHighScorePrefix$gameId') ?? 0;
  }

  Future<void> saveHighScore(String gameId, int score) async {
    final prefs = await SharedPreferences.getInstance();
    final currentHigh = await getHighScore(gameId);
    if (score > currentHigh) {
      await prefs.setInt('$_keyHighScorePrefix$gameId', score);
    }
  }

  Future<DateTime?> getLastDailyRewardDate() async {
    final prefs = await SharedPreferences.getInstance();
    final dateStr = prefs.getString(_keyDailyRewardLastDate);
    if (dateStr == null) return null;
    return DateTime.tryParse(dateStr);
  }

  Future<void> saveLastDailyRewardDate(DateTime date) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyDailyRewardLastDate, date.toIso8601String());
  }

  Future<int> getDailyStreak() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyDailyStreak) ?? 0;
  }

  Future<void> saveDailyStreak(int streak) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keyDailyStreak, streak);
  }

  Future<List<String>> getCompletedTriviaIds() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keyCompletedTrivia) ?? [];
  }

  Future<void> saveCompletedTriviaId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_keyCompletedTrivia) ?? [];
    if (!list.contains(id)) {
      list.add(id);
      await prefs.setStringList(_keyCompletedTrivia, list);
    }
  }

  Future<List<String>> getCompletedVerseIds() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keyCompletedVerses) ?? [];
  }

  Future<void> saveCompletedVerseId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_keyCompletedVerses) ?? [];
    if (!list.contains(id)) {
      list.add(id);
      await prefs.setStringList(_keyCompletedVerses, list);
    }
  }

  // New methods to load data from assets
  Future<List<Map<String, dynamic>>> loadTriviaQuestions() async {
    try {
      final String response =
          await rootBundle.loadString('assets/data/trivia.json');
      final List<dynamic> data = json.decode(response);
      return data.map((e) => e as Map<String, dynamic>).toList();
    } catch (e) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> loadVerses() async {
    try {
      final String response =
          await rootBundle.loadString('assets/data/verses_scramble.json');
      final List<dynamic> data = json.decode(response);
      return data.map((e) => e as Map<String, dynamic>).toList();
    } catch (e) {
      return [];
    }
  }
}
