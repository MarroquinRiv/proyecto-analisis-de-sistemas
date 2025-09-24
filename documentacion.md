# Sistema de Gestión del Zoológico "Mirada Salvaje"

## Descripción General

Esta aplicación es un sistema de gestión integral para el zoológico "Mirada Salvaje", desarrollado con tecnologías modernas de frontend y backend. Permite gestionar diferentes aspectos del funcionamiento del zoológico, incluyendo mantenimiento, alimentación, control clínico y ventas de entradas.

## Estructura del Proyecto

```
/project-root
  /client               # Frontend React
    /src
      /components       # Componentes reutilizables
      /pages            # Páginas principales
      /services         # Llamadas a la API
      /utils            # Funciones auxiliares
      App.js, main.jsx
  /server               # Backend Node.js/Express
    /api                # Funciones serverless para Vercel
      /cleaning         # Rutas de limpieza
      /feeding          # Rutas de alimentación
      /clinical         # Rutas de control clínico
      /tickets          # Rutas de entradas
    /middleware         # Middleware de autenticación
    /db                 # Conexión a la base de datos
    server.js           # Punto de entrada del servidor
  .env.example
  documentacion.md
```

## Tecnologías Utilizadas

### Frontend (Client)
- **React** (hooks, sin Next.js)
- **Tailwind CSS** para estilos
- **Supabase Auth** para autenticación
- **jsPDF** y **html2canvas** para generación de reportes PDF

### Backend (Server)
- **Node.js** + **Express** (estructura compatible con Vercel)
- **Supabase** como base de datos PostgreSQL
- **Supabase Auth** para autenticación

## Configuración del Entorno

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-anonimamente-accessible

# Puerto del servidor (solo para desarrollo local)
PORT=5000

# URL de la API (para el frontend)
API_URL=http://localhost:5000
```

### Archivo .env.example

Se proporciona un archivo `.env.example` con las variables necesarias.

## Base de Datos

La aplicación utiliza una base de datos PostgreSQL en Supabase con el siguiente esquema:

```sql
-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id BIGSERIAL PRIMARY KEY,
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  name text,
  email text,
  role text NOT NULL DEFAULT 'visitor'  -- visitor, staff, admin
);

-- Áreas del zoológico
CREATE TABLE zoo.areas (
  id BIGSERIAL PRIMARY KEY,
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  type text NOT NULL  -- enclosure, restroom, garden, playground, office
);

-- Especies y animales
CREATE TABLE zoo.species (id BIGSERIAL PRIMARY KEY, common_name text);
CREATE TABLE zoo.animals (
  id BIGSERIAL PRIMARY KEY,
  tag_code text UNIQUE,
  name text,
  species_id bigint REFERENCES zoo.species(id),
  area_id bigint REFERENCES zoo.areas(id),
  status text DEFAULT 'healthy'
);

-- Gestión de limpieza
CREATE TABLE zoo.cleaning_tasks (id BIGSERIAL PRIMARY KEY, area_id bigint, description text, frequency text);
CREATE TABLE zoo.cleaning_logs (id BIGSERIAL PRIMARY KEY, task_id bigint, performed_by bigint, performed_at timestamptz, notes text);

-- Alimentación
CREATE TABLE zoo.food_items (id BIGSERIAL PRIMARY KEY, name text, unit text);
CREATE TABLE zoo.food_stock (id BIGSERIAL PRIMARY KEY, food_item_id bigint, quantity numeric);
CREATE TABLE zoo.feeding_schedules (id BIGSERIAL PRIMARY KEY, animal_id bigint, feeding_time time);
CREATE TABLE zoo.feeding_logs (id BIGSERIAL PRIMARY KEY, feeding_schedule_id bigint, fed_by bigint, fed_at timestamptz);

