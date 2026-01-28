import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../config/constants.dart';

class GameRoom {
  final String id;
  final String code;
  final String status;
  final String? currentTurnUserId;
  final DateTime? bombExplodesAt;
  final List<GamePlayer> players;

  GameRoom({
    required this.id,
    required this.code,
    required this.status,
    this.currentTurnUserId,
    this.bombExplodesAt,
    required this.players,
  });

  factory GameRoom.fromJson(Map<String, dynamic> json) {
    return GameRoom(
      id: json['id'],
      code: json['code'],
      status: json['status'],
      currentTurnUserId: json['currentTurnUserId'],
      bombExplodesAt: json['bombExplodesAt'] != null 
          ? DateTime.parse(json['bombExplodesAt']) 
          : null,
      players: (json['players'] as List? ?? [])
          .map((p) => GamePlayer.fromJson(p))
          .toList(),
    );
  }
}

class GamePlayer {
  final String userId;
  final String status;
  final String name;
  final String? image;

  GamePlayer({
    required this.userId,
    required this.status,
    required this.name,
    this.image,
  });

  factory GamePlayer.fromJson(Map<String, dynamic> json) {
    return GamePlayer(
      userId: json['userId'],
      status: json['status'],
      name: json['user']?['name'] ?? 'Usuario',
      image: json['user']?['image'],
    );
  }
}

class PotatoRepository {
  final String? token;

  PotatoRepository({this.token});

  Future<GameRoom> createRoom() async {
    final response = await http.post(
      Uri.parse('${Constants.apiBaseUrl}/games/create'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return GameRoom.fromJson(data['room']);
    } else {
      throw Exception('Error al crear sala de juego');
    }
  }

  Future<String> joinRoom(String code) async {
    final response = await http.post(
      Uri.parse('${Constants.apiBaseUrl}/games/join'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({'code': code}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['roomId'];
    } else {
      throw Exception('Sala no encontrada o ya iniciada');
    }
  }

  Future<void> startGame(String roomId) async {
    final response = await http.post(
      Uri.parse('${Constants.apiBaseUrl}/games/start'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({'roomId': roomId}),
    );

    if (response.statusCode != 200) {
      throw Exception('Error al iniciar el juego');
    }
  }

  Future<bool> passPotato(String roomId, String answer) async {
    final response = await http.post(
      Uri.parse('${Constants.apiBaseUrl}/games/submit'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        'roomId': roomId,
        'answer': answer,
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['exploded'] ?? false;
    } else {
      throw Exception('Error al pasar la papa');
    }
  }

  Future<GameRoom> getRoomStatus(String roomId) async {
    final response = await http.get(
      Uri.parse('${Constants.apiBaseUrl}/games/status/$roomId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return GameRoom.fromJson(data['room']);
    } else {
      throw Exception('Error al obtener estado del juego');
    }
  }
}
