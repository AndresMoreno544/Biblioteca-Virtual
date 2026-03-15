import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rol, setRol] = useState(null);

  // Verificar si hay usuario autenticado al cargar
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
          setRol(data.rol);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarAutenticacion();
  }, []);

  const login = async (email, contrasena) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, contrasena })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      setUsuario(data.usuario);
      setRol(data.usuario.rol);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const registro = async (nombre, email, contrasena, confirmarContrasena) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ nombre, email, contrasena, confirmarContrasena })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrarse');
      }

      const data = await response.json();
      setUsuario(data.usuario);
      setRol(data.usuario.rol);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUsuario(null);
      setRol(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const esAdmin = () => rol === 'admin';
  const esUsuario = () => rol === 'user';
  const estaAutenticado = () => usuario !== null;

  return (
    <AuthContext.Provider value={{
      usuario,
      rol,
      loading,
      login,
      registro,
      logout,
      esAdmin,
      esUsuario,
      estaAutenticado
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
