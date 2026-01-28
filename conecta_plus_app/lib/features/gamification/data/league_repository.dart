import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../config/constants.dart';
import '../../auth/data/models/user_model.dart';

class LeagueRepository {
  final String? token;

  LeagueRepository({this.token});

  Future<List<User>> getLeagueRanking() async {
    final response = await http.get(
      Uri.parse('${Constants.apiBaseUrl}/leagues/ranking'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => User.fromJson(json)).toList();
    } else {
      throw Exception('Error al cargar el ranking de la liga');
    }
  }
}