-- Control clínico
CREATE TABLE zoo.medications (id BIGSERIAL PRIMARY KEY, name text);
CREATE TABLE zoo.vaccines (id BIGSERIAL PRIMARY KEY, name text);
CREATE TABLE zoo.clinical_visits (id BIGSERIAL PRIMARY KEY, animal_id bigint, vet_id bigint, visit_date timestamptz);
CREATE TABLE zoo.clinical_medications (id BIGSERIAL PRIMARY KEY, clinical_visit_id bigint, medication_id bigint);
CREATE TABLE zoo.clinical_vaccinations (id BIGSERIAL PRIMARY KEY, clinical_visit_id bigint, vaccine_id bigint);

-- Entradas y promociones
CREATE TABLE zoo.ticket_types (id BIGSERIAL PRIMARY KEY, name text, price numeric);
CREATE TABLE zoo.promotions (id BIGSERIAL PRIMARY KEY, code text UNIQUE, discount_percent numeric, active boolean);
CREATE TABLE zoo.tickets (id BIGSERIAL PRIMARY KEY, ticket_type_id bigint, promotion_id bigint, purchaser_profile_id bigint, purchased_at timestamptz, visit_date date, price_paid numeric);
```

## Roles y Permisos

La aplicación maneja tres roles de usuario:

1. **Visitor** (Visitante)
   - Solo puede ver promociones y comprar entradas

2. **Staff** (Personal)
   - Puede gestionar limpieza, alimentación y control clínico

3. **Admin** (Administrador)
   - Tiene acceso total + gestión de usuarios y promociones

## Funcionalidades Principales

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

## Instalación y Ejecución

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

### Paso 1: Configurar el Backend

```bash
cd server
npm install
```

### Paso 2: Configurar el Frontend

```bash
cd client
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase.

### Paso 4: Ejecutar la Aplicación

Para ejecutar el frontend:

```bash
cd client
npm start
```

Para ejecutar el backend:

```bash
cd server
npm start
```

O en modo desarrollo:

```bash
cd server
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Despliegue en Vercel

La aplicación está preparada para desplegarse en Vercel:

1. **Frontend**: El frontend se despliega directamente en Vercel
2. **Backend**: Puede desplegarse como funciones serverless en Vercel

Para desplegar en Vercel, asegúrate de:
- Configurar las variables de entorno en Vercel
- Establecer el directorio de despliegue como `client` para el frontend
- Configurar correctamente las rutas de API en el backend (usando la estructura `/api/...`)

## Consideraciones Técnicas

### Generación de Reportes PDF
- Los reportes se generan en el frontend usando `jsPDF` y `html2canvas`
- Los reportes incluyen:
  1. Inventario de alimentos
  2. Estado de salud de animales
  3. Registro de limpieza del día
  4. Resumen de ventas de entradas

### Seguridad
- Se utiliza Supabase Auth para la autenticación
- Los endpoints del backend están protegidos por middleware de autenticación
- Los roles de usuario se validan en el backend para controlar el acceso a ciertas funcionalidades

### Arquitectura
- Separación clara entre frontend y backend
- Uso de APIs REST para comunicación entre capas
- Diseño modular para facilitar mantenimiento y escalabilidad
- Estructura compatible con Vercel serverless functions

## Problemas Comunes y Soluciones

### Problema: Errores de conexión a Supabase
**Solución:** Verifica que las variables de entorno estén correctamente configuradas y que la URL de Supabase sea válida.

### Problema: Problemas con el despliegue en Vercel
**Solución:** Asegúrate de que las rutas de API estén configuradas correctamente y que las variables de entorno estén definidas en Vercel.

### Problema: Reportes PDF no generan correctamente
**Solución:** Verifica que las dependencias `jsPDF` y `html2canvas` estén instaladas correctamente en el frontend.

## Próximas Mejoras

- Implementación de pasarela de pago real para compras de entradas
- Mejoras en la interfaz de usuario y experiencia de usuario
- Funcionalidades de notificaciones
- Integración con sistemas externos