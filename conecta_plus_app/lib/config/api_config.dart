import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConfig {
  // CONFIGURACIÓN DINÁMICA
  static String get baseUrl {
    // URL de producción (Vercel)
    const String prodUrl = 'https://conecta-mas.vercel.app/api/';
    
    // Cambia esta variable a 'true' para usar producción en lugar de local
    const bool useProduction = true; 

    if (useProduction) {
      return prodUrl;
    }

    if (kIsWeb) {
      return 'http://localhost:3000/api';
    }
    
    try {
      if (Platform.isAndroid) {
        // 10.0.2.2 es la IP para acceder al localhost de la máquina desde el emulador Android
        return 'http://10.0.2.2:3000/api';
      }
      if (Platform.isIOS) {
        return 'http://localhost:3000/api';
      }
    } catch (e) {
      // Platform check can fail on some environments
    }

    return 'http://localhost:3000/api';
  }

  // URL para IP Local (Manual): si pruebas en dispositivo físico real, 
  // usa tu IP local (ej. 192.168.1.XX) en lugar de localhost.
}
