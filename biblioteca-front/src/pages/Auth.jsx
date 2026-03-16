import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Auth.css';

function Auth() {
  const [esLogin, setEsLogin] = useState(true);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const { login, registro } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (esLogin) {
        // Login
        await login(formData.email, formData.contrasena);
      } else {
        // Registro
        if (formData.contrasena.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setCargando(false);
          return;
        }
        if (!formData.nombre.trim()) {
          setError('El nombre es requerido');
          setCargando(false);
          return;
        }
        await registro(
          formData.nombre,
          formData.email,
          formData.contrasena,
          formData.confirmarContrasena
        );
      }

      navigate('/books');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={`auth-container ${isDark ? 'dark' : 'light'}`}>
      <div className="auth-card">
        <div className="auth-header">
          <h1>📚 Biblioteca Virtual</h1>
          <p>{esLogin ? 'Inicia sesión' : 'Crea tu cuenta'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!esLogin && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required={!esLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          {!esLogin && (
            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
                required={!esLogin}
              />
            </div>
          )}

          {error && (
            <div className="error-box">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={cargando}
          >
            {cargando ? 'Cargando...' : esLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {esLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setEsLogin(!esLogin);
                setError('');
                setFormData({
                  nombre: '',
                  email: '',
                  contrasena: '',
                  confirmarContrasena: ''
                });
              }}
            >
              {esLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
