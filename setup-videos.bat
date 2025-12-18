@echo off
echo ========================================
echo  Configuracion de Videos - Conecta+
echo ========================================
echo.

echo [1/2] Regenerando cliente de Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: No se pudo regenerar el cliente de Prisma
    echo Asegurate de haber detenido el servidor de desarrollo
    pause
    exit /b 1
)
echo ✓ Cliente de Prisma regenerado exitosamente
echo.

echo [2/2] Poblando base de datos con videos...
call npx ts-node prisma/seed-videos.ts
if %errorlevel% neq 0 (
    echo ERROR: No se pudo ejecutar el seed de videos
    pause
    exit /b 1
)
echo ✓ Videos agregados a la base de datos
echo.

echo ========================================
echo  Configuracion completada!
echo ========================================
echo.
echo Ahora puedes iniciar el servidor con: npm run dev
echo.
pause
