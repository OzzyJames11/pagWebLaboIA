import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';

// 1. Contexto creado como export nombrado para mejor manejo de HMR
export const AuthContext = createContext();

// 2. Hook de autenticación con validación mejorada
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// 3. Componente Provider con estado consolidado
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
    ultimoRegistro: null
  });

  // Función para actualizar el estado de forma consistente
  const setAuthData = (newState) => {
    setAuthState(prev => ({ ...prev, ...newState }));
  };

  // Efecto para inicialización
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthData({
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          loading: false
        });

        // Cargar último registro al iniciar
        try {
          const response = await axios.get('http://localhost:5000/api/mis-asistencias');
          setAuthData({
            ultimoRegistro: response.data.length > 0 ? response.data[0] : null
          });
        } catch (error) {
          console.error('Error al cargar último registro:', error);
        }
      } else {
        setAuthData({ loading: false });
      }
    };

    initializeAuth();
  }, []);

  // Función de login mejorada
  const login = async (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setAuthData({
      user: userData,
      isAuthenticated: true,
      loading: false
    });

    // Cargar último registro después de login
    try {
      const response = await axios.get('http://localhost:5000/api/mis-asistencias');
      setAuthData({
        ultimoRegistro: response.data.length > 0 ? response.data[0] : null
      });
    } catch (error) {
      console.error('Error al cargar último registro:', error);
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setAuthData({
      user: null,
      isAuthenticated: false,
      ultimoRegistro: null
    });
  };

  // Actualizar último registro
  const actualizarUltimoRegistro = (registro) => {
    setAuthData({ ultimoRegistro: registro });
  };

  // Valor del contexto memoizado
  const contextValue = useMemo(() => ({
    ...authState,
    login,
    logout,
    actualizarUltimoRegistro
  }), [authState]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportación por defecto para compatibilidad
export default AuthContext;