# CONECTA+ - DOCUMENTACIÓN COMPLETA DE LA APLICACIÓN

## INFORMACIÓN GENERAL

**Nombre:** Conecta+
**Tipo:** Progressive Web App (PWA)
**Propósito:** Plataforma espiritual para adolescentes y jóvenes cristianos
**Desarrollador:** Mario Alvarez
**Stack Tecnológico:** Next.js, TypeScript, Prisma, PostgreSQL, NextAuth
**Objetivo Principal:** Llevar la aplicación a Google Play Store para alcanzar a miles de adolescentes y jóvenes cristianos

---

## CARACTERÍSTICAS PRINCIPALES

### 1. AUTENTICACIÓN Y SEGURIDAD
- Sistema de registro con email y contraseña
- Inicio de sesión seguro con NextAuth
- Recuperación de contraseña mediante pregunta de seguridad
- Nombres de usuario únicos (@username)
- Posibilidad de cambiar username (limitado en frecuencia)
- Sesiones persistentes
- Protección de rutas privadas

### 2. ONBOARDING PERSONALIZADO
- **Paso 1:** Selección de género (Masculino/Femenino)
- **Paso 2:** Estado espiritual (Aceptar a Cristo, Renovar compromiso, Profundizar fe, No estoy seguro)
- **Paso 3:** Selección de pecados/luchas a superar (múltiple selección)
- **Paso 4:** Problemas que enfrenta (múltiple selección)
- **Paso 5:** Métodos preferidos de conexión con Dios (múltiple selección)
- Diseño premium con estética azul oscuro/dorado
- Datos guardados en perfil del usuario

### 3. DASHBOARD PRINCIPAL
- **Saludo personalizado** con nombre del usuario
- **Versículo del día** con diseño dorado y círculos decorativos
- **Estadísticas personales:**
  - Racha actual de días consecutivos
  - Devocionales completados
  - Nivel espiritual (Explorador, Peregrino, Discípulo, Líder, Mentor)
- **Check-in diario de salud espiritual**
- **Calendario de actividad** con visualización de racha
- **Seguimiento de luchas** con planes de acción
- **Mascota espiritual "Llami"** (llama) con evolución por racha
- **Card de donación/apoyo** (parte inferior)
- **Popup de crecimiento** (500+ usuarios, aparece 2x al día)

### 4. DEVOCIONALES
- Biblioteca de devocionales organizados por categorías
- **Categorías disponibles:**
  - Identidad en Cristo
  - Propósito y llamado
  - Relaciones sanas
  - Pureza sexual
  - Ansiedad y paz
  - Adicciones
  - Perdón
  - Liderazgo
- Filtrado interactivo por categoría
- Sistema de progreso (devocionales completados)
- Contenido completo con reflexiones y aplicaciones prácticas
- Marcado automático como completado

### 5. BIBLIA COMPLETA
- **Versión:** Reina Valera 1960
- **66 libros** del Antiguo y Nuevo Testamento
- Navegación por libro y capítulo
- Interfaz de lectura limpia y clara
- Búsqueda rápida de libros
- Versículos numerados

### 6. COMUNIDAD (FOROS)
- **Categorías de foros:**
  - Ansiedad 😰
  - Lujuria 💔
  - Adicciones 🚬
  - Depresión 😔
  - Ira 😠
  - Mentira 🤥
  - Orgullo 👑
  - Envidia 😒
  - Sugerencias y Soporte 💡
- Publicaciones públicas (visibles para todos)
- Opción de publicar de forma anónima
- Sistema de respuestas/comentarios
- Notificaciones cuando alguien responde a tu post
- **Notificaciones:**
  - Burbuja roja con contador de no leídas
  - Dropdown con lista detallada
  - Muestra foro, título del post y fecha
  - Click para navegar al post
  - Marcar como leída automáticamente
  - Botón "Marcar todas como leídas"
- Identificación de consejeros (badge especial)
- Edición y eliminación de posts propios
- Tutorial interactivo con Llami

### 7. SALUD ESPIRITUAL (CHECK-IN)
- Check-in diario de estado emocional/espiritual
- **Métricas rastreadas:**
  - Estado de ánimo (1-5 estrellas)
  - Nivel de ansiedad
  - Tiempo en oración
  - Lectura bíblica
  - Notas personales
