import express from 'express';
import Book from '../models/Book.js';
import { esAdmin } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los libros (público)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un libro por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo libro (solo admin)
router.post('/', esAdmin, async (req, res) => {
  const { titulo, autor, portada, sinopsis, disponibles, pretados } = req.body;

  // Validar datos
  if (!titulo || !autor || !portada || !sinopsis) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  const book = new Book({
    titulo,
    autor,
    portada,
    sinopsis,
    disponibles: disponibles || 0,
    pretados: pretados || 0
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un libro (solo admin)
router.put('/:id', esAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Actualizar solo los campos que se envían
    if (req.body.titulo !== undefined) book.titulo = req.body.titulo;
    if (req.body.autor !== undefined) book.autor = req.body.autor;
    if (req.body.portada !== undefined) book.portada = req.body.portada;
    if (req.body.sinopsis !== undefined) book.sinopsis = req.body.sinopsis;
    if (req.body.disponibles !== undefined) book.disponibles = req.body.disponibles;
    if (req.body.pretados !== undefined) book.pretados = req.body.pretados;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un libro (solo admin)
router.delete('/:id', esAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
