import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { usuario, logout, esAdmin, estaAutenticado } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuAbierto(false);
  };

  return (
    <header className={`header ${isDark ? 'dark' : 'light'}`}>
      <div className="header-container">
        <div className="logo">
          <h1>📚 Biblioteca Virtual</h1>
        </div>

        <nav className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Inicio
          </Link>
          <Link 
            to="/books" 
            className={`nav-link ${isActive('/books') ? 'active' : ''}`}
          >
            Libros Disponibles
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            Quiénes Somos
          </Link>
          {esAdmin() && (
            <Link 
              to="/admin" 
              className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
            >
              ⚙️ Admin
            </Link>
          )}
        </nav>

        <div className="header-right">
          <button className="theme-toggle-header" onClick={toggleTheme} title="Cambiar tema">
            {isDark ? "☀️" : "🌙"}
          </button>

          {estaAutenticado() ? (
            <div className="user-menu">
              <button 
                className="user-btn"
                onClick={() => setMenuAbierto(!menuAbierto)}
              >
                👤 {usuario?.nombre}
              </button>
              {menuAbierto && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p><strong>{usuario?.nombre}</strong></p>
                    <p className="user-email">{usuario?.email}</p>
                    <p className="user-rol">{usuario?.rol === 'admin' ? '👑 Administrador' : '👤 Usuario'}</p>
                  </div>
                  <button onClick={handleLogout} className="logout-btn">
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="login-btn">
              🔓 Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
