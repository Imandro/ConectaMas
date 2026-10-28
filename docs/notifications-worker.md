# Worker de notificaciones

El motor procesa suscripciones en lotes de 100, con máximo 10 envíos concurrentes.
El cursor usa `PushSubscription.id`, ordenado ascendente. Así el proceso no carga todas las suscripciones en memoria.

El worker acepta ajustes sin recompilar:

```bash
NOTIFICATIONS_BATCH_SIZE=100 \
NOTIFICATIONS_CONCURRENCY=10 \
npm run notifications:worker
```

Cada lote y el resumen final salen como JSON con `sent`, `failed`, `expired`, `processed` y `durationMs`.
Así el proveedor externo puede alertar por fallos, duración o suscripciones expiradas.

## Worker externo

Ejecutar fuera de Vercel, con `DATABASE_URL`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y `VAPID_SUBJECT`:

```bash
npm ci
npx prisma generate
npm run notifications:worker
```

Programar una ejecución periódica en el proveedor del worker. El proceso recorre todos los lotes y termina al no recibir `nextCursor`.

## Endpoint temporal

Vercel Cron o un servicio externo puede procesar un lote:

```http
GET /api/notifications/engine?limit=100
Authorization: Bearer <NOTIFICATIONS_ENGINE_SECRET>
```

Continuar con `?cursor=<nextCursor>` mientras `hasMore` sea `true`.

El secreto no va en query string. El endpoint responde `Cache-Control: no-store`.

## Release y DB

`npm run build` solo ejecuta `prisma generate && next build`.
Aplicar esquema en release separado:

```bash
npm run db:migrate:deploy
```

No activar pooling DB sin métricas de conexiones, espera de pool, duración y errores.
