# � Guía de Despliegue 100% GRATIS - Conecta+

Esta guía te muestra cómo tener tu aplicación funcionando en internet sin gastar un solo centavo, utilizando los mejores servicios gratuitos disponibles hoy.

---

## 🎯 El Combo Gratuito Ideal

Para que todo sea gratis, usaremos:
1.  **Frontend/Hosting**: [Vercel](https://vercel.com) (Plan Hobby - $0)
2.  **Base de Datos**: [Supabase](https://supabase.com) (Plan Free - $0) o [Vercel Postgres](https://vercel.com/storage) ($0)
3.  **Autenticación**: NextAuth (Integrado - $0)

---

## 🛠️ Paso 1: Configurar la Base de Datos (Supabase)

Como Vercel no permite usar SQLite (porque borra los archivos cada vez que se actualiza), necesitamos una base de datos en la nube. **Supabase** es la mejor opción gratuita.

1.  Crea una cuenta en [supabase.com](https://supabase.com).
2.  Crea un nuevo proyecto llamado "ConectaPlus".
3.  Ve a **Project Settings** -> **Database**.
4.  En la sección **Connection String**, busca la pestaña que dice **Connection Pooler**.
5.  Asegúrate de que el **Mode** esté en `Session` o `Transaction`.
6.  Copia la URL que usa el puerto **6543** (o el que te indique Supabase para el Pooler). Tendrá un formato como:
    `postgresql://postgres.[PROYECTO]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
7.  **IMPORTANTE**: Esta dirección es la que mejor funciona con Vercel porque evita problemas de conexión directa.
8.  **IMPORTANTE**: Cambia el archivo `prisma/schema.prisma` en tu código:
    ```prisma
    datasource db {
      provider = "postgresql" // Cambia "sqlite" por "postgresql"
      url      = env("DATABASE_URL")
    }
    ```

---

## 🚀 Paso 2: Subir a Vercel

1.  Crea una cuenta en [vercel.com](https://vercel.com) y conéctala con tu GitHub.
2.  Importa tu repositorio de **Conecta+**.
3.  En la configuración de **Environment Variables**, añade estas 3 (OBLIGATORIAS):
    *   `DATABASE_URL`: La dirección que copiaste de Supabase.
    *   `NEXTAUTH_SECRET`: Una clave cualquiera (ej: `clave-secreta-123-abc`).
    *   `NEXTAUTH_URL`: La URL que te asigne Vercel (ej: `https://conecta-plus.vercel.app`).
4.  Haz clic en **Deploy**. ¡Vercel se encargará del resto!

---

## � Paso 3: Inicializar los Datos (Gratis)

Una vez que la app esté "Live" en Vercel, necesitas meter los videos y datos iniciales en tu nueva base de datos de Supabase.

Desde tu computadora (con el `.env` apuntando a Supabase), ejecuta:
```bash
npx prisma db push      # Crea las tablas en Supabase
npm run db:seed         # Sube los 12 videos iniciales
```

---

## 📱 Ventajas de este método
- **$0 al mes**: No tienes que poner tarjeta de crédito si no quieres.
- **Escalable**: Si tu app se vuelve viral, puedes subir de plan después.
- **SSL Gratis**: Tu app tendrá el candadito verde (`https://`) automáticamente.
- **PWA lista**: Al ser HTTPS, el tutorial de "Instalar App" que hicimos funcionará perfectamente.

---

## ⚠️ Nota sobre SQLite
**¿Por qué no puedo usar SQLite gratis?**
SQLite guarda los datos en un archivo dentro de la carpeta del proyecto. Servicios gratuitos como Vercel o Render "limpian" el servidor cada vez que subes una actualización, por lo que perderías todos tus usuarios y registros. Al usar Supabase, tus datos están seguros y persistentes para siempre.

---

¡Tu ministerio digital está listo para despegar sin costos! 🚀✨
