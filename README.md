# Trabajo-Practico_Sebastian-Winter

API REST construida con **Express** y **MongoDB** que implementa autenticación con **JWT** y sigue el patrón de arquitectura **MVC**. Permite gestionar productos asociados a un usuario autenticado.

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

```
├── config/
│   └── mongoDbConnection.js
├── controllers/
│   ├── authControllers.js
│   └── productControllers.js
├── middlewares/
│   ├── authMiddleware.js
│   └── limiterMiddleware.js
├── models/
│   ├── UserModel.js
│   └── ProductModel.js
├── routes/
│   ├── authRouter.js
│   └── productRouter.js
├── .env
├── .env.example
├── app.js
└── README.md
```

## Rate Limiting

El endpoint `POST /api/auth/login` tiene protección contra fuerza bruta: máximo **5 intentos cada 15 minutos** por IP. Si se supera ese límite, la API responde con `429 Too Many Requests`.

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Trabajo-Practico_Sebastian-Winter.git
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

```
PORT=3000
URI_DB=mongodb://localhost:27017/tp-sebastian-winter
JWT_SECRET=tu_clave_secreta
```

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
    "updatedAt": "2025-01-01T00:00:00.000Z"
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

### Productos (privados)

Todos los endpoints de productos requieren el header:

```
Authorization: Bearer <token>
```

---

#### `GET /api/products`

Lista todos los productos del usuario autenticado.

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c0e",
      "name": "Laptop",
      "price": 1200,
      "category": "Electrónica",
      "stock": 5,
      "available": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "message": "Products fetched successfully"
}
```

---

#### `GET /api/products/:id`

Obtiene un producto por ID, solo si pertenece al usuario autenticado.

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Laptop",
    "price": 1200,
    "category": "Electrónica",
    "stock": 5,
    "available": true
  },
  "message": "Product fetched successfully"
}
```

---

#### `POST /api/products`

Crea un nuevo producto asociado al usuario autenticado.

**Body:**
```json
{
  "name": "Laptop",
  "price": 1200,
  "category": "Electrónica",
  "stock": 5
}
```

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Laptop",
    "price": 1200,
    "category": "Electrónica",
    "stock": 5,
    "available": true
  },
  "message": "Product created successfully"
}
```

---

#### `PATCH /api/products/:id`

Actualiza parcialmente un producto, solo si pertenece al usuario autenticado.

**Body (todos los campos son opcionales):**
```json
{
  "price": 999,
  "stock": 0
}
```

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Laptop",
    "price": 999,
    "category": "Electrónica",
    "stock": 0,
    "available": false
  },
  "message": "Product updated successfully"
}
```

---

#### `DELETE /api/products/:id`

Elimina un producto, solo si pertenece al usuario autenticado.

**Respuesta exitosa `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0e",
    "name": "Laptop",
    "price": 1200,
    "category": "Electrónica",
    "stock": 5,
    "available": true
  },
  "message": "Product deleted successfully"
}
```

---

## Colección de Postman

Importá el archivo `postman_collection.json` incluido en el repositorio para tener todos los endpoints preconfigurados.

1. Abrí Postman
2. Hacé click en **Import**
3. Seleccioná el archivo `postman_collection.json`
4. Después de hacer login, copiá el token en la variable de entorno `token` de la colección

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `URI_DB` | URI de conexión a MongoDB | `mongodb://localhost:27017/mi-db` |
| `JWT_SECRET` | Clave secreta para firmar tokens | `mi_clave_secreta` |