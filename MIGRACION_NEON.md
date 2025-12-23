# 🚀 Migración a Neon - Guía Paso a Paso

## Paso 1: Crear Cuenta en Neon (2 minutos)

1. Ve a **https://neon.tech**
2. Haz clic en **"Sign Up"**
3. Usa tu cuenta de GitHub para login rápido (recomendado)
4. O usa tu email

---

## Paso 2: Crear Proyecto (1 minuto)

Una vez dentro del dashboard de Neon:

1. Haz clic en **"Create a project"**
2. **Project name**: `conecta-plus-production`
3. **Region**: Selecciona la más cercana a tus usuarios (probablemente `US East (Ohio)` o `US West (Oregon)`)
4. **PostgreSQL version**: Deja la predeterminada (16)
5. Haz clic en **"Create project"**

---

## Paso 3: Obtener Connection String

Después de crear el proyecto, verás un dashboard con tu connection string:

1. Busca la sección **"Connection Details"**
2. Copia el **"Connection string"** que dice `postgresql://...`
3. **IMPORTANTE**: Asegúrate de copiar la versión que dice `?sslmode=require` al final

Debería verse así:
```
postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## Paso 4: Actualizar Variables de Entorno Locales

Abre tu archivo `.env` local y actualiza:

```env
DATABASE_URL="postgresql://[TU_CONNECTION_STRING_DE_NEON]"
```

**Guárdalo** y continúa.

---

## Paso 5: Migrar el Schema

Ahora vamos a crear todas las tablas en Neon. En tu terminal:

```bash
# Generar Prisma Client
npx prisma generate

# Crear todas las tablas en Neon
npx prisma db push

# Verificar que se crearon correctamente
npx prisma studio
```

Prisma Studio se abrirá en tu navegador. Deberías ver todas las tablas (User, ForumPost, etc.) pero vacías.

---

## Paso 6: Actualizar Vercel (Variables de Entorno)

1. Ve a **https://vercel.com/dashboard**
2. Selecciona tu proyecto **Conecta+**
3. Ve a **Settings** → **Environment Variables**
4. Busca `DATABASE_URL`
5. Haz clic en **Edit** (o **Add** si no existe)
6. Pega tu connection string de Neon:
   ```
   postgresql://[TU_CONNECTION_STRING_DE_NEON]
   ```
7. Asegúrate de marcar: **Production**, **Preview**, **Development**
8. Haz clic en **Save**

---

## Paso 7: Redeploy en Vercel

Hay dos formas:

### Opción A: Desde el Dashboard de Vercel
1. Ve a **Deployments**
2. Haz clic en los **tres puntos** del último deployment
3. Selecciona **"Redeploy"**
4. Confirma

### Opción B: Desde Git (Recomendado)
```bash
# Hacer un commit vacío para forzar redeploy
git commit --allow-empty -m "chore: trigger redeploy with Neon database"
git push origin master
```

---

## Paso 8: Verificar que Funciona

Una vez que Vercel termine de desplegar (2-3 minutos):

1. Ve a tu app en producción
2. Intenta **registrar un nuevo usuario**
3. Intenta **iniciar sesión**
4. Verifica que el dashboard cargue correctamente

Si todo funciona, ¡la migración fue exitosa! 🎉

---

## ⚠️ Nota Importante sobre Datos

Como tu base de datos anterior fue suspendida, **todos los datos anteriores se perdieron** (usuarios, posts, check-ins, etc.). 

Esto significa que:
- ✅ La app funciona perfectamente
- ❌ Los usuarios anteriores necesitan registrarse de nuevo
- ✅ No volverás a tener problemas de límites

---

## 🔍 Monitoreo

Para ver el uso de tu base de datos:

1. Ve a **https://console.neon.tech**
2. Selecciona tu proyecto
3. Ve a **"Monitoring"**
4. Verás gráficas de:
   - Storage usado
   - Compute usado
   - Conexiones activas

Con el free tier de Neon, **no te suspenderán** porque el compute es ilimitado.

---

## ✅ Checklist Final

- [ ] Cuenta de Neon creada
- [ ] Proyecto creado
- [ ] Connection string copiado
- [ ] `.env` local actualizado
- [ ] `npx prisma db push` ejecutado exitosamente
- [ ] Vercel `DATABASE_URL` actualizado
- [ ] Redeploy completado
- [ ] Registro de nuevo usuario funciona
- [ ] Login funciona
- [ ] Dashboard carga correctamente

---

**¿Listo para empezar?** Abre https://neon.tech y avísame cuando tengas tu connection string.
