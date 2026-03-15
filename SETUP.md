# Biblioteca Virtual - Setup Completo

Este documento te guía en la instalación y configuración de todo el proyecto (frontend + backend con base de datos).

## 📋 Requisitos Previos

- Node.js 16+
- MongoDB (instalado y corriendo)
- npm o yarn

## 🚀 Instalación Rápida

### 1. Instalar MongoDB Community

#### Windows:
1. Descargar desde: https://www.mongodb.com/try/download/community
2. Ejecutar el instalador
3. Seleccionar "Install as a Service" (recomendado)
4. MongoDB comenzará a correr automáticamente

Verificar que está corriendo:
```bash
# Abre una terminal y ejecuta
mongod
```

### 2. Backend - Configuración

```bash
# Ve a la carpeta backend
cd biblioteca-back

# Instala las dependencias
npm install

# Verifica que .env está configurado correctamente:
# MONGODB_URI=mongodb://localhost:27017/biblioteca
# PORT=5000

# Pobla la BD con datos iniciales
node seed.js

# Inicia el servidor
npm run dev
# O para producción: npm start
```

El servidor estará disponible en: `http://localhost:5000`

### 3. Frontend - Configuración

```bash
# Ve a la carpeta frontend
cd biblioteca-front

# Instala las dependencias
npm install

# Verifica que .env está configurado correctamente:
# VITE_API_URL=http://localhost:5000/api

# Inicia el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📚 Verificar que Todo Funciona

1. **Verifica MongoDB:**
```bash
mongosh
> show databases
> use biblioteca
> db.books.find()
```

2. **Verifica el Backend:**
```bash
curl http://localhost:5000/api/health
# Respuesta: {"status":"OK","message":"Servidor funcionando correctamente"}
```

3. **Verifica el Frontend:**
- Abre http://localhost:5173 en tu navegador
- Deberías ver la página de inicio
- Navega a "Libros Disponibles" y verás la lista de libros desde la BD

## 🗂️ Estructura del Proyecto

```
Biblioteca/
├── biblioteca-back/          # Backend con Express
│   ├── models/
│   │   └── Book.js          # Modelo de MongoDB
│   ├── routes/
│   │   └── books.js         # Rutas API
│   ├── server.js            # Servidor principal
│   ├── seed.js              # Script para llenar BD
│   ├── package.json
│   ├── .env
│   └── README.md
│
└── biblioteca-front/         # Frontend con React + Vite
    ├── src/
    │   ├── components/
    │   │   └── Header.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Books.jsx
    │   │   └── About.jsx
    │   ├── services/
    │   │   └── bookService.js
    │   ├── context/
    │   │   └── ThemeContext.jsx
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── package.json
    └── vite.config.js
```

## 🔧 API Endpoints

### Obtener todos los libros
```bash
GET http://localhost:5000/api/books

Respuesta:
[
  {
    "_id": "...",
    "titulo": "Cien años de soledad",
    "autor": "Gabriel García Márquez",
    "portada": "📚",
    "sinopsis": "...",
    "disponibles": 3,
    "pretados": 0,
    "total": 3
  }
]
```

### Obtener un libro
```bash
GET http://localhost:5000/api/books/:id
```

### Crear un libro (Admin)
```bash
POST http://localhost:5000/api/books
Content-Type: application/json

{
  "titulo": "Nuevo Libro",
  "autor": "Autor",
  "portada": "📚",
  "sinopsis": "Descripción",
  "disponibles": 5,
  "pretados": 0
}
```

### Actualizar un libro
```bash
PUT http://localhost:5000/api/books/:id
Content-Type: application/json

{
  "disponibles": 4,
  "pretados": 1
}
```

### Eliminar un libro
```bash
DELETE http://localhost:5000/api/books/:id
```

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB está corriendo: `mongod`
- En Windows, verifica en Services que "MongoDB Server" está activado

### Error: "Port 5000 is already in use"
```bash
# Cambia el puerto en .env
PORT=3001
```

### Error: "CORS error"
- Asegúrate que `CORS_ORIGIN` en .env del backend coincide con la URL de tu frontend
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### Los libros no se cargan en el frontend
1. Verifica que el backend está corriendo: `npm run dev`
2. Verifica que MongoDB está corriendo: `mongod`
3. Verifica que ejecutaste `node seed.js`
4. Abre la consola del navegador (F12) y mira los errores

### Repoblar la base de datos
```bash
cd biblioteca-back
node seed.js
```

## 📦 Variables de Entorno

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/biblioteca
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deploy a Producción

### Backend (ejemplo con Heroku)
```bash
# 1. Usa una BD remota MongoDB (ej: MongoDB Atlas)
# 2. Configura variables en Heroku
# 3. Deploy: git push heroku main
```

### Frontend (ejemplo con Vercel)
```bash
# 1. npm run build
# 2. Sube a Vercel o similar
# 3. Configura VITE_API_URL con tu backend en producción
```

## 💡 Próximas Características

- [ ] Autenticación de usuarios
- [ ] Sistema de préstamos
- [ ] Notificaciones de devoluciones
- [ ] Panel de administración
- [ ] Dashboard de estadísticas

## 📞 Soporte

Si tienes problemas, verifica:
1. Los logs en la terminal
2. La consola del navegador (F12)
3. Que MongoDB está corriendo
4. Las URLs en los archivos .env
