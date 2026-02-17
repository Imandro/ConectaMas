import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../config/api_config.dart';

class VerseRepository {
  final String baseUrl = ApiConfig.baseUrl;

  Future<Map<String, dynamic>?> getDailyVerse() async {
    try {
      final response = await http.get(
        Uri.parse('${baseUrl}verses/daily'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'content': data['content'],
          'reference': data['reference'],
          'imageUrl': data['imageUrl'] ??
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600",
        };
      } else {
        print('ERROR FETCHING VERSE: ${response.statusCode}');
        // Return fallback verse
        return {
          'content': "Entonces no sería yo avergonzado.",
          'reference': "Salmos 119:6",
          'imageUrl':
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600",
        };
      }
    } catch (e) {
      print('ERROR FETCHING VERSE: $e');
      // Return fallback verse on error
      return {
        'content': "Entonces no sería yo avergonzado.",
        'reference': "Salmos 119:6",
        'imageUrl':
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600",
      };
    }
  }
}
