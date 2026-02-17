import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../domain/avatar_config.dart';

class AvatarRepository {
  static const String _storageKey = 'user_avatar_config';

  Future<void> saveConfig(AvatarConfig config) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageKey, config.toJson());
  }

  Future<AvatarConfig> loadConfig() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_storageKey);
    if (jsonString != null) {
      try {
        return AvatarConfig.fromJson(jsonString);
      } catch (e) {
        return const AvatarConfig();
      }
    }
    return const AvatarConfig();
  }
}

final avatarRepositoryProvider = Provider<AvatarRepository>((ref) {
  return AvatarRepository();
});

final avatarConfigProvider =
    StateNotifierProvider<AvatarConfigNotifier, AsyncValue<AvatarConfig>>(
        (ref) {
  return AvatarConfigNotifier(ref.watch(avatarRepositoryProvider));
});

class AvatarConfigNotifier extends StateNotifier<AsyncValue<AvatarConfig>> {
  final AvatarRepository _repository;

  AvatarConfigNotifier(this._repository) : super(const AsyncValue.loading()) {
    _load();
  }

  Future<void> _load() async {
    state = const AsyncValue.loading();
    try {
      final config = await _repository.loadConfig();
      state = AsyncValue.data(config);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateConfig(AvatarConfig newConfig) async {
    state = AsyncValue.data(newConfig); // Optimistic update
    try {
      await _repository.saveConfig(newConfig);
    } catch (e, st) {
      // Revert or show error if needed, but for local pref failure is rare
      state = AsyncValue.error(e, st);
    }
  }
}
