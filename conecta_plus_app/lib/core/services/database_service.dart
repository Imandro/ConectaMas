import 'package:postgres/postgres.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  Connection? _connection;

  Future<Connection> get connection async {
    if (_connection != null && _connection!.isOpen) {
      return _connection!;
    }
    await _connect();
    return _connection!;
  }

  Future<void> _connect() async {
    try {
      // Configuración de Neon
      final endpoint = 'ep-winter-fire-adwsfncs-pooler.c-2.us-east-1.aws.neon.tech';
      
      _connection = await Connection.open(
        Endpoint(
          host: endpoint,
          database: 'neondb',
          username: 'neondb_owner',
          password: 'npg_ubnJq5if8XSx',
        ),
        settings: const ConnectionSettings(
          sslMode: SslMode.require,
        ),
      );
      print('CONEXIÓN EXITOSA A NEON DB');
    } catch (e) {
      print('ERROR CONECTANDO A NEON: $e');
      rethrow;
    }
  }

  Future<void> close() async {
    await _connection?.close();
    _connection = null;
  }
}
