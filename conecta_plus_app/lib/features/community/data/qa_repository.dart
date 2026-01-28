import 'package:uuid/uuid.dart';
import '../../../core/repositories/base_repository.dart';
import 'question_model.dart';

class QARepository extends BaseRepository {
  
  Future<List<Question>> getDailyQuestions() async {
    final conn = await db.connection;
    try {
      // Logic for "Daily/Trending" questions
      // We'll pick top 3 based on 'views + likes*2' or just latest trending
      final result = await conn.execute(
        r'''
        SELECT q.*, u.name as "userName", u.image as "userImage"
        FROM "Question" q
        JOIN "User" u ON q."userId" = u.id
        ORDER BY q.views DESC, q.likes DESC
        LIMIT 3
        '''
      );
      
      return result.map((row) => Question.fromMap(row.toColumnMap())).toList();
    } catch (e) {
      print('ERROR DB GETDAILY: $e');
      return [];
    }
  }
  
  Future<List<Question>> getAllQuestions({String? search}) async {
    final conn = await db.connection;
    try {
      String sql = r'''
        SELECT q.*, u.name as "userName", u.image as "userImage"
        FROM "Question" q
        JOIN "User" u ON q."userId" = u.id
      ''';
      
      List<dynamic> params = [];
      
      if (search != null && search.isNotEmpty) {
        sql += r' WHERE q.title ILIKE $1 OR q.content ILIKE $1';
        params.add('%$search%');
      }
      
      sql += ' ORDER BY q."createdAt" DESC LIMIT 50';
      
      final result = await conn.execute(sql, parameters: params);
      
      return result.map((row) => Question.fromMap(row.toColumnMap())).toList();
    } catch (e) {
      print('ERROR DB GETALL: $e');
      return [];
    }
  }
  
  Future<Question?> getQuestionDetail(String id) async {
    final conn = await db.connection;
    try {
      // Increment View Count
      await conn.execute(r'UPDATE "Question" SET views = views + 1 WHERE id = $1', parameters: [id]);
      
      final result = await conn.execute(
        r'''
        SELECT q.*, u.name as "userName", u.image as "userImage"
        FROM "Question" q
        JOIN "User" u ON q."userId" = u.id
        WHERE q.id = $1
        ''',
        parameters: [id]
      );
      
      if (result.isEmpty) return null;
      return Question.fromMap(result.first.toColumnMap());
    } catch (e) {
      print('ERROR DB GETDETAIL: $e');
      return null;
    }
  }
  
  Future<List<Answer>> getAnswers(String questionId) async {
    final conn = await db.connection;
    try {
      final result = await conn.execute(
        r'''
        SELECT a.*, u.name as "userName", u.image as "userImage"
        FROM "Answer" a
        JOIN "User" u ON a."userId" = u.id
        WHERE a."questionId" = $1
        ORDER BY a."isAccepted" DESC, a.likes DESC, a."createdAt" ASC
        ''',
        parameters: [questionId]
      );
      
      return result.map((row) => Answer.fromMap(row.toColumnMap())).toList();
    } catch (e) {
      print('ERROR DB GETANSWERS: $e');
      return [];
    }
  }
  
  Future<bool> createQuestion({required String userId, required String title, required String content}) async {
    final conn = await db.connection;
    final id = const Uuid().v4();
    try {
      await conn.execute(
        r'''
        INSERT INTO "Question" (id, "userId", title, content, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ''',
        parameters: [id, userId, title, content]
      );
      return true;
    } catch (e) {
      print('ERROR DB CREATE Q: $e');
      return false;
    }
  }
  
  Future<bool> createAnswer({required String userId, required String questionId, required String content}) async {
     final conn = await db.connection;
    final id = const Uuid().v4();
    try {
      await conn.execute(
        r'''
        INSERT INTO "Answer" (id, "userId", "questionId", content, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ''',
        parameters: [id, userId, questionId, content]
      );
      return true;
    } catch (e) {
      print('ERROR DB CREATE A: $e');
      return false;
    }
  }
}
