import 'package:uuid/uuid.dart';
import '../../../core/repositories/base_repository.dart';
import 'models/group_model.dart';

class GroupsRepository extends BaseRepository {
  // Fetch groups the user belongs to
  Future<List<Group>> getMyGroups(String userId) async {
    final conn = await db.connection;
    try {
      final result = await conn.execute(r'''
        SELECT g.*, u.name as "leaderName", 
               (SELECT COUNT(*) FROM "GroupMember" gm2 WHERE gm2."groupId" = g.id) as "memberCount"
        FROM "Group" g
        JOIN "GroupMember" gm ON g.id = gm."groupId"
        JOIN "User" u ON g."leaderId" = u.id
        WHERE gm."userId" = $1
        ORDER BY g."updatedAt" DESC
        ''', parameters: [userId]);

      return result.map((row) => Group.fromMap(row.toColumnMap())).toList();
    } catch (e) {
      print('ERROR DB GETMYGROUPS: $e');
      return [];
    }
  }

  Future<Group?> getGroupDetails(String groupId) async {
    final conn = await db.connection;
    try {
      final result = await conn.execute(r'''
        SELECT g.*, u.name as "leaderName",
               (SELECT COUNT(*) FROM "GroupMember" gm2 WHERE gm2."groupId" = g.id) as "memberCount"
        FROM "Group" g
        JOIN "User" u ON g."leaderId" = u.id
        WHERE g.id = $1
        ''', parameters: [groupId]);
      if (result.isEmpty) return null;
      return Group.fromMap(result.first.toColumnMap());
    } catch (e) {
      print('ERROR DB GETGROUP: $e');
      return null;
    }
  }

