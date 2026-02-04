import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'models/user_model.dart';
import 'auth_repository.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository = AuthRepository();

  AuthNotifier() : super(AuthState()) {
    _loadSession();
  }

  Future<void> _loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user_id');

    if (userId != null) {
      state = state.copyWith(isLoading: true);
      try {
        final userData = await _repository.getUserById(userId);
        if (userData != null) {
          final user = User.fromJson(userData);
          state = state.copyWith(
              user: user, token: 'local_native_token', isLoading: false);
        } else {
          await logout();
        }
      } catch (e) {
        state = state.copyWith(isLoading: false);
      }
    }
  }

  Future<void> refreshProfile() async {
    if (state.user == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final userData = await _repository.getUserById(state.user!.id);
      if (userData != null) {
        final user = User.fromJson(userData);
        state = state.copyWith(user: user, isLoading: false);
      } else {
        state = state.copyWith(
            isLoading: false, error: 'Error al actualizar perfil');
      }
    } catch (e) {
      state = state.copyWith(
          isLoading: false, error: 'Error de conexión a la base de datos');
    }
  }

  Future<bool> login(String identifier, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      print('DEBUG: Iniciando login directo a Neon para $identifier');
      final userData = await _repository.login(identifier, password);

      if (userData == null) {
        state =
            state.copyWith(isLoading: false, error: 'Credenciales inválidas');
        return false;
      }

      final user = User.fromJson(userData);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_id', user.id);
      await prefs.setString('auth_token', 'local_native_token');

      state = state.copyWith(
        user: user,
        token: 'local_native_token',
        isLoading: false,
      );
      return true;
    } catch (e) {
      print('ERROR LOGIN DIRECTO: $e');
      state = state.copyWith(
        isLoading: false,
        error: 'Error de conexión directa con la base de datos',
      );
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String username,
    required String email,
    required String password,
    required String securityAnswer,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      print('DEBUG: Iniciando registro directo a Neon para $email');
      final userData = await _repository.register(
        name: name,
        username: username,
        email: email,
        password: password,
        securityAnswer: securityAnswer,
      );

      final user = User.fromJson(userData);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_id', user.id);
      await prefs.setString('auth_token', 'local_native_token');

      state = state.copyWith(
        user: user,
        token: 'local_native_token',
        isLoading: false,
      );
      return true;
    } catch (e) {
      print('ERROR REGISTRO DIRECTO: $e');
      state = state.copyWith(
        isLoading: false,
        error: e.toString().contains('existe')
            ? 'El usuario o email ya existe'
            : 'Error al conectar con la base de datos',
      );
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_id');
    state = AuthState();
  }
}
