# Checklist de escalabilidad

## Antes de release

- Ejecutar `npm run test:scalability`.
- Ejecutar suite offline, sync, idempotencia y billing.
- Ejecutar `npx tsc --noEmit`.
- Ejecutar ESLint sobre archivos modificados.
- Ejecutar `git diff --check`.
- Confirmar que `npm run build` usa `prisma generate && next build`.
- Confirmar que build no ejecuta `prisma db push`.

## Release

- Ejecutar `npm run db:migrate:deploy` en un paso separado.
- No ejecutar migraciones desde build.
- No activar pooling sin métricas de conexiones.
- Verificar instalación Capacitor/PWA online y offline.

## Ventana de comparación

Comparar durante 24 horas contra release anterior:

- Invocaciones Vercel.
- Duración y p95.
- Bytes transferidos.
- Errores HTTP.
- Consultas Prisma.
- Conexiones DB.

## Rollback

Revertir archivos modificados de la optimización. No requiere rollback de esquema.
