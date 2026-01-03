import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../config/api_config.dart';
import 'models/struggle_model.dart';

class StruggleService {
  final Dio _dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl));

  Future<List<Struggle>> fetchStruggles() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token == null) throw Exception('No authenticated');

    try {
      final response = await _dio.get(
        '/struggles',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => _mapJsonToStruggle(json)).toList();
      } else {
        throw Exception('Failed to load struggles');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Error fetching struggles');
    }
  }

  Struggle _mapJsonToStruggle(Map<String, dynamic> json) {
    // Map backend Prisma model to Flutter model
    return Struggle(
      id: json['id'].toString(),
      title: json['title'],
      description: json['description'] ?? 'Plan de transformación.',
      status: json['status'] == 'vencido' ? StruggleStatus.vencido : StruggleStatus.active,
      currentDay: json['currentDay'] ?? 1,
      completedDays: (json['completedDays'] as String?)
          ?.split(',')
          .where((s) => s.isNotEmpty)
          .map((s) => int.parse(s))
          .toList() ?? [],
      isStarted: json['isStarted'] ?? false,
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
      // We'll fetch days separately or populate with generic ones for now
      days: [], 
    );
  }

  Future<void> updateProgress(String id, String action, {int? dayNumber}) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token == null) throw Exception('No authenticated');

    try {
      await _dio.patch(
        '/struggles/progress',
        data: {
          'id': id,
          'action': action,
          'dayNumber': dayNumber,
        },
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Error updating progress');
    }
  }
}
