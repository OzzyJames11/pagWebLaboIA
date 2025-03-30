// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <h2>Pagina Web de Registro de Asistencia</h2>
//       <h3>Laboratorio de IA</h3>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// src/App.jsx
// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// // import Home from "./pages/Home";
// // import Register from "./pages/Register";
// // import History from "./pages/History";
// import "./App.css"; // El CSS global para la aplicación
// import "./index.css"; // El CSS de estilos base

// // Páginas de ejemplo
// // const Home = () => <h2>Bienvenido a la Página Principal</h2>;
// const About = () => <h2>Acerca de Nosotros</h2>;
// const Contact = () => <h2>Contáctanos</h2>;

// const App = () => {
//   return (
//     <Router>
//       <Header />
//       <main>
//         <Routes>
//           {/* <Route path="/" element={<Home />} /> */}
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </main>
//       <Footer />
//     </Router>
//   );
// };

// export default App;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Importa el tema personalizado
//componentes
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
//estilos globales
import './styles/global.css';
//router
import { BrowserRouter as Router } from 'react-router-dom';
// paths ?
import AppRouter from './routes/index'; // Importa el enrutador
import './App.css';
import { Box, Typography } from '@mui/material'; // Importa Box de Material-UI  

const App = () => {
  const [data, setData] = useState([]); // Estado para almacenar los datos

  useEffect(() => {
    axios.get('http://localhost:5000/api/pasantes') // Reemplaza con la URL real de tu API
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', p: 3 }}>
          <AppRouter />

          {/* Contenedor de la lista con estilos acorde al tema */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4">Lista de Pasantes</Typography>
            {data.map((pasante, index) => (
              <Box key={index} sx={{ p: 2, borderBottom: '1px solid gray' }}>
                <Typography variant="body1">{pasante.nombre} - {pasante.email}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Footer />
      </ThemeProvider>
    </Router>
  );
};

export default App;