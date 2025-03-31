// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// import { ThemeProvider } from '@mui/material/styles';
// import theme from './theme'; // Importa el tema personalizado
// //componentes
// import Header from './components/Header/Header';
// import Footer from './components/Footer/Footer';
// import { AuthProvider } from './context/AuthContext';
// //estilos globales
// import './styles/global.css';
// //router
// import { BrowserRouter as Router } from 'react-router-dom';
// // paths ?
// import AppRouter from './routes/index'; // Importa el enrutador
// import './App.css';
// import { Box, Typography } from '@mui/material'; // Importa Box de Material-UI  

// const App = () => {
//   const [data, setData] = useState([]); // Estado para almacenar los datos
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (data.length === 0) {
//       axios.get('http://localhost:5000/api/usuarios') // Reemplaza con la URL real de tu API
//         .then(response => {
//           console.log("Datos recibidos del backend:", response.data); // Verifica que llegan datos
//           setData(response.data);
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('Error al obtener los datos:', error);
//           setLoading(false);
//         });
//     }
//   }, [data.length]); // Se ejecuta solo cuando `data` está vacío

//   return (
//     <Router>
//       <ThemeProvider theme={theme}>
//         <AuthProvider>
//           <Header />
//           <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', p: 3 }}>
//             <AppRouter />
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="h4">Lista de Usuarios</Typography>
//               {loading ? (
//                 <Typography>Cargando datos...</Typography>
//               ) : (
//                 data.length > 0 ? (
//                   data.map((usuario, index) => (
//                     <Box key={index} sx={{ p: 2, borderBottom: '1px solid gray' }}>
//                       <Typography variant="body1">
//                         <strong>{usuario.nombre} {usuario.apellido}</strong> - {usuario.email} ({usuario.rol})
//                       </Typography>
//                     </Box>
//                   ))
//                 ) : (
//                   <Typography>No hay usuarios registrados.</Typography>
//                 )
//               )}
//             </Box>
//           </Box>
//           <Footer />
//         </AuthProvider>
//       </ThemeProvider>
//     </Router>
//   );
// };

// export default App;



// otro
// import React from 'react';
// import { ThemeProvider } from '@mui/material/styles';
// import theme from './theme';
// import { AuthProvider } from './context/AuthContext';
// import Header from './components/Header/Header';
// import Footer from './components/Footer/Footer';
// import './styles/global.css';
// import { BrowserRouter as Router } from 'react-router-dom';
// import AppRouter from './routes/index';
// import './App.css';
// import { Box } from '@mui/material';
// // import { useAuth } from './context/AuthContext';

// const AppContent = () => {
//   return (
//     <>
//       <Header />
//       <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', p: 3 }}>
//         <AppRouter />
//       </Box>
//       <Footer />
//     </>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <ThemeProvider theme={theme}>
//         <AuthProvider>
//           <AppContent />
//         </AuthProvider>
//       </ThemeProvider>
//     </Router>
//   );
// };

// export default App;


import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AuthProvider } from './context/AuthContext'; // Importar solo el Provider
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './styles/global.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/index';
import './App.css';
import { Box } from '@mui/material';

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Header />
          <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', p: 3 }}>
            <AppRouter />
          </Box>
          <Footer />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;