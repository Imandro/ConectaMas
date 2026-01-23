import 'package:uuid/uuid.dart';
import '../../../core/repositories/base_repository.dart';
import 'models/struggle_model.dart';

class StruggleRepository extends BaseRepository {
  Future<List<Struggle>> fetchUserStruggles(String userId) async {
    try {
      final result = await query(
        'SELECT * FROM "UserStruggle" WHERE "userId" = \$1',
        parameters: [userId],
      );

      return result.map((row) {
        final data = row.toColumnMap();
        return Struggle(
          id: data['id'].toString(),
          title: data['title'] as String,
          description: 'Tu plan de transformación diaria.',
          status: data['status'] == 'OVERCOME' ? StruggleStatus.vencido : StruggleStatus.active,
          currentDay: data['currentDay'] as int? ?? 1,
          completedDays: (data['completedDays'] as String? ?? '')
              .split(',')
              .where((s) => s.isNotEmpty)
              .map((s) => int.parse(s))
              .toList(),
          isStarted: data['isStarted'] as bool? ?? false,
          startDate: data['startDate'] as DateTime?,
          days: [], // Fetched as needed
        );
      }).toList();
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
      if (action == 'complete_day' && dayNumber != null) {
        // SQL logic to append dayNumber to completedDays if not present
        // Note: Raw SQL for appending to comma-separated string can be tricky.
        // For now, let's fetch, update in memory, and save.
        
        final result = await query(
          'SELECT "completedDays", "currentDay" FROM "UserStruggle" WHERE id = \$1',
          parameters: [struggleId],
        );
        
        if (result.isNotEmpty) {
          final data = result.first.toColumnMap();
          String completed = data['completedDays'] as String? ?? '';
          List<String> list = completed.split(',').where((s) => s.isNotEmpty).toList();
          
          if (!list.contains(dayNumber.toString())) {
            list.add(dayNumber.toString());
            String newCompleted = list.join(',');
            int nextDay = dayNumber + 1;
            
            await query(
              'UPDATE "UserStruggle" SET "completedDays" = \$1, "currentDay" = \$2, "updatedAt" = NOW() WHERE id = \$3',
              parameters: [newCompleted, nextDay, struggleId],
            );
          }
        }
      } else if (action == 'start') {
        await query(
          'UPDATE "UserStruggle" SET "isStarted" = true, "startDate" = NOW(), "updatedAt" = NOW() WHERE id = \$1',
          parameters: [struggleId],
        );
      } else if (action == 'reset') {
        await query(
          'UPDATE "UserStruggle" SET "isStarted" = false, "startDate" = NULL, "completedDays" = \'\', "currentDay" = 1, "updatedAt" = NOW() WHERE id = \$1',
          parameters: [struggleId],
        );
      }
    } catch (e) {
      print('ERROR UPDATING STRUGGLE: $e');
      rethrow;
    }
  }

  Future<void> addStruggle({required String userId, required String title}) async {
    try {
      await query(
        'INSERT INTO "UserStruggle" (id, "userId", title, status, "currentDay", "completedDays", "isStarted", "createdAt", "updatedAt") VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, NOW(), NOW())',
        parameters: [const Uuid().v4(), userId, title, 'ACTIVE', 1, '', false],
      );
    } catch (e) {
      print('ERROR ADDING STRUGGLE: $e');
      rethrow;
    }
  }
}
