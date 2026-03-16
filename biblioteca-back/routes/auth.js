import express from 'express';
import User from '../models/User.js';
import { generarToken, verificarToken } from '../middleware/auth.js';

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

    // Generar token JWT
    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      message: 'Registro exitoso',
      token,
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

    // Generar token JWT
    const token = generarToken(usuario);

    res.json({
      message: 'Login exitoso',
      token,
      usuario: usuario.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener usuario actual (verifica el token)
router.get('/me', verificarToken, async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.userId);
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
