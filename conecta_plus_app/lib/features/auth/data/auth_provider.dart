import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../config/api_config.dart';
import 'models/user_model.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AuthState> {
  final Dio _dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl));

  AuthNotifier() : super(AuthState()) {
    _loadSession();
  }

  Future<void> _loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token != null) {
      state = state.copyWith(token: token, isLoading: true);
      try {
        final response = await _dio.get('/auth/me',
            options: Options(headers: {'Authorization': 'Bearer $token'}));
        final user = User.fromJson(response.data);
        state = state.copyWith(user: user, isLoading: false);
      } catch (e) {
        state = state.copyWith(token: null, isLoading: false);
        await prefs.remove('auth_token');
        await prefs.remove('user_id');
      }
    }
  }

  Future<void> refreshProfile() async {
    if (state.token == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final response = await _dio.get('/auth/me',
          options:
              Options(headers: {'Authorization': 'Bearer ${state.token}'}));
      final user = User.fromJson(response.data);
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state =
          state.copyWith(isLoading: false, error: 'Error al actualizar perfil');
    }
  }

  Future<bool> login(String identifier, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _dio.post('/auth/mobile/login', data: {
        'identifier': identifier,
        'password': password,
      });

      final data = response.data;
      final user = User.fromJson(data['user']);
      final token = data['token'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', token);
      await prefs.setString('user_id', user.id);

      state = state.copyWith(
        user: user,
        token: token,
        isLoading: false,
      );
      return true;
    } on DioException catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.response?.data['message'] ?? 'Error de conexión',
      );
      return false;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'Error inesperado');
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