- Calendario visual con historial
- Click en fechas para ver check-ins anteriores
- Datos aislados por usuario
- Gráficas de progreso

### 8. SEGUIMIENTO DE LUCHAS
- Creación de planes personalizados para superar luchas
- **Información de cada lucha:**
  - Nombre de la lucha
  - Nivel de dificultad
  - Fecha de inicio
  - Progreso actual
  - Notas y reflexiones
- Vista detallada en página dedicada
- Actualización de progreso
- Diseño premium con estética consistente
- Integración con datos de onboarding

### 9. SOS (EMERGENCIA ESPIRITUAL)
- **Página dedicada para momentos de crisis**
- Diseño calmante con fondo azul oscuro
- **Opciones disponibles:**
  - **Leer una promesa:** 5 verdades bíblicas aleatorias
  - **Oración de emergencia:** 5 oraciones extendidas y personales (selección aleatoria)
  - **Escuchar música:** Reproductor de música cristiana
  - **Llamar a un líder:** Llamada directa al número configurado
- **Reproductor de música:**
  - Lista de canciones cristianas
  - Controles de reproducción
  - Opción de subir nuevas canciones
  - Visualización de portadas
- Versículo de ánimo en la parte inferior
- Animaciones suaves y transiciones

### 10. PERFIL DE USUARIO
- **Información personal:**
  - Foto de perfil
  - Nombre completo
  - Username (@usuario)
  - Email
  - Edad
  - Género
- **Estadísticas:**
  - Racha actual
  - Devocionales completados
  - Nivel espiritual
  - Fecha de registro
- **Configuración:**
  - Teléfono del líder (para SOS)
  - Cambio de username
  - Cambio de edad
- Botón de cerrar sesión (rojo)

### 11. MASCOTA ESPIRITUAL "LLAMI"
- Llama virtual que evoluciona con la racha del usuario
- **Etapas de evolución:**
  - Bebé (0-6 días)
  - Joven (7-29 días)
  - Adulto (30-89 días)
  - Sabio (90+ días)
- Diálogos contextuales y motivacionales
- Animaciones y expresiones
- Tutorial interactivo para nuevas funciones
- Aparece en diferentes secciones de la app

### 12. SISTEMA DE RACHAS
- Contador de días consecutivos de actividad
- Visualización en calendario
- Indicadores visuales (fuego 🔥)
- Recompensas por mantener racha
- Afecta evolución de Llami
- Motivación para constancia diaria

### 13. NOTIFICACIONES PUSH
- Soporte para notificaciones web push
- Prompt para activar notificaciones
- **Categorías de notificaciones:**
  - Recordatorios de oración
  - Lectura bíblica
  - Devocionales
  - Cuidado de Llami
  - Check-in diario
  - Respuestas en foros
- Configuración de VAPID keys
- Service Worker para notificaciones offline

### 14. SISTEMA DE DONACIONES/APOYO
- Card de donación en dashboard
- **Información mostrada:**
  - Foto y mensaje de Mario Alvarez
  - Meta: Licencia Google Play ($25 USD)
  - Mensaje personal del desarrollador
  - Cuadro con meta y descripción
- Checkout de apoyo mediante PayPal Business o Pagadito; no se muestran enlaces manuales.
- Diseño premium con fondo oscuro

### 15. POPUP DE CRECIMIENTO
- Celebración de hitos de usuarios
- Muestra conteo real de usuarios
- Meta: 1000 usuarios
- Barra de progreso animada
- **Configuración:**
  - Aparece 2 veces al día
  - Almacenamiento en localStorage
  - Botón de compartir Conecta+
  - Web Share API integrada
- Animaciones con framer-motion

### 16. TRIVIA BÍBLICA
- Juego de preguntas y respuestas
- Preguntas sobre conocimiento bíblico
- Sistema de puntuación
- Registro de intentos por usuario
- Diseño interactivo y educativo

### 17. AMIGOS/RED SOCIAL
- Sistema de amistad entre usuarios
- Búsqueda de usuarios por username
- Envío de solicitudes de amistad
- Aceptación/rechazo de solicitudes
- Lista de amigos
- Perfil público de usuarios

