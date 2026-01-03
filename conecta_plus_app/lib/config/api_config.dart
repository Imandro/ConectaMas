import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConfig {
  // CONFIGURACIÓN DINÁMICA
  static String get baseUrl {
    // Si tienes un dominio de producción, descomenta la siguiente línea y pon tu URL:
    // return 'https://conecta-plus-beta.vercel.app/api'; 

    if (kIsWeb) {
      return 'http://localhost:3000/api';
    }
    
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:3000/api';
      }
    } catch (e) {
      // Platform check can fail on some environments
    }

    return 'http://localhost:3000/api';
  }

  // URL para IP Local (Manual): si pruebas en dispositivo físico real, 
  // usa tu IP local (ej. 192.168.1.XX) en lugar de localhost.
}
