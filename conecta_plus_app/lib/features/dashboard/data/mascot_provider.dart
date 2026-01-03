import 'package:flutter_riverpod/flutter_riverpod.dart';

class MascotState {
  final String name;
  final int level;
  final int experience;
  final int flamePoints;
  final bool hasSeenTutorial;

  MascotState({
    required this.name,
    required this.level,
    required this.experience,
    required this.flamePoints,
    required this.hasSeenTutorial,
  });

  MascotState copyWith({
    String? name,
    int? level,
    int? experience,
    int? flamePoints,
    bool? hasSeenTutorial,
  }) {
    return MascotState(
      name: name ?? this.name,
      level: level ?? this.level,
      experience: experience ?? this.experience,
      flamePoints: flamePoints ?? this.flamePoints,
      hasSeenTutorial: hasSeenTutorial ?? this.hasSeenTutorial,
    );
  }
}

class MascotNotifier extends StateNotifier<MascotState> {
  MascotNotifier() : super(MascotState(
    name: 'Llami',
    level: 1,
    experience: 45,
    flamePoints: 20,
    hasSeenTutorial: false,
  ));

  void setName(String newName) {
    state = state.copyWith(name: newName);
  }

  void addExperience(int xp) {
    int newXp = state.experience + xp;
    int newLevel = state.level;
    while (newXp >= 100) {
      newXp -= 100;
      newLevel++;
    }
    state = state.copyWith(experience: newXp, level: newLevel);
  }

  void addFlamePoints(int points) {
    state = state.copyWith(flamePoints: state.flamePoints + points);
  }

  bool useFlamePoints(int points) {
    if (state.flamePoints >= points) {
      state = state.copyWith(flamePoints: state.flamePoints - points);
      addExperience(20);
      return true;
    }
    return false;
  }

  void setTutorialSeen() {
    state = state.copyWith(hasSeenTutorial: true);
  }
}

final mascotProvider = StateNotifierProvider<MascotNotifier, MascotState>((ref) {
  return MascotNotifier();
});
