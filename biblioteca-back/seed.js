import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
import User from './models/User.js';

dotenv.config();

// Datos iniciales de libros
const initialBooks = [
  {
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    portada: "📚",
    sinopsis: "La saga de la familia Buendía en el pueblo de Macondo, una obra maestra del realismo mágico.",
    disponibles: 3,
    pretados: 0
  },
  {
    titulo: "Don Quixote",
    autor: "Miguel de Cervantes",
    portada: "⚔️",
    sinopsis: "Las aventuras del ingenioso hidalgo Don Quixote de la Mancha y su escudero Sancho Panza.",
    disponibles: 2,
    pretados: 1
  },
  {
    titulo: "La casa de los espíritus",
    autor: "Isabel Allende",
    portada: "🏚️",
    sinopsis: "La historia de una familia que vive con poderes sobrenaturales a través de varias generaciones.",
    disponibles: 4,
    pretados: 0
  },
  {
    titulo: "El viejo y el mar",
    autor: "Ernest Hemingway",
    portada: "⛵",
    sinopsis: "La lucha de un pescador anciano contra un enorme pez espada en el Océano Atlántico.",
    disponibles: 2,
    pretados: 0
  },
  {
    titulo: "Orgullo y prejuicio",
    autor: "Jane Austen",
    portada: "💕",
    sinopsis: "Una historia de amor y matrimonio en la Inglaterra rural del siglo XIX.",
    disponibles: 5,
    pretados: 0
  },
  {
    titulo: "El conde de Montecristo",
    autor: "Alexandre Dumas",
    portada: "💎",
    sinopsis: "Un hombre falsamente encarcelado se escapa, encuentra un tesoro y se venga de sus enemigos.",
    disponibles: 1,
    pretados: 1
  },
  {
    titulo: "Mujercitas",
    autor: "Louisa May Alcott",
    portada: "👧",
    sinopsis: "Las aventuras de cuatro hermanas durante la Guerra Civil Americana.",
    disponibles: 3,
    pretados: 0
  },
  {
    titulo: "Crimen y castigo",
    autor: "Fiódor Dostoyevski",
    portada: "🎭",
    sinopsis: "Un estudiante pobre comete un crimen y enfrenta las consecuencias psicológicas y morales.",
    disponibles: 2,
    pretados: 1
  }
];

// Usuario administrador por defecto
const adminUser = {
  nombre: "Administrador",
  email: "morenoorejuela25@gmail.com",
  contrasena: "lolpo209joE",
  rol: "admin"
};

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca');
    console.log('✓ Conectado a MongoDB');

    // Limpiar colecciones
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('✓ Colecciones limpiadas');

    // Crear usuario administrador
    const adminExistente = await User.findOne({ email: adminUser.email });
    if (!adminExistente) {
      await User.create(adminUser);
      console.log(`✓ Usuario administrador creado:`);
      console.log(`  📧 Email: ${adminUser.email}`);
      console.log(`  🔑 Contraseña: ${adminUser.contrasena}`);
    } else {
      console.log('✓ Usuario administrador ya existe');
    }

    // Insertar libros
    const insertedBooks = await Book.insertMany(initialBooks);
    console.log(`✓ ${insertedBooks.length} libros insertados correctamente`);

    console.log('\n📚 Base de datos poblada exitosamente\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error al poblar la base de datos:', error.message);
    process.exit(1);
  }
}

seedDatabase();
