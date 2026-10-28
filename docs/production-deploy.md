# Despliegue manual a producción

## 1. Configura variables

Configura estas variables en el entorno de producción. No subas archivos `.env`.

Si un secreto apareció alguna vez en Git, rótalo antes del despliegue. Eliminar el archivo no elimina su historial.

```env
DATABASE_URL=<PostgreSQL de producción>
NEXTAUTH_SECRET=<secreto aleatorio de 32 bytes o más>
NEXTAUTH_URL=https://<dominio>
NEXT_PUBLIC_APP_URL=https://<dominio>
NOTIFICATIONS_ENGINE_SECRET=<secreto aleatorio>
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<clave pública VAPID>
VAPID_PRIVATE_KEY=<clave privada VAPID>
VAPID_SUBJECT=mailto:<correo operativo>
BILLING_WEB_ENABLED=false
BILLING_PLAY_ENABLED=false
```

Para activar pagos, completa primero las credenciales y pruebas de `docs/billing-runbook.md`.

## 2. Instala y migra

Ejecuta desde esta rama y contra la base de datos correcta:

```powershell
npm ci
npx prisma migrate deploy
npm run build
```

No uses `prisma db push` en producción.

Antes de publicar, ejecuta el gate de dependencias y corrige o acepta con revisión cada vulnerabilidad alta/crítica:

```powershell
npm audit --omit=dev --audit-level=high
```

No uses `npm audit fix --force` sin revisar cambios de versión mayor. La rama actual mantiene dependencias legacy que requieren actualización planificada.

## 3. Arranca

```powershell
npm run start
```

Verifica primero `GET /api/health` y espera `{ "status": "ok" }`. Después verifica `/`, `/offline`, `/auth/login`, `/auth/register` y un flujo autenticado. Comprueba también registro, login móvil, consentimiento legal, exportación y borrado de cuenta.

Confirma en el proveedor que `AUTH_SECRET` o `NEXTAUTH_SECRET`, `DATABASE_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, `NOTIFICATIONS_ENGINE_SECRET` y VAPID estén configurados. Nunca uses los valores de `.env.example`.

## 4. Reversión

Si falla la aplicación, vuelve al commit anterior y redepliega. Mantén las migraciones aditivas; no borres tablas ni columnas durante una reversión.

Después del despliegue revisa errores, latencia, notificaciones y respuestas `5xx` durante la primera hora.
