# Instrucciones de Despliegue en Vercel

Este documento proporciona instrucciones detalladas para desplegar la aplicación completa del Zoológico "Mirada Salvaje" en Vercel.

## Requisitos Previos

1. **Cuenta en Vercel** - Regístrate en [vercel.com](https://vercel.com)
2. **Cuenta en Supabase** - Crea una cuenta en [supabase.com](https://supabase.com)
3. **Git** - Instalado en tu máquina
4. **CLI de Vercel** (opcional pero recomendado):
   ```bash
   npm install -g vercel
   ```

## Paso 1: Configuración de Supabase

### 1.1 Crear Proyecto Supabase
1. Accede a [Supabase Dashboard](https://app.supabase.com/)
2. Crea un nuevo proyecto
3. Anota la URL de tu proyecto y la clave anonimamente accesible (anon key)

### 1.2 Configurar la Base de Datos
Usa el esquema proporcionado en la documentación para crear las tablas necesarias.

### 1.3 Configurar Autenticación
1. Ve a la sección "Authentication" en Supabase
2. Activa el inicio de sesión por correo electrónico
3. Configura los dominios permitidos si es necesario

## Paso 2: Configurar Variables de Entorno

### 2.1 Archivo .env.local (Local)
Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales:

```bash
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-anonimamente-accessible

# Puerto del servidor (solo para desarrollo local)
PORT=5000

# URL de la API (para el frontend)
API_URL=https://tu-app.vercel.app
```

### 2.2 Variables en Vercel
Para el despliegue en Vercel, configura estas variables en la sección "Settings" → "Environment Variables":

| Variable | Valor |
|----------|-------|
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_KEY` | Clave anonimamente accesible de Supabase |

## Paso 3: Despliegue del Frontend (React)

### 3.1 Método 1: Desde la Interfaz Web de Vercel
1. Inicia sesión en [Vercel](https://vercel.com)
2. Haz clic en "New Project"
3. Selecciona tu repositorio de GitHub/GitLab
4. Configura las siguientes opciones:
   - **Framework Preset**: `Next.js` (puede seleccionarse aunque no uses Next.js)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`

### 3.2 Método 2: Desde la CLI de Vercel
```bash
# Navega al directorio del frontend
cd client

# Despliega usando la CLI de Vercel
vercel

# Sigue las instrucciones en pantalla
```

### 3.3 Configuración Específica para el Frontend
- Directorio de despliegue: `client`
- Framework preset: `Next.js` (para compatibilidad)
- Variables de entorno: Configura las mismas variables que en el paso 2.2

## Paso 4: Despliegue del Backend (API)

### 4.1 Estructura de Rutas API
El backend está estructurado para funcionar como funciones serverless en Vercel:

```
/server
  /api
    /cleaning
      tasks.js
      logs.js
    /feeding
      foods.js
      stock.js
    /tickets
      buy.js
```

### 4.2 Configuración de Vercel para el Backend
1. En tu proyecto Vercel, ve a "Settings" → "Functions"
2. Configura las funciones serverless:
   - Ruta `/api/cleaning/tasks` → `server/api/cleaning/tasks.js`
   - Ruta `/api/cleaning/logs` → `server/api/cleaning/logs.js`
   - Ruta `/api/feeding/foods` → `server/api/feeding/foods.js`
   - Ruta `/api/feeding/stock` → `server/api/feeding/stock.js`
   - Ruta `/api/tickets/buy` → `server/api/tickets/buy.js`

### 4.3 Configuración de Variables de Entorno del Backend
Las variables de entorno del backend se configuran en Vercel:
- `SUPABASE_URL` - URL de tu proyecto Supabase
- `SUPABASE_KEY` - Clave de acceso a Supabase

## Paso 5: Configuración de CORS y Proxy

### 5.1 Configuración CORS en Supabase
1. Ve a tu proyecto Supabase
2. En "Settings" → "Authentication" → "Allowed OAuth Origins"
3. Añade las URLs permitidas:
   - `https://tu-app.vercel.app`
   - `http://localhost:3000` (para desarrollo local)

### 5.2 Configuración de Proxy en el Frontend
En el archivo `client/src/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

// Usa la URL de tu API en Vercel
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY || 'tu-clave-anonimamente-accessible'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Paso 6: Configuración de Dominio Personalizado (Opcional)

### 6.1 Configurar Dominio en Vercel
1. Ve a "Settings" → "Domains"
2. Añade tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

### 6.2 Configurar SSL en Supabase
Asegúrate de que tu dominio tenga certificado SSL válido para conexiones seguras.

## Paso 7: Pruebas Finales

### 7.1 Prueba de Funcionalidad
1. Accede a la URL pública de tu aplicación en Vercel
2. Verifica que:
   - El login funciona correctamente
   - Puedes acceder a todas las funcionalidades según tu rol
   - Los reportes PDF se generan correctamente
   - Las operaciones CRUD funcionan correctamente

### 7.2 Prueba de APIs
1. Prueba las rutas de API:
   - `GET /api/cleaning/tasks`
   - `POST /api/feeding/foods`
   - `POST /api/tickets/buy`

## Solución de Problemas Comunes

### Problema 1: Errores de CORS
**Solución:** Verifica que las URLs permitidas en Supabase incluyan tu dominio de Vercel.

### Problema 2: Variables de Entorno no cargadas
**Solución:** Asegúrate de que las variables estén configuradas correctamente en Vercel y que el frontend las esté leyendo desde `process.env`.

### Problema 3: Problemas con autenticación
**Solución:** Verifica que el token de Supabase esté correctamente configurado y que las rutas de autenticación estén habilitadas.

## Consideraciones Finales

1. **Costos**: Vercel ofrece planes gratuitos, pero para producción puede requerir un plan pago.
2. **Seguridad**: Mantén tus claves secretas fuera de los repositorios públicos.
3. **Mantenimiento**: Configura notificaciones de despliegue para monitorear actualizaciones.
4. **Backup**: Realiza copias de seguridad periódicas de tu base de datos Supabase.

## URL Final de Acceso

Una vez completado el despliegue, la aplicación será accesible en:
- **Frontend**: https://tu-app.vercel.app
- **API**: https://tu-app.vercel.app/api/...

La aplicación estará completamente funcional desde cualquier dispositivo con conexión a internet.