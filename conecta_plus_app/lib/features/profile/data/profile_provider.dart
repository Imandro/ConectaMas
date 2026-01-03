import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/profile_model.dart';

class ProfileNotifier extends StateNotifier<UserProfile> {
  ProfileNotifier()
      : super(UserProfile(
          name: 'Usuario Campeón',
          email: 'usuario@ejemplo.com',
          spiritualLevel: 'Explorador',
          gender: Gender.MALE,
          age: 24,
          username: 'campeon',
          leaderPhone: '+54 9 11 1234-5678',
        ));

  void updateName(String newName) {
    state = state.copyWith(name: newName);
  }

  void updateUsername(String newUsername) {
    state = state.copyWith(username: newUsername);
  }

  void updateProfileImage(String newImage) {
    state = state.copyWith(image: newImage);
  }

  void updateGender(Gender newGender) {
    state = state.copyWith(gender: newGender);
  }

  void updateAge(int newAge) {
    state = state.copyWith(age: newAge);
  }

  void updateLeaderPhone(String newPhone) {
    state = state.copyWith(leaderPhone: newPhone);
  }
}

final profileProvider = StateNotifierProvider<ProfileNotifier, UserProfile>((ref) {
  return ProfileNotifier();
});
