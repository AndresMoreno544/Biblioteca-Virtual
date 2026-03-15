# 🔐 Sistema de Autenticación y Administración - Guía Rápida

## ¿Qué se implementó?

### ✅ Autenticación de Usuarios
- Registro público de nuevos usuarios
- Login seguro con sesiones
- Logout con cierre de sesión
- Protección de contraseñas con bcryptjs

### ✅ Sistema de Roles
- **Usuarios (user)**: Solo pueden ver libros disponibles
- **Administradores (admin)**: Pueden crear, editar y eliminar libros

### ✅ Panel de Administración
- Interfaz para gestionar libros
- Agregar nuevos libros
- Editar información de libros
- Eliminar libros
- Ver cantidad de disponibles y prestados

---

## 🚀 Instrucciones para Ejecutar

### 1️⃣ Backend

```bash
# Ve a la carpeta backend
cd biblioteca-back

# Instala las dependencias (incluye bcryptjs y express-session)
npm install

# Ejecuta el seed para crear usuario admin y libros
node seed.js

# Inicia el servidor
npm run dev
```

**Usuario Admin por defecto:**
- Email: `admin@biblioteca.com`
- Contraseña: `admin123`

### 2️⃣ Frontend

```bash
# Ve a la carpeta frontend
cd biblioteca-front

# Instala las dependencias
npm install

# Inicia el servidor
npm run dev
```

Abre: `http://localhost:5173`

---

## 📋 Flujos de Usuario

### Flujo 1: Usuario Regular

1. **Ir a Iniciar Sesión** → Click en "🔓 Iniciar Sesión"
2. **Registrarse** → Click en "Regístrate aquí"
3. **Crear cuenta** → Completa nombre, email y contraseña (mín. 6 caracteres)
4. **Ver libros** → Automáticamente se redirige a "Libros Disponibles"
5. **Ver información** → Puede ver cuáles libros están disponibles o prestados
6. **Cerrar sesión** → Click en el nombre en el header → "Cerrar Sesión"

### Flujo 2: Administrador

1. **Login como Admin** → 
   - Email: `admin@biblioteca.com`
   - Contraseña: `admin123`

2. **Ver Panel de Administración** → En el header aparece "⚙️ Admin"

3. **Agregar Libro** →
   - Click en "➕ Nuevo Libro"
   - Completa: Título, Autor, Portada (emoji), Sinopsis, Cantidades
   - Click en "Crear"

4. **Editar Libro** →
   - En la tabla, click en "✏️"
   - Modifica los datos
   - Click en "Actualizar"

5. **Eliminar Libro** →
   - En la tabla, click en "🗑️"
   - Confirma la eliminación

---

## 🗄️ Base de Datos

### Modelo de Usuario
```javascript
{
  _id: ObjectId,
  nombre: String,
  email: String (único),
  contrasena: String (hasheada),
  rol: String ("user" o "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Modelo de Libro
```javascript
{
  _id: ObjectId,
  titulo: String,
  autor: String,
  portada: String (emoji),
  sinopsis: String,
  disponibles: Number,
  pretados: Number,
  total: Number (calculado automáticamente),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Seguridad

✅ **Contraseñas:**
- Se hashean con bcryptjs
- Nunca se devuelven en JSON
- Mínimo 6 caracteres

✅ **Sesiones:**
- Se almacenan en MongoDB
- Expiran en 24 horas
- Solo HTTP (no accesibles desde JavaScript por defecto)

✅ **Rutas Protegidas:**
- GET /api/books - Público (cualquiera)
- POST/PUT/DELETE /api/books - Solo Admin
- GET /api/auth/me - Solo autenticados

---

## 🧪 Probar la API

### Crear usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "email": "juan@test.com",
    "contrasena": "123456",
    "confirmarContrasena": "123456"
  }'
```

### Login de admin
```bash
curl -b cookies.txt -c cookies.txt \
  -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@biblioteca.com",
    "contrasena": "admin123"
  }'
```

### Crear libro (como admin)
```bash
curl -b cookies.txt -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi Libro",
    "autor": "Mi Nombre",
    "portada": "📖",
    "sinopsis": "Un libro increíble",
    "disponibles": 5,
    "pretados": 0
  }'
```

### Obtener libros (público)
```bash
curl http://localhost:5000/api/books
```

---

## 📝 Notas Importantes

1. **Primera vez:** Ejecuta `node seed.js` para crear el admin y los libros de ejemplo
2. **Contraseña:** Mínimo 6 caracteres
3. **Email único:** Cada email solo se puede registrar una vez
4. **Credenciales demo:** Email `admin@biblioteca.com`, contraseña `admin123`
5. **Tema oscuro:** Funciona en todas las páginas, incluye login y admin

---

## 🐛 Problemas Comunes

**Q: El login no funciona**
A: Asegúrate que:
- El servidor backend está corriendo (`npm run dev`)
- MongoDB está corriendo (`mongod`)
- Ejecutaste `node seed.js`

**Q: No veo el botón "Admin"**
A: Solo aparece si iniciaste sesión como administrador. 
Prueba con admin@biblioteca.com / admin123

**Q: ¿Cómo cambio la contraseña?**
A: Actualmente no hay función de cambio, pero puedes:
1. Eliminar el usuario de MongoDB
2. Crear una nueva cuenta

---

## 🚀 Próximos Pasos (Opcional)

- [ ] Cambio de contraseña
- [ ] Recuperación por email
- [ ] Protección CSRF
- [ ] Rate limiting
- [ ] 2FA (autenticación de dos factores)
- [ ] Roles adicionales (bibliotecario, moderador)
