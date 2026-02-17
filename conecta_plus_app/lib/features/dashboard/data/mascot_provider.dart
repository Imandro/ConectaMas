import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../auth/data/auth_provider.dart';
import 'mascot_repository.dart';

class MascotState {
  final String name;
  final int level;
  final int experience;
  final int flamePoints;
  final int streak;
  final bool hasSeenTutorial;
  final String mood;
  final bool isLoading;

  MascotState({
    required this.name,
    required this.level,
    required this.experience,
    required this.flamePoints,
    required this.streak,
    required this.hasSeenTutorial,
    this.mood = 'FELIZ',
    this.isLoading = false,
  });

  MascotState copyWith({
    String? name,
    int? level,
    int? experience,
    int? flamePoints,
    int? streak,
    bool? hasSeenTutorial,
    String? mood,
    bool? isLoading,
  }) {
    return MascotState(
      name: name ?? this.name,
      level: level ?? this.level,
      experience: experience ?? this.experience,
      flamePoints: flamePoints ?? this.flamePoints,
      streak: streak ?? this.streak,
      hasSeenTutorial: hasSeenTutorial ?? this.hasSeenTutorial,
      mood: mood ?? this.mood,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class MascotNotifier extends StateNotifier<MascotState> {
  final MascotRepository _repository = MascotRepository();
  final Ref _ref;

  MascotNotifier(this._ref)
      : super(MascotState(
          name: 'Llami',
          level: 1,
          experience: 0,
          flamePoints: 0,
          streak: 0,
          hasSeenTutorial: false,
          isLoading: true,
        )) {
    _init();
  }

  Future<void> _init() async {
    final user = _ref.read(authProvider).user;
    if (user == null) return;

    try {
      final data = await _repository.getMascotByUserId(user.id);
      if (data != null) {
        state = state.copyWith(
          name: data['name'],
          level: data['level'],
          experience: data['experience'],
          flamePoints: data['flamePoints'],
          streak: data['streak'] ?? 0,
          hasSeenTutorial: data['hasSeenLlamiTutorial'] ?? false,
          mood: data['mood'] ?? 'FELIZ',
          isLoading: false,
        );
      } else {
        state = state.copyWith(isLoading: false);
      }
    } catch (e) {
      print('ERROR INITIALIZING MASCOT: $e');
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> setName(String newName) async {
    final user = _ref.read(authProvider).user;
    if (user == null) return;

    state = state.copyWith(name: newName);
    try {
      await _repository.updateMascotName(user.id, newName);
    } catch (e) {
      print('ERROR UPDATING MASCOT NAME: $e');
    }
  }

  Future<void> addExperience(int xp) async {
    int newXp = (state.experience) + xp;
    int newLevel = state.level;
    while (newXp >= 100) {
      newXp -= 100;
      newLevel++;
    }
    state = state.copyWith(experience: newXp, level: newLevel);
    await _syncToDb();
  }

  Future<void> addFlamePoints(int points) async {
    final newPoints = state.flamePoints + points;
    state = state.copyWith(flamePoints: newPoints);
    await _syncToDb();
  }

  Future<bool> useFlamePoints(int points) async {
    if (state.flamePoints >= points) {
      final newFlamePoints = state.flamePoints - points;
      int newXp = state.experience + 20;
      int newLevel = state.level;
      if (newXp >= 100) {
        newXp -= 100;
        newLevel++;
      }

      state = state.copyWith(
        flamePoints: newFlamePoints,
        experience: newXp,
        level: newLevel,
        mood: 'FELIZ',
      );

      final user = _ref.read(authProvider).user;
      if (user != null) {
        try {
          await _repository.feedMascot(
              user.id, newXp, newLevel, newFlamePoints);
        } catch (e) {
          print('ERROR FEEDING MASCOT: $e');
        }
      }
      return true;
    }
    return false;
  }

  Future<void> _syncToDb() async {
    final user = _ref.read(authProvider).user;
    if (user == null) return;
    try {
      await _repository.feedMascot(
          user.id, state.experience, state.level, state.flamePoints);
    } catch (e) {
      print('ERROR SYNCING MASCOT: $e');
    }
  }

  void setTutorialSeen() {
    state = state.copyWith(hasSeenTutorial: true);
  }

  Future<void> updateStreak(int newStreak) async {
    final user = _ref.read(authProvider).user;
    if (user == null) return;
    try {
      await _repository.updateStreak(user.id, newStreak);
      state = state.copyWith(streak: newStreak);
    } catch (e) {
      print('ERROR UPDATING STREAK: $e');
    }
  }

  Future<void> updateName(String newName) async {
    final user = _ref.read(authProvider).user;
    if (user == null) return;
    try {
      await _repository.updateMascotName(user.id, newName);
      state = state.copyWith(name: newName);
    } catch (e) {
      print('ERROR UPDATING MASCOT NAME: $e');
    }
  }
}

final mascotProvider =
    StateNotifierProvider<MascotNotifier, MascotState>((ref) {
  return MascotNotifier(ref);
});
