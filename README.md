# Trabajo-Practico_Sebastian-Winter

API REST construida con **Express** y **MongoDB** que implementa autenticación con **JWT** y sigue el patrón de arquitectura **MVC**. Permite gestionar tareas asociadas a un usuario autenticado.

---

## Tecnologías utilizadas

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcryptjs
- dotenv
- cors
- express-rate-limit

---

## Estructura del proyecto

├── config/
│   └── mongoDbConnection.js
├── controllers/
│   ├── authControllers.js
│   └── taskControllers.js
├── middlewares/
│   ├── authMiddleware.js
│   └── limiterMiddleware.js
├── models/
│   ├── UserModel.js
│   └── TaskModel.js
├── routes/
│   ├── authRouter.js
│   └── taskRouter.js
├── .env
├── .env.example
├── app.js
└── README.md

## Deploy

API disponible en: https://trabajo-practico-sebastian-winter.onrender.com

---

## Rate Limiting

El endpoint `POST /api/auth/login` tiene protección contra fuerza bruta: máximo **5 intentos cada 15 minutos** por IP. Si se supera ese límite, la API responde con `429 Too Many Requests`.

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Sebastian-Winter12/Trabajo-Practico_Sebastian-Winter.git
cd Trabajo-Practico_Sebastian-Winter
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

Editá el `.env` con tus datos:
PORT=3000
URI_DB=mongodb://localhost:27017/tp-sebastian-winter
JWT_SECRET=tu_clave_secreta

### 4. Iniciar el servidor

```bash
node app.js
```

El servidor queda disponible en `http://localhost:3000`.

---

## Endpoints

### Autenticación (públicos)

#### `POST /api/auth/register`

Registra un nuevo usuario.

**Body:**
```json
{
  "username": "sebawinter",
  "email": "seba@example.com",
  "password": "Passw0rd!"
}
```

**Respuesta exitosa `201`:**
```json
{
  "success": true,
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "username": "sebawinter",
    "email": "seba@example.com",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

> La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial.

---

#### `POST /api/auth/login`

Inicia sesión y devuelve un token JWT.

> Este endpoint tiene rate limiting: máximo 5 intentos cada 15 minutos por IP.

**Body:**
```json
{
  "email": "seba@example.com",
  "password": "Passw0rd!"
}
```

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

### Tareas (privados)

Todos los endpoints de tareas requieren el header:
Authorization: Bearer <token>

---

#### `GET /api/tasks`

Lista todas las tareas del usuario autenticado.

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c0e",
      "subject": "Matemáticas",
      "description": "Resolver ejercicios del capítulo 3",
      "priority": "high",
      "dueDate": "2025-06-15T00:00:00.000Z",
      "completed": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "message": "Tasks fetched successfully"
}
```

---

#### `GET /api/tasks/:id`

Obtiene una tarea por ID, solo si pertenece al usuario autenticado.

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "subject": "Matemáticas",
    "description": "Resolver ejercicios del capítulo 3",
    "priority": "high",
    "dueDate": "2025-06-15T00:00:00.000Z",
    "completed": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "Task fetched successfully"
}
```

---

#### `POST /api/tasks`

Crea una nueva tarea asociada al usuario autenticado.

**Body:**
```json
{
  "subject": "Matemáticas",
  "description": "Resolver ejercicios del capítulo 3",
  "priority": "high",
  "dueDate": "2025-06-15"
}
```

**Respuesta exitosa `201`:**
```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "subject": "Matemáticas",
    "description": "Resolver ejercicios del capítulo 3",
    "priority": "high",
    "dueDate": "2025-06-15T00:00:00.000Z",
    "completed": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

---

#### `PATCH /api/tasks/:id`

Actualiza parcialmente una tarea, solo si pertenece al usuario autenticado.

**Body (todos los campos son opcionales):**
```json
{
  "completed": true,
  "priority": "low"
}
```

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "subject": "Matemáticas",
    "description": "Resolver ejercicios del capítulo 3",
    "priority": "low",
    "dueDate": "2025-06-15T00:00:00.000Z",
    "completed": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "Task updated successfully"
}
```

---

#### `DELETE /api/tasks/:id`

Elimina una tarea, solo si pertenece al usuario autenticado.

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "subject": "Matemáticas",
    "description": "Resolver ejercicios del capítulo 3",
    "priority": "high",
    "dueDate": "2025-06-15T00:00:00.000Z",
    "completed": false
  },
  "message": "Task deleted successfully"
}
```

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `URI_DB` | URI de conexión a MongoDB | `mongodb://localhost:27017/mi-db` |
| `JWT_SECRET` | Clave secreta para firmar tokens | `mi_clave_secreta` |