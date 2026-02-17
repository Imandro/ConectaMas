import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class YouthResourcesRepository {
  Future<Map<String, List<dynamic>>> loadResources() async {
    try {
      final String response =
          await rootBundle.loadString('assets/data/youth_resources.json');
      final data = await json.decode(response);
      return {
        'music': data['music'] ?? [],
        'movies': data['movies'] ?? [],
        'memes': data['memes'] ?? [],
      };
    } catch (e) {
      // Return empty if error (or handle properly)
      return {'music': [], 'movies': [], 'memes': []};
    }
  }
}

final youthResourcesRepositoryProvider =
    Provider<YouthResourcesRepository>((ref) {
  return YouthResourcesRepository();
});

final youthResourcesProvider =
    FutureProvider<Map<String, List<dynamic>>>((ref) async {
  final repo = ref.read(youthResourcesRepositoryProvider);
  return repo.loadResources();
});
