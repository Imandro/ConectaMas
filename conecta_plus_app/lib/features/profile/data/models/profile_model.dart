enum Gender { MALE, FEMALE, UNSPECIFIED }

class UserProfile {
  final String name;
  final String email;
  final String? image;
  final String? username;
  final String spiritualLevel;
  final Gender gender;
  final int? age;
  final String? leaderPhone;
  final String role;

  UserProfile({
    required this.name,
    required this.email,
    this.image,
    this.username,
    required this.spiritualLevel,
    required this.gender,
    this.age,
    this.leaderPhone,
    this.role = 'USER',
  });

  UserProfile copyWith({
    String? name,
    String? email,
    String? image,
    String? username,
    String? spiritualLevel,
    Gender? gender,
    int? age,
    String? leaderPhone,
    String? role,
  }) {
    return UserProfile(
      name: name ?? this.name,
      email: email ?? this.email,
      image: image ?? this.image,
      username: username ?? this.username,
      spiritualLevel: spiritualLevel ?? this.spiritualLevel,
      gender: gender ?? this.gender,
      age: age ?? this.age,
      leaderPhone: leaderPhone ?? this.leaderPhone,
      role: role ?? this.role,
    );
  }
}
