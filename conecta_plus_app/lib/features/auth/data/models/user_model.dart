class User {
  final String id;
  final String email;
  final String? username;
  final String? name;
  final String? image;
  final String? gender;
  final int? age;
  final String? spiritualStatus;
  final String? leaderPhone;
  final String role;

  User({
    required this.id,
    required this.email,
    this.username,
    this.name,
    this.image,
    this.gender,
    this.age,
    this.spiritualStatus,
    this.leaderPhone,
    this.role = 'USER',
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
      leaderPhone: json['leaderPhone'],
      role: json['role'] ?? 'USER',
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
      'leaderPhone': leaderPhone,
      'role': role,
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
