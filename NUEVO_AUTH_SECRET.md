# 🔐 Nuevo AUTH_SECRET para Invalidar Sesiones

## Nuevo AUTH_SECRET Generado

```
EEGsMZSRWa+oSSqNOkPYpRvp/x/JJrc0x65DkFwW1Y0I=
```

## Instrucciones para Actualizar en Vercel

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **Conecta+**
3. Ve a **Settings** → **Environment Variables**
4. Busca la variable `AUTH_SECRET` o `NEXTAUTH_SECRET`
5. Haz clic en **Edit**
6. Reemplaza el valor actual con:
   ```
   EEGsMZSRWa+oSSqNOkPYpRvp/x/JJrc0x65DkFwW1Y0I=
   ```
7. Asegúrate de que esté marcada para **Production**, **Preview**, y **Development**
8. Haz clic en **Save**
9. Vercel te preguntará si quieres **Redeploy** → Haz clic en **Redeploy**

### Opción 2: Desde la Terminal (Más Rápido)

Si tienes Vercel CLI instalado:

```bash
vercel env add AUTH_SECRET production
# Pega el valor: EEGsMZSRWa+oSSqNOkPYpRvp/x/JJrc0x65DkFwW1Y0I=

vercel --prod
```

## ¿Qué Pasará?

Una vez que actualices el `AUTH_SECRET` y se complete el redespliegue:

✅ **Todas las sesiones existentes serán inválidas automáticamente**
- Los usuarios verán que su sesión expiró
- Serán redirigidos al login automáticamente
- Deberán iniciar sesión de nuevo con sus credenciales

✅ **Las nuevas sesiones funcionarán correctamente**
- Los nuevos tokens JWT tendrán la estructura correcta
- Los nombres de usuario se mostrarán correctamente
- El error digest 3420075746 desaparecerá

## Tiempo Estimado

- **Actualización de variable**: 30 segundos
- **Redespliegue en Vercel**: 2-3 minutos
- **Propagación**: Inmediata después del deploy

## Verificación

Después del redespliegue:

1. Abre tu app en producción
2. Deberías ser redirigido automáticamente al login
3. Inicia sesión
4. Verifica que tu nombre aparezca correctamente

---

**Nota**: No necesitas enviar ningún mensaje a los usuarios. Simplemente serán desconectados automáticamente y podrán volver a iniciar sesión cuando quieran.
