import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, contrasena, confirmarContrasena } = req.body;

    // Validaciones
    if (!nombre || !email || !contrasena || !confirmarContrasena) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (contrasena !== confirmarContrasena) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      contrasena,
      rol: 'user'
    });

    await nuevoUsuario.save();

    // Guardar en sesión
    req.session.userId = nuevoUsuario._id;
    req.session.rol = nuevoUsuario.rol;

    res.status(201).json({
      message: 'Registro exitoso',
      usuario: nuevoUsuario.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Validaciones
    if (!email || !contrasena) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    // Buscar usuario
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const esValida = await usuario.compararContrasena(contrasena);
    if (!esValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Guardar en sesión
    req.session.userId = usuario._id;
    req.session.rol = usuario.rol;
    req.session.nombre = usuario.nombre;

    res.json({
      message: 'Login exitoso',
      usuario: usuario.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Sesión cerrada' });
  });
});

// Obtener usuario actual
router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  res.json({
    userId: req.session.userId,
    rol: req.session.rol,
    nombre: req.session.nombre
  });
});

export default router;
