# Runbook de Billing Conecta+

## Estado inicial

Checkout permanece apagado hasta aprobar y verificar PayPal Business, Pagadito Comercio, Google Play Merchant, webhooks y retiro en Nicaragua.

```env
BILLING_WEB_ENABLED=false
BILLING_PLAY_ENABLED=false
```

No activar flags con credenciales incompletas. No guardar secretos en Git, bundles ni logs.

## URLs

- PayPal webhook: `https://<dominio>/api/billing/webhooks/paypal`
- Pagadito webhook: `https://<dominio>/api/billing/webhooks/pagadito`
- Google Play RTDN push: `https://<dominio>/api/billing/webhooks/google-play`
- Google Play verify: `https://<dominio>/api/billing/google-play/verify`

## PayPal

1. Crear productos y planes en sandbox.
2. Configurar `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID` y planes mensuales.
3. Confirmar que cuenta Business recibe cobros desde países objetivo.
4. Confirmar retiro disponible hacia banco o socio elegible en Nicaragua.
5. Probar orden, captura, suscripción, renovación, cancelación, reembolso y reversión.

El pago primero liquida en PayPal Business. El retiro posterior depende de elegibilidad, comisiones, límites y tiempos del proveedor. No prometer retiro instantáneo.

## Pagadito

1. Crear comercio sandbox y obtener `PAGADITO_UID` y `PAGADITO_WSK`.
2. Confirmar cobertura por país y liquidación a cuenta nicaragüense.
3. Configurar hosts de certificados en `PAGADITO_CERT_HOSTS`.
4. Probar apoyo único y Premium anual.
5. No habilitar recurrencia Pagadito hasta confirmación comercial explícita.

## Google Play TWA y Capacitor

1. Crear `conecta_premium_monthly` y `conecta_premium_yearly` en Play Console.
2. Publicar pruebas internas con `playBilling.enabled: true`.
3. Configurar cuenta de servicio con permiso Android Publisher.
4. Configurar Pub/Sub push con audiencia exacta en `GOOGLE_PLAY_PUBSUB_AUDIENCE`.
5. Probar compra, reconocimiento, renovación, cancelación, reembolso y expiración.

Capacitor usa `@capgo/native-purchases` y los mismos productos de Play. El proyecto Android está en `conecta-plus-native/`. Configura los base plans en Play Console; el cliente usa el `planIdentifier` entregado por Google.

El TWA usa package ID configurado en `twa-manifest.json`; cambiarlo crea otra aplicación en Play si no coincide con la existente.

## Conciliación y reembolsos

- Revisar `BillingTransaction`, `BillingSubscription` y `BillingWebhookEvent`.
- Reprocesar solo eventos del proveedor con referencia válida.
- No conceder Premium por captura de pantalla, correo o edición manual.
- Solicitar reembolso en el proveedor que cobró.
- Confirmar que webhook de reembolso deja entitlement inactivo.

## Rollback

1. Poner `BILLING_WEB_ENABLED=false` y/o `BILLING_PLAY_ENABLED=false`.
2. Mantener webhooks activos si existen pagos en tránsito.
3. No borrar historial ni suscripciones.
4. Investigar eventos `REJECTED`, `REFUNDED` y `REVERSED`.
5. Reactivar solo después de corregir credenciales, firma, monto o liquidación.

## Legal y fiscal

Canal operativo legal: `marioalejandroruiz28@gmail.com`. Un abogado o contador en Nicaragua debe validar entidad operadora, domicilio, facturación, impuestos, tratamiento de apoyos, términos, reembolsos y obligaciones frente a consumidores.

La implementación no sustituye esa revisión. Mantén `BILLING_WEB_ENABLED=false` y `BILLING_PLAY_ENABLED=false` hasta confirmar cuentas comerciales, webhooks, reembolsos, borrado externo y retiro hacia Nicaragua.

La política legal vigente está en `/legal/terms`, `/legal/privacy`, `/legal/cookies`, `/legal/refunds` y `/legal/community`. No activar Monetag ni publicar campañas mientras no exista integración aprobada, CMP configurado y consentimiento aplicable.

## Monetag

1. Registrar y verificar `conectamas.live` en Monetag.
2. Crear zona `In-Page Push (Banner)`; no usar MultiTag, Popunder, Vignette, Push ni SmartLink.
3. Bloquear apuestas, casino, alcohol, sexo, drogas, política, astrología, dinero fácil y sensacionalismo.
4. Excluir Biblia, oración, SOS, diario, comunidad, pagos, legal y `conecta_native=capacitor`.
5. Verificar retiro PayPal o Payoneer para Nicaragua.
6. Configurar `MONETAG_TAG_SRC`, `MONETAG_ZONE_ID` y luego `ADS_PROVIDER=monetag`.

El valor seguro sigue siendo `ADS_PROVIDER=off`. Monetag solo aparece en Dashboard y Juegos, con máximo un banner por pantalla.
