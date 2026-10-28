# Inventario de rutas offline — Fase 1, agente 1

Auditoría de `app/api` y pantallas dashboard. La clasificación describe el contenido principal de cada pantalla:

- **static**: el contenido primario está en código o assets locales. Puede tener escrituras o telemetría online opcionales.
- **snapshot**: depende de datos por usuario/servidor; funciona offline solo con una página o snapshot previamente guardado.
- **online-only**: necesita datos actuales del servidor para mostrar su contenido o completar su flujo.

## Matriz

| Grupo | Rutas | Clasificación | Evidencia / dependencia |
| --- | --- | --- | --- |
| Biblia | `/dashboard/bible` | static | `public/bible/es_rvr.json`, `app/lib/versesData.ts`; heartbeat y posición de lectura son accesorios online. |
| Devocionales | `/dashboard/devotionals`, `/dashboard/devotionals/:id` | static | `app/lib/devotionalsData.ts`; marcar completado usa `POST /api/devotionals/complete` solo al pulsar el botón. |
| Reto diario | `/dashboard/challenge` | static | `app/lib/challengeData.ts`; `POST /api/challenge/complete` solo persiste el resultado. |
| Juegos individuales | `/dashboard/games/{verse-order,speed-quiz,fill-blank,book-sort,book-match}` | static | Preguntas en `app/data/games/*`; la puntuación intenta server action y tiene fallback local. |
| SOS | `/dashboard/sos` | static | Contenido en `app/lib/sosData.ts`; el teléfono del líder se consulta online y se guarda en snapshot privado por usuario. |
| Dashboard y estado personal | `/dashboard`, `/dashboard/profile`, `/dashboard/luchas/**`, `/dashboard/llami`, `/dashboard/mascot`, `/dashboard/prayer` | snapshot | Datos de usuario/servidor; `/dashboard` y `/dashboard/llami` sí leen/escriben snapshot explícito. |
| Check-in | `/dashboard/checkin` | cola de mutaciones | El historial se lee online; los check-ins se encolan offline con `dayKey` e idempotencia y se drenan al recuperar red. |
| Comunidad y consultas | `/dashboard/forums/**`, `/dashboard/groups/**`, `/dashboard/friends`, `/dashboard/qa/**` | online-only | Lecturas/escrituras dependen de server actions o `/api/forums/*`, grupos, amigos y Q&A. |
| Trivia y multijugador | `/dashboard/trivia`, `/dashboard/games`, `/dashboard/games/:roomId` | online-only | Trivia usa `/api/trivia/*`; lobby/salas usan acciones y estado compartido. |
| API | `/api/**` | online-only salvo cola explícita | Las escrituras de check-in y progreso `ADVANCE`/`OVERCOME` usan la cola; el resto sigue siendo límite de red. `/api/bible` y `/api/devotionals` son endpoints de contenido local duplicado. |

SOS no consulta DB durante el render. Sin snapshot de teléfono, conserva oraciones y verdades, pero oculta la llamada al líder.

## Llamadas API detectadas que no son contenido local

- `app/dashboard/bible/page.tsx`: `POST /api/mascot/heartbeat` solo otorga actividad/puntos; el texto bíblico se carga desde `/bible/es_rvr.json`.
- `app/dashboard/challenge/page.tsx`: `POST /api/challenge/complete` solo persiste la finalización; las preguntas son locales.
- `app/dashboard/devotionals/DevotionalCompletionButton.tsx`: `POST /api/devotionals/complete` solo persiste la finalización; el devocional es local.
- `app/components/DashboardNav.tsx`: `GET /api/notifications/qa-count` es una insignia global, no dependencia del contenido de la pantalla.
- `app/components/TriviaGame.tsx`: `/api/trivia/*` sí es dependencia de la trivia dentro de `/dashboard/llami`; no debe confundirse con el snapshot base de Llami.

## APIs locales duplicadas

- `app/api/bible/route.ts` vuelve a leer `public/bible/es_rvr.json`, pero no hay consumidor UI para `/api/bible`; Biblia usa el asset estático directamente.
- `app/api/devotionals/route.ts` parte de `devotionalsData`, pero no hay consumidor UI para `GET /api/devotionals`; además añade recomendaciones y completados ligados a usuario, por lo que no se elimina en esta fase sin auditar clientes externos.

La prueba `scripts/test-offline-routes.js` verifica la clasificación vigente, las fuentes locales y que esas dos APIs no tengan consumidores UI directos. No se cambió lógica de producción.
