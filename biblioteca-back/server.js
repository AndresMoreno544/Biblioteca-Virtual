import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import booksRouter from './routes/books.js';
import authRouter from './routes/auth.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca';

// Middleware CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('✗ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  });

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto_seguro_aqui',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n📚 Servidor de biblioteca corriendo en http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/books`);
  console.log(`   Auth: http://localhost:${PORT}/api/auth\n`);
});
