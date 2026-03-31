import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import booksRouter from './routes/books.js';
import authRouter from './routes/auth.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca';

// Middleware CORS mejorado
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://biblioteca-virtual-ge18.vercel.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400
}));

// Manejar preflight requests
app.options('*', cors());

app.use(express.json());

// Conectar a MongoDB con opciones de timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10
})
  .then(() => {
    console.log('✓ Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('✗ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  });

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: '📚 Biblioteca Virtual Backend',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/api/health',
      books: '/api/books',
      auth: '/api/auth'
    }
  });
});

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
