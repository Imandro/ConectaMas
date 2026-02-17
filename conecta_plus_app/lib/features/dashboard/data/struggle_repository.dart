import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../config/api_config.dart';
import 'models/struggle_model.dart';

class StruggleRepository {
  final String baseUrl = ApiConfig.baseUrl;

  Future<List<Struggle>> fetchUserStruggles(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('${baseUrl}struggles/user/$userId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Struggle.fromJson(json)).toList();
      } else {
        print('ERROR FETCHING STRUGGLES: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('ERROR FETCHING STRUGGLES: $e');
      return [];
    }
  }

  Future<void> updateStruggleProgress({
    required String struggleId,
    required String action,
    int? dayNumber,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('${baseUrl}struggles/$struggleId/progress'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'action': action,
          'dayNumber': dayNumber,
        }),
      );

      if (response.statusCode != 200) {
        print('ERROR UPDATING STRUGGLE: ${response.statusCode}');
        throw Exception('Failed to update struggle');
      }
    } catch (e) {
      print('ERROR UPDATING STRUGGLE: $e');
      rethrow;
    }
  }

  Future<void> addStruggle({
    required String userId,
    required String title,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${baseUrl}struggles'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'userId': userId,
          'title': title,
        }),
      );

      if (response.statusCode != 201 && response.statusCode != 200) {
        print('ERROR ADDING STRUGGLE: ${response.statusCode}');
        throw Exception('Failed to add struggle');
      }
    } catch (e) {
      print('ERROR ADDING STRUGGLE: $e');
      rethrow;
    }
  }
}
