import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getBooks, createBook, updateBook, deleteBook } from '../services/bookService';
import '../styles/Admin.css';

function Admin() {
  const { esAdmin } = useAuth();
  const { isDark } = useTheme();
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [editando, setEditando] = useState(null);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    portada: '',
    sinopsis: '',
    disponibles: 0,
    pretados: 0
  });

  useEffect(() => {
    if (!esAdmin()) {
      return;
    }
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setLibros(data);
      setError('');
    } catch (err) {
      setError('Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'disponibles' || name === 'pretados' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      titulo: '',
      autor: '',
      portada: '',
      sinopsis: '',
      disponibles: 0,
      pretados: 0
    });
    setEditando(null);
    setFormularioAbierto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validaciones
    if (!formData.titulo.trim() || !formData.autor.trim() || 
        !formData.portada.trim() || !formData.sinopsis.trim()) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      if (editando) {
        // Actualizar
        await updateBook(editando, formData);
        setExito('Libro actualizado correctamente');
      } else {
        // Crear
        await createBook(formData);
        setExito('Libro creado correctamente');
      }
      await cargarLibros();
      limpiarFormulario();
    } catch (err) {
      setError(err.message || 'Error al guardar el libro');
    }
  };

  const handleEditar = (libro) => {
    setFormData({
      titulo: libro.titulo,
      autor: libro.autor,
      portada: libro.portada,
      sinopsis: libro.sinopsis,
      disponibles: libro.disponibles,
      pretados: libro.pretados
    });
    setEditando(libro._id);
    setFormularioAbierto(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      return;
    }

    setError('');
    try {
      await deleteBook(id);
      setExito('Libro eliminado correctamente');
      await cargarLibros();
    } catch (err) {
      setError(err.message || 'Error al eliminar el libro');
    }
  };

  if (!esAdmin()) {
    return (
      <div className={`admin-container ${isDark ? 'dark' : 'light'}`}>
        <div className="access-denied">
          <h2>❌ Acceso Denegado</h2>
          <p>Solo los administradores pueden acceder a esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-container ${isDark ? 'dark' : 'light'}`}>
      <div className="admin-header">
        <h1>⚙️ Panel de Administración</h1>
        <button 
          onClick={() => setFormularioAbierto(!formularioAbierto)}
          className="btn-nuevo"
        >
          {formularioAbierto ? '✕ Cerrar' : '➕ Nuevo Libro'}
        </button>
      </div>

      {exito && (
        <div className="success-message">
          <span>✓</span>
          <p>{exito}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>✗</span>
          <p>{error}</p>
        </div>
      )}

      {formularioAbierto && (
        <div className="formulario-libro">
          <h2>{editando ? '✏️ Editar Libro' : '➕ Nuevo Libro'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Título del libro"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="autor">Autor *</label>
                <input
                  type="text"
                  id="autor"
                  name="autor"
                  value={formData.autor}
                  onChange={handleChange}
                  placeholder="Nombre del autor"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="portada">Portada (Emoji) *</label>
                <input
                  type="text"
                  id="portada"
                  name="portada"
                  value={formData.portada}
                  onChange={handleChange}
                  placeholder="Ej: 📚"
                  maxLength={2}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="disponibles">Disponibles *</label>
                <input
                  type="number"
                  id="disponibles"
                  name="disponibles"
                  value={formData.disponibles}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pretados">Prestados</label>
                <input
                  type="number"
                  id="pretados"
                  name="pretados"
                  value={formData.pretados}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="sinopsis">Sinopsis *</label>
              <textarea
                id="sinopsis"
                name="sinopsis"
                value={formData.sinopsis}
                onChange={handleChange}
                placeholder="Descripción breve del libro"
                rows={4}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-submit">
                {editando ? 'Actualizar' : 'Crear'}
              </button>
              <button 
                type="button" 
                onClick={limpiarFormulario}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando libros...</p>
        </div>
      ) : (
        <div className="libros-lista">
          <h2>Libros en la Biblioteca ({libros.length})</h2>
          
          {libros.length === 0 ? (
            <p className="no-books">No hay libros registrados</p>
          ) : (
            <div className="table-responsive">
              <table className="libros-table">
                <thead>
                  <tr>
                    <th>Portada</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Disponibles</th>
                    <th>Prestados</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {libros.map(libro => (
                    <tr key={libro._id}>
                      <td className="emoji">{libro.portada}</td>
                      <td>{libro.titulo}</td>
                      <td>{libro.autor}</td>
                      <td className="numero">{libro.disponibles}</td>
                      <td className="numero">{libro.pretados}</td>
                      <td className="numero bold">{libro.total}</td>
                      <td className="acciones">
                        <button 
                          onClick={() => handleEditar(libro)}
                          className="btn-editar"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleEliminar(libro._id)}
                          className="btn-eliminar"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
