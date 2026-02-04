import 'package:bcrypt/bcrypt.dart';
import 'package:uuid/uuid.dart';
import '../../../core/repositories/base_repository.dart';

class AuthRepository extends BaseRepository {
  Future<Map<String, dynamic>?> login(
      String identifier, String password) async {
    final conn = await db.connection;
    final cleanIdentifier = identifier.trim();

    try {
      // Buscar usuario por email o username
      final result = await conn.execute(
        r'SELECT * FROM "User" WHERE email = $1 OR username = $2 LIMIT 1',
        parameters: [cleanIdentifier.toLowerCase(), cleanIdentifier],
      );

      if (result.isEmpty) {
        print('DEBUG DB: Usuario no encontrado');
        return null;
      }

      final userData = result.first.toColumnMap();
      final passwordHash = userData['passwordHash'] as String?;

      if (passwordHash == null) {
        print('DEBUG DB: El usuario no tiene contraseña (social login?)');
        return null;
      }

      // Verificar contraseña localmente con BCrypt
      final isValid = BCrypt.checkpw(password, passwordHash);
      if (!isValid) {
        print('DEBUG DB: Contraseña incorrecta');
        return null;
      }

      // Convertir a Map compatible
      return userData;
    } catch (e) {
      print('ERROR DB LOGIN: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String username,
    required String email,
    required String password,
    required String securityAnswer,
  }) async {
    final conn = await db.connection;

    try {
      // 1. Verificar si el usuario ya existe (Manual para evitar errores genéricos de constraint)
      final existing = await conn.execute(
        r'SELECT id FROM "User" WHERE email = $1 OR username = $2 LIMIT 1',
        parameters: [email.toLowerCase(), username],
      );

      if (existing.isNotEmpty) {
        throw Exception('El usuario o email ya existe');
      }

      // 2. Hashear contraseña con BCrypt (Cuidado: Prisma usa un formato específico, BCrypt de Dart suele ser compatible)
      final hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

      // 3. Crear ID único (UUID v4)
      final String userId = const Uuid().v4();

      // 4. Insertar en Neon
      await conn.execute(
        r'''INSERT INTO "User" (id, name, username, email, "passwordHash", "securityAnswer", role, "spiritualLevel", "updatedAt", "createdAt") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())''',
        parameters: [
          userId,
          name,
          username,
          email.toLowerCase(),
          hashedPassword,
          securityAnswer.toLowerCase().trim(),
          'USER',
          'Explorador'
        ],
      );

      // Retornar los datos del usuario creado
      return {
        'id': userId,
        'name': name,
        'username': username,
        'email': email,
        'role': 'USER'
      };
    } catch (e) {
      print('ERROR DB REGISTER: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>?> getUserById(String id) async {
    final conn = await db.connection;
    try {
      final result = await conn.execute(
        r'SELECT * FROM "User" WHERE id = $1 LIMIT 1',
        parameters: [id],
      );
      if (result.isEmpty) return null;
      return result.first.toColumnMap();
    } catch (e) {
      print('ERROR DB GETUSER: $e');
      return null;
    }
  }
}
