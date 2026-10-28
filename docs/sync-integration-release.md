# Release de sincronización

## Checklist

- [ ] Aplicar primero la migración aditiva de `DailyCheckin.dayKey` y verificar que la columna e índice existan.
- [ ] Desplegar servidor y cliente; comprobar replay con la misma clave y que un conflicto concurrente responda retryable sin duplicar efectos.
- [ ] Confirmar que las mutaciones offline solo sean check-in y `ADVANCE`/`OVERCOME`; `START`/`RESET` siguen online-only.
- [ ] Verificar en staging una sesión que cambia de usuario: la cola anterior no se drena con la sesión nueva.
- [ ] Observar la cola hasta que no queden `pending`/`processing` anómalos y revisar errores permanentes.

## Rollback

- [ ] Revertir primero la versión de aplicación si hay errores de sincronización.
- [ ] Mantener `dayKey` e índice durante el rollback: son nullable y las filas antiguas continúan usando `createdAt`.
- [ ] No borrar datos ni ejecutar una migración destructiva; corregir y volver a desplegar la aplicación compatible.

## Métricas y señales

- Invocaciones: volumen por ruta y proporción de replay, `201`, `200`, `409`, `429` y errores `5xx`.
- Duración: p50/p95/p99 de las rutas y del drenaje de cola; tiempo desde `queued` hasta `done`.
- Bytes: request/response por operación, especialmente reintentos y payloads offline.
- Errores: `retryable`, errores permanentes, claves reutilizadas para otra operación y fallos de IndexedDB.
- Queries: duración y cantidad de consultas de `DailyCheckin`, `MutationReceipt` y `UserStruggle`; detectar N+1.
- Conexiones: conexiones activas, saturación/pool wait y timeouts de base de datos durante el drenaje.
