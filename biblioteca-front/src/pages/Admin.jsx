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
        prestados: 0  // FIX 6: corregido typo 'pretados' -> 'prestados'
    });
    const [tipoPortada, setTipoPortada] = useState('url');
    const [previewPortada, setPreviewPortada] = useState('');

    // FIX 8: esAdmin añadido al array de dependencias
    useEffect(() => {
        if (!esAdmin()) return;
        cargarLibros();
    }, [esAdmin]);

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
            [name]: name === 'disponibles' || name === 'prestados'
                ? parseInt(value) || 0
                : value
        }));
    };

    const handleArchivoImagen = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;
        if (!archivo.type.startsWith('image/')) {
            setError('Por favor selecciona un archivo de imagen');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const imagenBase64 = event.target.result;
            setFormData(prev => ({ ...prev, portada: imagenBase64 }));
            setPreviewPortada(imagenBase64);
            setError('');
        };
        reader.readAsDataURL(archivo);
    };

    const handleURLImagen = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, portada: url }));
        setPreviewPortada(url);
    };

    const limpiarFormulario = () => {
        setFormData({
            titulo: '',
            autor: '',
            portada: '',
            sinopsis: '',
            disponibles: 0,
            prestados: 0  // FIX 6: typo corregido
        });
        setEditando(null);
        setFormularioAbierto(false);
        setTipoPortada('url');
        setPreviewPortada('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');
        if (!formData.titulo.trim() || !formData.autor.trim() ||
            !formData.portada.trim() || !formData.sinopsis.trim()) {
            setError('Todos los campos son requeridos');
            return;
        }
        try {
            if (editando) {
                await updateBook(editando, formData);
                setExito('Libro actualizado correctamente');
            } else {
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
            prestados: libro.prestados  // FIX 6: typo corregido
        });
        setEditando(libro._id);
        setFormularioAbierto(true);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este libro?')) return;
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

            {/* FIX 1, 2, 3, 4, 5: formulario completamente reestructurado dentro del return */}
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
                            <div className="form-group full-width">
                                <label>Portada de Libro *</label>
                                <div className="portada-opciones">
                                    <div className="opcion-portada">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="tipoPortada"
                                                value="url"
                                                checked={tipoPortada === 'url'}
                                                onChange={(e) => setTipoPortada(e.target.value)}
                                            />
                                            <span>Usar URL de imagen</span>
                                        </label>
                                        {tipoPortada === 'url' && (
                                            <input
                                                type="text"
                                                placeholder="Ingresa la URL de la imagen"
                                                value={formData.portada}
                                                onChange={handleURLImagen}
                                                className="input-url"
                                            />
                                        )}
                                    </div>
                                    <div className="opcion-portada">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="tipoPortada"
                                                value="archivo"
                                                checked={tipoPortada === 'archivo'}
                                                onChange={(e) => setTipoPortada(e.target.value)}
                                            />
                                            <span>Cargar desde mi dispositivo</span>
                                        </label>
                                        {tipoPortada === 'archivo' && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleArchivoImagen}
                                                className="input-archivo"
                                            />
                                        )}
                                    </div>
                                </div>
                                {previewPortada && (
                                    <div className="preview-portada">
                                        <p>Vista previa:</p>
                                        <img src={previewPortada} alt="Preview" />
                                    </div>
                                )}
                                {!formData.portada && (
                                    <p className="requerido">Campo requerido</p>
                                )}
                            </div>
                        </div>

                        {/* FIX 7: form-group wrapper añadido a disponibles */}
                        <div className="form-row">
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
                                <label htmlFor="prestados">Prestados</label>
                                <input
                                    type="number"
                                    id="prestados"
                                    name="prestados"
                                    value={formData.prestados}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* FIX 5: sinopsis y botones ahora están dentro del <form> */}
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

            {/* FIX 3: bloque de tabla movido dentro del return() */}
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
                                            <td className="portada-cell">
                                                {libro.portada.startsWith('http') || libro.portada.startsWith('data:') ? (
                                                    <img src={libro.portada} alt={libro.titulo} className="tabla-imagen" />
                                                ) : (
                                                    <span className="tabla-emoji">{libro.portada}</span>
                                                )}
                                            </td>
                                            <td>{libro.titulo}</td>
                                            <td>{libro.autor}</td>
                                            <td className="numero">{libro.disponibles}</td>
                                            <td className="numero">{libro.prestados}</td>
                                            <td className="numero bold">{libro.total}</td>
                                            <td className="acciones">
                                                <button
                                                    onClick={() => handleEditar(libro)}
                                                    className="btn-editar"
                                                    title="Editar"
                                                >✏️</button>
                                                <button
                                                    onClick={() => handleEliminar(libro._id)}
                                                    className="btn-eliminar"
                                                    title="Eliminar"
                                                >🗑️</button>
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