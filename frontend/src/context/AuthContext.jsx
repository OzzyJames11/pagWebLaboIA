// // si se necesita autenticación
// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const login = (userData) => {
//     setUser(userData);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Verificar token al cargar la aplicación
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       // Obtener datos del usuario
//       axios.get('http://localhost:5000/api/me')
//         .then(response => {
//           setUser(response.data);
//           setIsAuthenticated(true);
//         })
//         .catch(error => {
//           console.error('Error al verificar token:', error);
//           logout();
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = (userData, token) => {
//     return new Promise((resolve) => {
//       console.log('Ejecutando login con:', userData);
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userData));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(userData);
//       setIsAuthenticated(true);
//       console.log('Login completado en AuthContext'); // Debug adicional
//       resolve(true); // Asegurar que resuelve la promesa
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
    
//     if (token && savedUser) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(JSON.parse(savedUser));
//       setIsAuthenticated(true);
//     }
//     setLoading(false);
//   }, []);

//   const login = async (userData, token) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     setUser(userData);
//     setIsAuthenticated(true);

//     // Obtener datos adicionales si es necesario
//     try {
//       const response = await axios.get('http://localhost:5000/api/mis-asistencias');
//       // Puedes almacenar estos datos en el estado si es necesario
//     } catch (error) {
//       console.error('Error al obtener datos adicionales:', error);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//     setIsAuthenticated(false);
//     setUltimoRegistro(null); 
//   };

//   const value = useMemo(() => ({
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     logout
//   }), [user, isAuthenticated, loading]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth debe usarse dentro de AuthProvider');
//   }
//   return context;
// };


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