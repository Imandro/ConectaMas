import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../config/constants.dart';

class PrayerRequest {
  final String id;
  final String content;
  final bool isAnonymous;
  final int prayCount;
  final DateTime createdAt;
  final Map<String, dynamic> user;

  PrayerRequest({
    required this.id,
    required this.content,
    required this.isAnonymous,
    required this.prayCount,
    required this.createdAt,
    required this.user,
  });

  factory PrayerRequest.fromJson(Map<String, dynamic> json) {
    return PrayerRequest(
      id: json['id'],
      content: json['content'],
      isAnonymous: json['isAnonymous'] ?? false,
      prayCount: json['prayCount'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
      user: json['user'] ?? {},
    );
  }
}

class PrayerRepository {
  final String? token;

  PrayerRepository({this.token});

  Future<List<PrayerRequest>> getGlobalPrayers() async {
    final response = await http.get(
      Uri.parse('${Constants.apiBaseUrl}/prayer/global'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => PrayerRequest.fromJson(json)).toList();
    } else {
      throw Exception('Error al cargar pedidos de oración');
    }
  }

  Future<void> createPrayerRequest(String content, bool isAnonymous) async {
    final response = await http.post(
      Uri.parse('${Constants.apiBaseUrl}/prayer/create'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        'content': content,
        'isAnonymous': isAnonymous,
        'isGlobal': true,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Error al publicar pedido de oración');
    }
  }

  Future<void> prayForParticipant(String requestId) async {
    final response = await http.post(
      Uri.parse('${Constants.apiBaseUrl}/prayer/pray/$requestId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Error al registrar oración');
    }
  }
}
