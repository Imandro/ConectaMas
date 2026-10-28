# Conecta+ Legal Readiness

Estado: readiness técnico y documental. Los textos son borradores y requieren revisión profesional antes de publicar.

## Operación

- Operador: Mario Alvarez.
- Contacto legal y reportes: `marioalejandroruiz28@gmail.com`.
- Idiomas legales: español, inglés y portugués.
- Edad base: 13 años.
- Países sin matriz aprobada y `OTHER`: bloqueados.
- Países con requisito local superior: bloqueados hasta revisión.

## Enforcement implementado

- Registro web y móvil exige edad, país, términos y privacidad.
- El servidor valida país, edad, idioma y versiones legales.
- `LegalConsent` conserva historial por documento, versión, idioma, país, canal y fecha.
- Usuarios antiguos quedan en un gate hasta aceptar versiones actuales.
- Las rutas de cuenta permiten exportación y borrado aunque falte reaceptación.
- APIs autenticadas rechazan operaciones protegidas cuando falta consentimiento vigente.
- Aceptación de documentos requiere conexión.

## Datos y derechos

- Exportación JSON sin contraseñas, hashes, sesiones, tokens ni secretos.
- Borrado bloquea suscripciones activas; primero se cancela en el proveedor.
- Pagos se desvinculan de la cuenta y se conserva solo información mínima sin identificador directo.
- localStorage, sessionStorage, IndexedDB, cachés privadas y colas offline se limpian durante el borrado local; el precache estático se conserva.
- Vercel Analytics carga solo con consentimiento analítico.
- No se carga publicidad de terceros ni se usan datos espirituales para segmentación.

## Comunidad

- Reglas visibles antes de publicar o responder.
- El servidor exige `communityRulesAccepted`.
- Reportes: `marioalejandroruiz28@gmail.com`.

## Publicación

1. Confirmar domicilio y entidad operadora con asesoría local.
2. Revisar textos y matriz de países con abogado.
3. Completar Google Play Privacy Policy, Data Safety, Account Deletion y edades objetivo.
4. Probar registro, gate, exportación, borrado y reaceptación en staging.
5. Validar PayPal, Pagadito y Google Play, incluyendo reembolsos y cancelación.
6. Mantener pagos desactivados hasta cerrar los puntos anteriores.