  Future<bool> createTask(String groupId, String title, String type) async {
    final conn = await db.connection;
    try {
      await conn.execute(
          r'INSERT INTO "GroupTask" (id, "groupId", title, type, date) VALUES ($1, $2, $3, $4, NOW())',
          parameters: [const Uuid().v4(), groupId, title, type]);
      return true;
    } catch (e) {
      print('ERROR DB CREATETASK: $e');
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> getGroupTasks(
      String groupId, String userId) async {
    final conn = await db.connection;
    try {
      final result = await conn.execute(r'''
        SELECT gt.*, 
               (SELECT COUNT(*) FROM "GroupTaskCompletion" gtc WHERE gtc."taskId" = gt.id AND gtc."userId" = $2) as "isCompleted"
        FROM "GroupTask" gt
        WHERE gt."groupId" = $1
        ORDER BY gt."date" ASC
        ''', parameters: [groupId, userId]);
      return result.map((row) => row.toColumnMap()).toList();
    } catch (e) {
      print('ERROR DB GETTASKS: $e');
      return [];
    }
  }

  Future<bool> completeTask(String taskId, String userId) async {
    final conn = await db.connection;
    try {
      await conn.execute(
          r'INSERT INTO "GroupTaskCompletion" (id, "taskId", "userId", "completedAt") VALUES ($1, $2, $3, NOW())',
          parameters: [const Uuid().v4(), taskId, userId]);
      return true;
    } catch (e) {
      print('ERROR DB COMPLETETASK: $e');
      return false;
    }
  }

  Future<bool> submitNeed(
      String groupId, String userId, String content, bool isAnonymous) async {
    final conn = await db.connection;
    try {
      await conn.execute(
          r'INSERT INTO "GroupNeed" (id, "groupId", "userId", content, "isAnonymous", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
          parameters: [
            const Uuid().v4(),
            groupId,
            userId,
            content,
            isAnonymous
          ]);
      return true;
    } catch (e) {
      print('ERROR DB SUBMITNEED: $e');
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> getGroupNeeds(String groupId) async {
    final conn = await db.connection;
    try {
      final result = await conn.execute(
          r'SELECT * FROM "GroupNeed" WHERE "groupId" = $1 ORDER BY "createdAt" DESC',
          parameters: [groupId]);
      return result.map((row) => row.toColumnMap()).toList();
    } catch (e) {
      print('ERROR DB GETNEEDS: $e');
      return [];
    }
  }

  Future<List<GroupMember>> getGroupMembers(String groupId) async {
    final conn = await db.connection;
    try {
      final result = await conn.execute(r'''
        SELECT gm.*, u.name as "userName", u.image as "userImage"
        FROM "GroupMember" gm
        JOIN "User" u ON gm."userId" = u.id
        WHERE gm."groupId" = $1
        ORDER BY gm."joinedAt" ASC
        ''', parameters: [groupId]);
      return result
          .map((row) => GroupMember.fromMap(row.toColumnMap()))
          .toList();
    } catch (e) {
      print('ERROR DB GETMEMBERS: $e');
      return [];
    }
  }

  Future<bool> joinGroup(String userId, String accessCode) async {
    final conn = await db.connection;
    try {
      // 1. Find group by code
      final groupResult = await conn.execute(
          r'SELECT id FROM "Group" WHERE "accessCode" = $1 LIMIT 1',
          parameters: [accessCode]);

      if (groupResult.isEmpty) return false;
      final groupId = groupResult.first[0] as String;

      // 2. Check if already member
      final memberCheck = await conn.execute(
          r'SELECT id FROM "GroupMember" WHERE "groupId" = $1 AND "userId" = $2',
          parameters: [groupId, userId]);

      if (memberCheck.isNotEmpty) return true; // Already member

      // 3. Add member
      final id = const Uuid().v4();
      await conn.execute(r'''
        INSERT INTO "GroupMember" (id, "groupId", "userId", role, "joinedAt", "weeklyXP", "totalXP")
        VALUES ($1, $2, $3, 'MEMBER', NOW(), 0, 0)
        ''', parameters: [id, groupId, userId]);

      return true;
    } catch (e) {
      print('ERROR DB JOIN GROUP: $e');
      return false;
    }
  }

  Future<bool> createGroup(String userId, String name, String motto) async {
    final conn = await db.connection;
    final groupId = const Uuid().v4();
    // Simple random code generator
    final accessCode = Uuid().v4().substring(0, 6).toUpperCase();

    try {
      // Transaction-like sequence
      // 1. Create Group
      await conn.execute(r'''
        INSERT INTO "Group" (id, name, motto, "accessCode", "leaderId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ''', parameters: [groupId, name, motto, accessCode, userId]);

      // 2. Add Leader as ADMIN Member
      final memberId = const Uuid().v4();
      await conn.execute(r'''
        INSERT INTO "GroupMember" (id, "groupId", "userId", role, "joinedAt", "weeklyXP", "totalXP")
        VALUES ($1, $2, $3, 'ADMIN', NOW(), 0, 0)
        ''', parameters: [memberId, groupId, userId]);

      return true;
    } catch (e) {
      print('ERROR DB CREATE GROUP: $e');
      return false;
    }
  }

  Future<bool> submitLeaderApplication({
    required String userId,
    required String fullName,
    required String documentId,
    required DateTime birthDate,
    required String address,
    required String maritalStatus,
    required String testimony,
    required String motivation,
  }) async {
    final conn = await db.connection;
    final id = const Uuid().v4();
    try {
      await conn.execute(r'''
        INSERT INTO "LeaderApplication" (id, "userId", status, "fullName", "documentId", "birthDate", address, "maritalStatus", testimony, motivation, "createdAt", "updatedAt")
        VALUES ($1, $2, 'PENDING', $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        ''', parameters: [
        id,
        userId,
        fullName,
        documentId,
        birthDate.toIso8601String(),
        address,
        maritalStatus,
        testimony,
        motivation
      ]);

      // Update User profile type to COOPERATOR (auto-approve for MVP)
      await conn.execute(
          r"UPDATE 'User' SET 'profileType' = 'COOPERATOR' WHERE id = $1"
              .replaceAll("'", '"'),
          parameters: [userId]);

      return true;
    } catch (e) {
      print('ERROR DB SUBMIT APP: $e');
      return false;
    }
  }
}
