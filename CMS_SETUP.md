# Configuración del CMS Paideia

## 1. Crear y preparar Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/migrations/202610210001_cms.sql` desde el SQL Editor o mediante Supabase CLI.
3. En Authentication, crea manualmente la primera cuenta administrativa. El panel no ofrece registro público.
4. Copia el UUID del usuario creado.

## 2. Variables de entorno

Copia `.env.example` como `.env.local` y completa:

- `VITE_SUPABASE_URL`: URL del proyecto.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: clave pública; puede exponerse en el frontend porque todas las operaciones están protegidas con RLS.
- `SUPABASE_SERVICE_ROLE_KEY`: solo se usa en el script local de migración. Nunca debe tener prefijo `VITE_` ni publicarse.
- `CMS_ADMIN_USER_ID`: UUID del usuario administrador.

## 3. Migrar el contenido actual

```powershell
npm run cms:migrate
```

El script sube los 19 recursos actuales con rutas inmutables, crea sus metadatos y publica las diez secciones administrables y ocho noticias iniciales. Es idempotente: se puede volver a ejecutar sin duplicar archivos.

## 4. Usar el panel

Inicia la aplicación y abre `#admin`. Guardar conserva un borrador privado; Publicar reemplaza la versión visible. Las imágenes usadas no pueden eliminarse desde la biblioteca.

## Despliegue

Configura solamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en el proveedor del frontend. Conserva la clave de servicio exclusivamente en un entorno administrativo seguro.
