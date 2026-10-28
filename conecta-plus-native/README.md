# Conecta+ Android Capacitor

Proyecto nativo Android Capacitor para `com.conecta_plus.app`.

Configuración de Play:

- `versionCode`: `11`
- `versionName`: `1.9`
- `targetSdk`: `36`

El proyecto carga `https://conectaplus.app` porque la aplicación Next.js usa SSR y APIs server-side. `CAPACITOR_SERVER_URL` permite usar otra URL HTTPS en pruebas. El marcador `conecta_native=capacitor` permite ocultar pagos web dentro del contenedor Android.

## Abrir y compilar

```powershell
npm install
npm run android:sync
npm run android:open
```

Para generar el AAB firmado, configura un keystore de release y ejecuta:

```powershell
npm run android:bundle
```

El script usa automáticamente un JDK 17 local en `.tools/` si existe; también acepta `JAVA_HOME`.

El archivo esperado queda en `android/app/build/outputs/bundle/release/app-release.aab`.

También puedes copiar `key.properties.example` a `android/key.properties`, cambiar sus valores y guardar el `.jks` en `android/`. Ambos archivos quedan ignorados por Git.

No subas `android/app/build/outputs/` ni claves al repositorio.
