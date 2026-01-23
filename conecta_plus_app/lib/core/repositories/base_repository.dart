import 'package:postgres/postgres.dart';
import '../services/database_service.dart';

abstract class BaseRepository {
  final DatabaseService db = DatabaseService();

  Future<Result> query(String sql, {Map<String, dynamic>? substitutionValues, List<dynamic>? parameters}) async {
    final conn = await db.connection;
    try {
      return await conn.execute(sql, parameters: parameters);
    } catch (e) {
      print('DB QUERY ERROR: $e | SQL: $sql');
      rethrow;
    }
  }
}