---

## CARACTERÍSTICAS TÉCNICAS

### ARQUITECTURA
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL (Supabase/Vercel)
- **ORM:** Prisma
- **Autenticación:** NextAuth.js
- **Estilos:** Bootstrap 5 + CSS personalizado
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **PWA:** Service Worker, manifest.json

### MODELOS DE BASE DE DATOS
- User (usuarios)
- Devotional (devocionales)
- UserDevotional (progreso)
- DailyCheckin (check-ins)
- Streak (rachas)
- UserStruggle (luchas)
- ForumCategory (categorías de foros)
- ForumPost (publicaciones)
- ForumReply (respuestas)
- ForumNotification (notificaciones)
- Mascot (mascota Llami)
- Song (canciones)
- TriviaQuestion (preguntas trivia)
- UserTriviaAttempt (intentos)
- PushSubscription (notificaciones push)

### SEGURIDAD
- Contraseñas hasheadas con bcrypt
- Sesiones JWT
- Protección CSRF
- Validación de datos en servidor
- Sanitización de inputs
- Autenticación en todas las rutas privadas

### RESPONSIVE DESIGN
- Diseño mobile-first
- Adaptable a tablets y desktop
- Navegación inferior en móvil
- Sidebar en desktop
- Breakpoints de Bootstrap

### RENDIMIENTO
- Server-side rendering (SSR)
- Static generation donde es posible
- Lazy loading de componentes
- Optimización de imágenes con Next/Image
- Caché de datos
- Force-dynamic en rutas que lo requieren

---

## DISEÑO Y UX

### PALETA DE COLORES
- **Primario:** Azul oscuro (#0B1B32)
- **Secundario:** Dorado (#f3b33e)
- **Fondo:** Blanco/Gris claro
- **Texto:** Oscuro sobre claro, claro sobre oscuro
- **Acentos:** Rojo (SOS, cerrar sesión), Verde (éxito)

### TIPOGRAFÍA
- Fuentes del sistema (system-ui)
- Pesos variables (regular, medium, bold, extrabold)
- Tamaños responsivos

### COMPONENTES UI
- Cards con sombras suaves
- Botones con hover effects
- Animaciones de entrada/salida
- Transiciones suaves
- Bordes redondeados
- Glassmorphism en modales
- Gradientes sutiles

### NAVEGACIÓN
- **Móvil:** Barra inferior fija con 6 secciones
- **Desktop:** Sidebar izquierdo
- Indicadores de sección activa
- Badges de notificaciones
- Iconos intuitivos

---

## FLUJO DE USUARIO

### NUEVO USUARIO
1. Registro con email/contraseña
2. Onboarding de 5 pasos
3. Llegada al dashboard
4. Tutorial de Llami (opcional)
5. Exploración de funciones

### USUARIO RECURRENTE
1. Login
2. Dashboard con saludo
3. Check-in diario (opcional)
4. Exploración de contenido
5. Interacción con comunidad
6. Mantenimiento de racha

### MOMENTO DE CRISIS
1. Acceso rápido a SOS
2. Selección de ayuda (promesa/oración/música/llamada)
3. Interacción con contenido
4. Regreso al dashboard

---

## INTEGRACIONES

### EXTERNAS
- PayPal (donaciones)
- Web Push API (notificaciones)
- Web Share API (compartir)
- Tel: protocol (llamadas)

### INTERNAS
- Service Worker (PWA)
- localStorage (preferencias)
- sessionStorage (estado temporal)

---

## FUTURAS MEJORAS PLANIFICADAS
- Aplicación nativa para Google Play Store
- Más categorías de devocionales
- Sistema de mentorías 1-a-1
- Chat en tiempo real
- Grupos de oración
- Eventos y reuniones
- Integración con calendarios
- Modo oscuro completo
- Más idiomas

---

## MÉTRICAS Y ANALYTICS
- Conteo de usuarios registrados
- Devocionales completados
- Rachas activas
- Actividad en foros
- Check-ins diarios
- Uso de SOS

---

## SOPORTE Y CONTACTO
- Foro "Sugerencias y Soporte"
- Email del desarrollador
- Donaciones vía PayPal

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0 (Pre-lanzamiento Google Play)
