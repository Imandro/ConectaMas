import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../../config/api_config.dart';

class MascotRepository {
  final String baseUrl = ApiConfig.baseUrl;

  Future<Map<String, dynamic>?> getMascotByUserId(String userId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('${baseUrl}auth/mobile/mascot'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        print('GET MASCOT ERROR: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('GET MASCOT ERROR: $e');
      return null;
    }
  }

  Future<void> updateMascotName(String userId, String name) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.put(
        Uri.parse('${baseUrl}auth/mobile/mascot'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({'name': name}),
      );

      if (response.statusCode != 200) {
        print('UPDATE MASCOT NAME ERROR: ${response.statusCode}');
        throw Exception('Failed to update mascot name');
      }
    } catch (e) {
      print('UPDATE MASCOT NAME ERROR: $e');
      rethrow;
    }
  }

  Future<void> feedMascot(
      String userId, int newExp, int newLevel, int newFlamePoints) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.post(
        Uri.parse('${baseUrl}auth/mobile/mascot/feed'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'experience': newExp,
          'level': newLevel,
          'flamePoints': newFlamePoints,
        }),
      );

      if (response.statusCode != 200) {
        print('FEED MASCOT ERROR: ${response.statusCode}');
        throw Exception('Failed to feed mascot');
      }
    } catch (e) {
      print('FEED MASCOT ERROR: $e');
      rethrow;
    }
  }

  Future<void> updateStreak(String userId, int newStreak) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.put(
        Uri.parse('${baseUrl}auth/mobile/streak'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({'streak': newStreak}),
      );

      if (response.statusCode != 200) {
        print('UPDATE STREAK ERROR: ${response.statusCode}');
        throw Exception('Failed to update streak');
      }
    } catch (e) {
      print('UPDATE STREAK ERROR: $e');
      rethrow;
    }
  }
}
