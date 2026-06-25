# 🔐 Sistema de Gestión de Roles y Usuarios

Sistema Full Stack completo para la gestión de usuarios, roles y permisos. Incluye autenticación con JWT, recuperación de contraseña por email, control de acceso basado en permisos y modo oscuro.

## ✨ Características

### 🔐 Autenticación y Seguridad
- Login con JWT (JSON Web Tokens)
- Contraseñas encriptadas con bcrypt
- Rate Limiting (protección contra fuerza bruta)
- Headers de seguridad con Helmet
- Bloqueo automático de cuentas desactivadas

### 📧 Recuperación de Contraseña
- Envío de email real con Nodemailer
- Tokens seguros con expiración (1 hora)
- Emails con diseño HTML profesional

### 👥 Gestión de Usuarios
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Activar/Desactivar cuentas con toggle visual
- Búsqueda en tiempo real con debounce
- Paginación de resultados
- Validaciones robustas (frontend y backend)

### 🛡️ Roles y Permisos
- Sistema de permisos granular
- Rutas protegidas según permisos
- Roles totalmente personalizables

### 🎨 Experiencia de Usuario
- Modo oscuro 🌙 (persistente)
- Notificaciones tipo toast
- Estados de carga
- Validación visual de formularios
- Diseño limpio y responsive

## 🛠️ Tecnologías

Frontend: Vue 3, Vite, Pinia, Vue Router, Axios

Backend: Node.js, Express, PostgreSQL, JWT, bcrypt, Nodemailer, express-validator, Helmet, express-rate-limit

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- PostgreSQL (versión 14 o superior)
- Cuenta de Gmail con App Password habilitada

## 🚀 Instalación

### 1. Clonar el repositorio

    git clone https://github.com/Jheremy-Conca/gestion-roles.git
    cd gestion-roles

### 2. Configurar la Base de Datos

    psql -U postgres -c "CREATE DATABASE gestion_roles;"

### 3. Configurar el Backend

    cd backend
    npm install

Crea un archivo .env en la carpeta backend con este contenido:

    PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=gestion_roles
    DB_USER=postgres
    DB_PASSWORD=tu_contraseña
    JWT_SECRET=tu_clave_secreta_super_segura
    FRONTEND_URL=http://localhost:5173
    EMAIL_USER=tucorreo@gmail.com
    EMAIL_PASS=tuapppasswordsinespacios

Inicializa la base de datos:

    node seed.js

Inicia el servidor:

    npm run dev

El backend correrá en http://localhost:3000

### 4. Configurar el Frontend

En una nueva terminal:

    cd frontend
    npm install
    npm run dev

El frontend correrá en http://localhost:5173

## 🔑 Credenciales por Defecto

    Email: admin@admin.com
    Password: admin123

## 📁 Estructura del Proyecto

    gestion-roles/
    │
    ├── backend/
    │   ├── config/
    │   │   ├── database.js
    │   │   └── email.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── userController.js
    │   │   ├── roleController.js
    │   │   └── passwordController.js
    │   ├── middleware/
    │   │   ├── auth.js
    │   │   ├── checkRole.js
    │   │   └── errorHandler.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── userRoutes.js
    │   │   ├── roleRoutes.js
    │   │   └── passwordRoutes.js
    │   ├── validators/
    │   │   └── validators.js
    │   ├── .env
    │   ├── seed.js
    │   └── server.js
    │
    └── frontend/
        ├── src/
        │   ├── components/
        │   │   ├── Navbar.vue
        │   │   ├── UserModal.vue
        │   │   ├── RoleModal.vue
        │   │   └── Pagination.vue
        │   ├── views/
        │   │   ├── Login.vue
        │   │   ├── Dashboard.vue
        │   │   ├── Users.vue
        │   │   ├── Roles.vue
        │   │   ├── ForgotPassword.vue
        │   │   └── ResetPassword.vue
        │   ├── composables/
        │   │   ├── useToast.js
        │   │   └── useTheme.js
        │   ├── router/index.js
        │   ├── store/auth.js
        │   ├── services/api.js
        │   ├── App.vue
        │   └── main.js
        ├── index.html
        └── vite.config.js

## 🔌 Endpoints de la API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrar usuario |

### Usuarios
| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| GET | /api/users | leer | Listar con paginación y búsqueda |
| POST | /api/users | crear | Crear usuario |
| PUT | /api/users/:id | actualizar | Editar usuario |
| DELETE | /api/users/:id | eliminar | Eliminar usuario |

### Roles
| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| GET | /api/roles | - | Listar roles |
| POST | /api/roles | gestionar_roles | Crear rol |
| PUT | /api/roles/:id | gestionar_roles | Editar rol |
| DELETE | /api/roles/:id | gestionar_roles | Eliminar rol |

### Recuperación de Contraseña
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/password/forgot | Solicitar recuperación |
| POST | /api/password/reset | Restablecer contraseña |

## 🎭 Roles Predefinidos

| Rol | Permisos |
|-----|----------|
| admin | crear, leer, actualizar, eliminar, gestionar_roles |
| editor | crear, leer, actualizar |
| usuario | leer |

## 🔒 Seguridad Implementada

- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT con expiración de 8 horas
- Rate limiting en login (5 intentos cada 15 minutos)
- Validación de datos en backend y frontend
- Bloqueo de cuentas desactivadas
- Tokens de recuperación con expiración de 1 hora
- Headers de seguridad con Helmet
- CORS configurado

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Autor

Jheremy Conca

- GitHub: https://github.com/Jheremy-Conca
- LinkedIn: https://www.linkedin.com/in/jheremy-william-conca-51aab7344/
- Email: concajheremy@gmail.com

## ⭐ ¿Te gustó el proyecto?

Si este proyecto te fue útil, ¡considera darle una estrella en GitHub!

Hecho con ❤️ usando Vue.js, Node.js y PostgreSQL