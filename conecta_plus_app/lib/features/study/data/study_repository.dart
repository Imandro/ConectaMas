import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../config/constants.dart';

class StudyRoom {
  final String id;
  final String title;
  final String theme;
  final String description;
  final String hostId;
  final int messageCount;
  final Map<String, dynamic> host;

  StudyRoom({
    required this.id,
    required this.title,
    required this.theme,
    required this.description,
    required this.hostId,
    required this.messageCount,
    required this.host,
  });

  factory StudyRoom.fromJson(Map<String, dynamic> json) {
    return StudyRoom(
      id: json['id'],
      title: json['title'] ?? '',
      theme: json['theme'] ?? '',
      description: json['description'] ?? '',
      hostId: json['hostId'] ?? '',
      messageCount: json['_count']?['messages'] ?? 0,
      host: json['host'] ?? {},
    );
  }
}

class StudyMessage {
  final String id;
  final String content;
  final DateTime createdAt;
  final Map<String, dynamic> user;

  StudyMessage({
    required this.id,
    required this.content,
    required this.createdAt,
    required this.user,
  });

  factory StudyMessage.fromJson(Map<String, dynamic> json) {
    return StudyMessage(
      id: json['id'],
      content: json['content'],
      createdAt: DateTime.parse(json['createdAt']),
      user: json['user'] ?? {},
    );
  }
}

class StudyRepository {
  final String? token;

  StudyRepository({this.token});

  Future<List<StudyRoom>> getOpenRooms() async {
    final response = await http.get(
      Uri.parse('${Constants.apiBaseUrl}/study/rooms'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => StudyRoom.fromJson(json)).toList();
    } else {
      throw Exception('Error al cargar salas de estudio');
    }
  }

  Future<void> createRoom(String title, String theme, String description) async {
    final response = await http.post(
      Uri.parse('${Constants.apiBaseUrl}/study/create'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        'title': title,
        'theme': theme,
        'description': description,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Error al crear sala de estudio');
    }
  }

  Future<List<StudyMessage>> getMessages(String roomId) async {
    final response = await http.get(
      Uri.parse('${Constants.apiBaseUrl}/study/messages/$roomId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => StudyMessage.fromJson(json)).toList();
    } else {
      throw Exception('Error al cargar mensajes');
    }
  }

  Future<void> sendMessage(String roomId, String content) async {
    final response = await http.post(
      Uri.parse('${Constants.apiBaseUrl}/study/send'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        'roomId': roomId,
        'content': content,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Error al enviar mensaje');
    }
  }
}
