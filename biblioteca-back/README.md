# Biblioteca Virtual - Backend

Backend para la aplicación de Biblioteca Virtual usando Node.js, Express y MongoDB con autenticación y sistema de roles.

## Requisitos

- Node.js 16+
- MongoDB instalado y corriendo en `localhost:27017`

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Asegurar que MongoDB está corriendo:**
```bash
# En Windows (si usas MongoDB Community)
mongod
```

3. **Poblar la base de datos con datos iniciales:**
```bash
node seed.js
```

Se creará un usuario administrador por defecto:
- **Email:** admin@biblioteca.com
- **Contraseña:** admin123

## Desarrollo

**Iniciar servidor en modo desarrollo (con auto-reload):**
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:5000`

## Producción

**Iniciar servidor:**
```bash
npm start
```

## Características de Seguridad

- ✅ Autenticación por sesiones con Express-session
- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Sistema de roles (admin/user)
- ✅ Protección de rutas por rol
- ✅ Almacenamiento de sesiones en MongoDB

## Endpoints API

### 🔐 Autenticación

#### Registro
```
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Tu Nombre",
  "email": "tu@email.com",
  "contrasena": "minimo6caracteres",
  "confirmarContrasena": "minimo6caracteres"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "tu@email.com",
  "contrasena": "tucontraseña"
}
```

#### Logout
```
POST /api/auth/logout
```

#### Obtener usuario actual
```
GET /api/auth/me
```

---

### 📚 Libros (Lectura - Público)
    "total": 3,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### Obtener un libro por ID
```
GET /api/books/:id
```

### Crear un nuevo libro
```
POST /api/books
Content-Type: application/json

{
  "titulo": "Título del libro",
  "autor": "Nombre del autor",
  "portada": "📚",
  "sinopsis": "Descripción breve",
  "disponibles": 5,
  "pretados": 0
}
```

### Actualizar un libro
```
PUT /api/books/:id
Content-Type: application/json

{
  "disponibles": 4,
  "pretados": 1
}
```

### Eliminar un libro
```
DELETE /api/books/:id
```

## Verificar que todo funciona

```bash
curl http://localhost:5000/api/health
```

Respuesta:
```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente"
}
```

## Estructura del Proyecto

```
biblioteca-back/
├── models/
│   └── Book.js          # Modelo de MongoDB para libros
├── routes/
│   └── books.js         # Rutas de la API
├── server.js            # Servidor principal
├── seed.js              # Script para popular datos iniciales
├── package.json
├── .env                 # Variables de entorno
└── README.md
```

## Variables de Entorno

Las siguientes variables se pueden configurar en `.env`:

- `MONGODB_URI` - URL de conexión a MongoDB (default: `mongodb://localhost:27017/biblioteca`)
- `PORT` - Puerto del servidor (default: 5000)
- `NODE_ENV` - Ambiente (development o production)
- `CORS_ORIGIN` - Origen permitido para CORS (default: `http://localhost:5173`)

## Troubleshooting

### Error: "Cannot find module 'express'"
```bash
npm install
```

### Error: "MongoDB connection failed"
- Verifica que MongoDB está corriendo: `mongod`
- Verifica la URL en `.env`

### Error: "Port 5000 is already in use"
- Cambia el puerto en `.env` o usa: `PORT=3001 npm start`
