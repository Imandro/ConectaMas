class User {
  final String id;
  final String? email;
  final String? username;
  final String? name;
  final String? image;
  final String? gender;
  final int? age;
  final String? spiritualStatus;
  final String? sinsToOvercome;
  final String? problemsFaced;
  final String? connectionMethods;
  final bool hasCompletedOnboarding;
  final bool hasSeenLlamiTutorial;
  final String? leaderPhone;
  final String role;

  // New Fields (Phase 1, 3, 4)
  final String? bio;
  final String? country;
  final String profileType; // 'NORMAL', 'COOPERATOR', 'CHURCH'
  final String? bannerUrl;
  final String league; // 'BRONZE', etc.
  final int weeklyXP;
  final int totalXP;

  int get level => (totalXP / 100).floor() + 1;

  User({
    required this.id,
    this.email,
    this.username,
    this.name,
    this.image,
    this.gender,
    this.age,
    this.spiritualStatus,
    this.sinsToOvercome,
    this.problemsFaced,
    this.connectionMethods,
    this.hasCompletedOnboarding = false,
    this.hasSeenLlamiTutorial = false,
    this.leaderPhone,
    this.role = 'USER',
    this.bio,
    this.country,
    this.profileType = 'NORMAL',
    this.bannerUrl,
    this.league = 'BRONZE',
    this.weeklyXP = 0,
    this.totalXP = 0,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      username: json['username'],
      name: json['name'],
      image: json['image'],
      gender: json['gender'],
      age: json['age'] is String ? int.tryParse(json['age']) : json['age'],
      spiritualStatus: json['spiritualStatus'],
      sinsToOvercome: json['sinsToOvercome'],
      problemsFaced: json['problemsFaced'],
      connectionMethods: json['connectionMethods'],
      hasCompletedOnboarding: json['hasCompletedOnboarding'] ?? false,
      hasSeenLlamiTutorial: json['hasSeenLlamiTutorial'] ?? false,
      leaderPhone: json['leaderPhone'],
      role: json['role'] ?? 'USER',
      bio: json['bio'],
      country: json['country'],
      profileType: json['profileType'] ?? 'NORMAL',
      bannerUrl: json['bannerUrl'],
      league: json['league'] ?? 'BRONZE',
      weeklyXP: json['weeklyXP'] ?? 0,
      totalXP: json['totalXP'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'name': name,
      'image': image,
      'gender': gender,
      'age': age,
      'spiritualStatus': spiritualStatus,
      'sinsToOvercome': sinsToOvercome,
      'problemsFaced': problemsFaced,
      'connectionMethods': connectionMethods,
      'hasCompletedOnboarding': hasCompletedOnboarding,
      'hasSeenLlamiTutorial': hasSeenLlamiTutorial,
      'leaderPhone': leaderPhone,
      'role': role,
      'bio': bio,
      'country': country,
      'profileType': profileType,
      'bannerUrl': bannerUrl,
      'league': league,
      'weeklyXP': weeklyXP,
      'totalXP': totalXP,
    };
  }
}

class AuthState {
  final User? user;
  final String? token;
  final bool isLoading;
  final String? error;

  AuthState({
    this.user,
    this.token,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    User? user,
    String? token,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  bool get isAuthenticated => token != null;
}
