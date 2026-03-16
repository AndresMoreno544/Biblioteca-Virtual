import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rol, setRol] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar si hay token guardado al cargar
  useEffect(() => {
    const verificarAutenticacion = async () => {
      const tokenGuardado = localStorage.getItem('token');
      
      if (tokenGuardado) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${tokenGuardado}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUsuario(data);
            setRol(data.rol);
            setToken(tokenGuardado);
          } else {
            // Token inválido, limpiar
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
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
        body: JSON.stringify({ email, contrasena })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
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
        body: JSON.stringify({ nombre, email, contrasena, confirmarContrasena })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrarse');
      }

      const data = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUsuario(data.usuario);
      setRol(data.usuario.rol);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    setRol(null);
  };

  const esAdmin = () => rol === 'admin';
  const esUsuario = () => rol === 'user';
  const estaAutenticado = () => usuario !== null;
  const getToken = () => token;

  return (
    <AuthContext.Provider value={{
      usuario,
      rol,
      token,
      loading,
      login,
      registro,
      logout,
      esAdmin,
      esUsuario,
      estaAutenticado,
      getToken
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
