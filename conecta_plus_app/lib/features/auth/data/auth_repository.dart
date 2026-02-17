import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../../config/api_config.dart';

class AuthRepository {
  final String baseUrl = ApiConfig.baseUrl;

  Future<Map<String, dynamic>?> login(
      String identifier, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${baseUrl}auth/mobile/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'identifier': identifier.trim().toLowerCase(),
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Save token
        final prefs = await SharedPreferences.getInstance();
        if (data['token'] != null) {
          await prefs.setString('auth_token', data['token']);
        }

        return data['user'];
      } else {
        print('LOGIN ERROR: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('LOGIN ERROR: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String username,
    required String email,
    required String password,
    required String securityAnswer,
  }) async {
    try {
      // Use the WEB register endpoint because 'mobile/register' might not be deployed yet
      final response = await http.post(
        Uri.parse('${baseUrl}auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'username': username,
          'email': email.toLowerCase(),
          'password': password,
          'securityAnswer': securityAnswer.toLowerCase().trim(),
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Registration successful, but Web endpoint doesn't return token.
        // We must login immediately to get the token.
        final loginResult = await login(username, password);

        if (loginResult != null) {
          return loginResult;
        } else {
          // Fallback if login fails (shouldn't happen directly after register)
          final data = json.decode(response.body);
          return data['user'] ?? {};
        }
      } else {
        final error = json.decode(response.body);
        throw Exception(error['message'] ?? 'Error al registrar usuario');
      }
    } catch (e) {
      print('REGISTER ERROR: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> getUserById(String id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('${baseUrl}auth/mobile/me'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        print('GET USER ERROR: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('GET USER ERROR: $e');
      return null;
    }
  }

  Future<void> updateProfile({
    required String userId,
    String? spiritualStatus,
    String? sinsToOvercome,
    String? problemsFaced,
    String? connectionMethods,
    bool? hasCompletedOnboarding,
    bool? hasSeenLlamiTutorial,
    String? leaderPhone,
    String? gender,
    int? age,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final Map<String, dynamic> updates = {};
      if (spiritualStatus != null) updates['spiritualStatus'] = spiritualStatus;
      if (sinsToOvercome != null) updates['sinsToOvercome'] = sinsToOvercome;
      if (problemsFaced != null) updates['problemsFaced'] = problemsFaced;
      if (connectionMethods != null)
        updates['connectionMethods'] = connectionMethods;
      if (hasCompletedOnboarding != null)
        updates['hasCompletedOnboarding'] = hasCompletedOnboarding;
      if (hasSeenLlamiTutorial != null)
        updates['hasSeenLlamiTutorial'] = hasSeenLlamiTutorial;
      if (leaderPhone != null) updates['leaderPhone'] = leaderPhone;
      if (gender != null) updates['gender'] = gender;
      if (age != null) updates['age'] = age;

      if (updates.isEmpty) return;

      final response = await http.put(
        Uri.parse('${baseUrl}auth/mobile/profile'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode(updates),
      );

      if (response.statusCode != 200) {
        print('UPDATE PROFILE ERROR: ${response.statusCode}');
        throw Exception('Failed to update profile');
      }
    } catch (e) {
      print('UPDATE PROFILE ERROR: $e');
      rethrow;
    }
  }
}
