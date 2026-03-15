import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getBooks } from '../services/bookService';
import '../styles/Books.css';

function Books() {
  const { isDark } = useTheme();
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setLibros(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar libros:', err);
        setError('No se pudieron cargar los libros. Asegúrate de que el servidor está corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className={`books-container ${isDark ? 'dark' : 'light'}`}>
      <h1>📖 Biblioteca Virtual</h1>
      
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando libros...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <div>
            <p className="error-title">Error al cargar los libros</p>
            <p className="error-text">{error}</p>
            <p className="error-hint">Asegúrate de que:</p>
            <ul>
              <li>MongoDB está corriendo</li>
              <li>El servidor backend está iniciado en puerto 5000</li>
              <li>Has ejecutado <code>node seed.js</code> para poblar la BD</li>
            </ul>
          </div>
        </div>
      )}

      {!loading && !error && libros.length === 0 && (
        <div className="no-books">
          <p>📚 No hay libros disponibles</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="books-grid">
          {libros.map((libro) => {
            const tieneDisponibles = libro.disponibles > 0;
            const estaPrestado = libro.pretados > 0;

            return (
              <div 
                key={libro._id} 
                className={`book-card ${tieneDisponibles ? 'available' : 'borrowed'}`}
              >
                <div className="book-cover">
                  <span className="cover-emoji">{libro.portada}</span>
                </div>
                
                <div className="book-info">
                  <h2>{libro.titulo}</h2>
                  <p className="autor">por {libro.autor}</p>
                  
                  <p className="sinopsis">{libro.sinopsis}</p>
                  
                  <div className="book-details">
                    <div className="detail">
                      <span className="label">Disponibles:</span>
                      <span className="value">{libro.disponibles}</span>
                    </div>
                    
                    <div className={`status ${tieneDisponibles ? 'available' : 'borrowed'}`}>
                      {estaPrestado ? (
                        <>
                          <span className="status-icon">🔄</span>
                          <span>En préstamo</span>
                        </>
                      ) : (
                        <>
                          <span className="status-icon">✓</span>
                          <span>Disponible</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Books;
