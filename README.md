# Zoológico Mirada Salvaje - Sistema de Gestión

Sistema de gestión integral para el zoológico "Mirada Salvaje" desarrollado con React (frontend) y Node.js/Express (backend).

## Estructura del Proyecto

```
/project-root
  /client               # Frontend React
    /src
      /components       # Componentes reutilizables
      /pages            # Páginas principales
      /utils            # Funciones auxiliares
  /server               # Backend Node.js/Express
    /api                # Funciones serverless para Vercel
    /routes             # Rutas de la API
    /middleware         # Middleware de autenticación
    /db                 # Conexión a la base de datos
  .env.example
  README.md
  DEPLOY_INSTRUCTIONS.md
  documentacion.md
```

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)
- Cuenta en Supabase
- Cuenta en Vercel (para despliegue)

## Instalación Local

### Paso 1: Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd proyecto-analisis-de-sistemas
```

### Paso 2: Configurar el Backend
```bash
cd server
npm install
```

### Paso 3: Configurar el Frontend
```bash
cd client
npm install
```

### Paso 4: Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase:

```bash
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-anonimamente-accessible

# Puerto del servidor (solo para desarrollo local)
PORT=5000

# URL de la API (para el frontend)
API_URL=http://localhost:5000
```

## Ejecución Local

### Para ejecutar el backend:
```bash
cd server
npm run dev
```

### Para ejecutar el frontend:
```bash
cd client
npm start
```

## Despliegue en Vercel

Consulta el archivo `DEPLOY_INSTRUCTIONS.md` para instrucciones completas de despliegue.

## Funcionalidades Implementadas

### 1. Gestión de Limpieza
- CRUD de tareas por área
- Registro de ejecución (quién, cuándo, notas)
- Generación de reporte PDF diario

### 2. Gestión de Alimentación
- Gestión de inventario (alimentos y stock)
- Asignación de horarios de alimentación
- Registro de comidas dadas

### 3. Control Clínico
- Registro de visitas veterinarias
- Asignación de medicamentos y vacunas

### 4. Gestión de Entradas y Promociones
- Listado de tipos de entrada y promociones activas
- Simulación de compra de entradas (sin pasarela real)

### 5. Reportes
- Inventario de alimentos (PDF)
- Estado de salud de animales (PDF)
- Registro de limpieza del día (PDF)
- Resumen de ventas de entradas (PDF)

## Tecnologías Utilizadas

### Frontend (Client)
- React (hooks, sin Next.js)
- Tailwind CSS para estilos
- Supabase Auth para autenticación
- jsPDF y html2canvas para generación de reportes PDF

### Backend (Server)
- Node.js + Express
- Supabase como base de datos PostgreSQL
- Supabase Auth para autenticación

## Autores

- [Tu nombre]

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.