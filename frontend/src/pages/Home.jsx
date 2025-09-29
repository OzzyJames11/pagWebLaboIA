// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header/Header';
// import imagenHome from '../assets/img/BannerLaboIA.png';
// import '../assets/css/Home.css';
// import Button from '../components/Elements/Button';
// import AuthModal from '../context/AuthModal';
// import { useAuth } from '../context/AuthContext';

// const Home = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const handleLoginSuccess = () => {
//     setModalOpen(false);
//     // Redirige según el rol
//     if (user?.rol === 'administrador') {
//       navigate('/admin');
//     } else {
//       navigate('/datos');
//     }
//   };

//   return (
//     <div className="home">
//       <div className="background-image">
//         <img src={imagenHome} alt="Background" className="background-img" />
//         <div className="overlay"></div>
//       </div>
//       <h2 style={{textAlign: 'left'}}>Registro de Pasantes</h2>
//       <Button 
//         variant="contained" 
//         color="pink" 
//         onClick={() => setModalOpen(true)} 
//         align="center"
//       >
//         {"Regístrate"}
//       </Button>
      
//       <AuthModal 
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onLoginSuccess={handleLoginSuccess}
//       />
//     </div>
//   );
// };
// export default Home;


// import React, { useState, useEffect } from 'react';
// import { Button, Typography, Box } from '@mui/material';
// import Header from '../components/Header/Header';
// import imagenHome from '../assets/img/BannerLaboIA.png';
// import '../assets/css/Home.css';
// import AuthModal from '../context/AuthModal';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// const Home = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [ultimoRegistro, setUltimoRegistro] = useState(null);
//   const { user, isAuthenticated } = useAuth();

//   useEffect(() => {
//     const cargarUltimoRegistro = async () => {
//       if (isAuthenticated && user?.id_usuario) { // Verificar id_usuario
//         try {
//           const response = await axios.get('http://localhost:5000/api/mis-asistencias', {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//           });
          
//           // Filtrar solo registros del usuario actual
//           const registrosUsuario = response.data.filter(reg => reg.id_usuario === user.id_usuario);
          
//           if (registrosUsuario.length > 0) {
//             setUltimoRegistro(registrosUsuario[0]);
//           } else {
//             setUltimoRegistro(null);
//           }
//         } catch (error) {
//           console.error('Error al cargar registro:', error);
//           setUltimoRegistro(null);
//         }
//       }
//     };
  
//     cargarUltimoRegistro();
//   }, [isAuthenticated, user]); // Dependencia de user completa

//   const cargarUltimoRegistro = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/mis-asistencias');
//       if (response.data.length > 0) {
//         setUltimoRegistro(response.data[0]);
//       }
//     } catch (error) {
//       console.error('Error al cargar registro:', error);
//     }
//   };

//   const registrarEntrada = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/registrar-entrada');
//       alert(response.data.message);
//       cargarUltimoRegistro();
//     } catch (error) {
//       alert(error.response?.data?.message || 'Error al registrar entrada');
//     }
//   };

//   const registrarSalida = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/registrar-salida');
//       alert(response.data.message);
//       cargarUltimoRegistro();
//     } catch (error) {
//       alert(error.response?.data?.message || 'Error al registrar salida');
//     }
//   };

//   return (
//     <div className="home">
//       <div className="background-image">
//         <img src={imagenHome} alt="Background" className="background-img" />
//         <div className="overlay"></div>
//       </div>
      
//       <h2 style={{textAlign: 'left'}}>Registro de Pasantes</h2>
      
//       {isAuthenticated ? (
//         <Box sx={{ textAlign: 'left', mt: 2 }}>
//           <Typography variant="h5">
//             ¡Bienvenido {user.nombre}!
//           </Typography>
//           <Typography variant="body1">Rol: {user.rol}</Typography>
//           <Typography variant="body1">
//             Último ingreso: {ultimoRegistro?.hora_entrada 
//               ? new Date(ultimoRegistro.hora_entrada).toLocaleString() 
//               : 'No registrado'}
//           </Typography>
          
//           {(!ultimoRegistro || ultimoRegistro.hora_salida) ? (
//             <Button 
//               variant="contained" 
//               color="primary" 
//               onClick={registrarEntrada}
//               sx={{ mt: 2 }}
//             >
//               Registrar Asistencia
//             </Button>
//           ) : (
//             <Button 
//               variant="contained" 
//               color="secondary" 
//               onClick={registrarSalida}
//               sx={{ mt: 2 }}
//             >
//               Registrar Salida
//             </Button>
//           )}
//         </Box>
//       ) : (
//         <Button 
//           variant="contained" 
//           color="pink" 
//           onClick={() => setModalOpen(true)} 
//           align="center"
//           sx={{ mt: 2 }}
//         >
//           {"Regístrate / Iniciar Sesión"}
//         </Button>
//       )}
      
//       <AuthModal 
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default Home;

// import React, { useState, useEffect } from 'react';
// import { Button, Typography, Box } from '@mui/material';
// import Header from '../components/Header/Header';
// import imagenHome from '../assets/img/BannerLaboIA.png';
// import '../assets/css/Home.css';
// import AuthModal from '../context/AuthModal';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// const Home = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [ultimoRegistro, setUltimoRegistro] = useState(null);
//   const { user, isAuthenticated } = useAuth();

//   const cargarUltimoRegistro = async () => {
//     if (!isAuthenticated || !user?.id_usuario) return;
    
//     try {
//       const response = await axios.get('http://localhost:5000/api/mis-asistencias', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       // El backend ya devuelve solo los registros del usuario actual ordenados
//       if (response.data.length > 0) {
//         setUltimoRegistro(response.data[0]);
//       } else {
//         setUltimoRegistro(null);
//       }
//     } catch (error) {
//       console.error('Error al cargar registro:', error);
//       setUltimoRegistro(null);
//     }
//   };

//   useEffect(() => {
//     cargarUltimoRegistro();
//   }, [isAuthenticated, user?.id_usuario]); // Solo dependencias necesarias

//   const registrarEntrada = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/registrar-entrada',
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       alert(response.data.message);
//       await cargarUltimoRegistro();
//     } catch (error) {
//       alert(error.response?.data?.message || 'Error al registrar entrada');
//     }
//   };

//   const registrarSalida = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/registrar-salida', 
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       alert(response.data.message);
//       await cargarUltimoRegistro();
//     } catch (error) {
//       alert(error.response?.data?.message || 'Error al registrar salida');
//     }
//   };

//   return (
//     <div className="home">
//       <div className="background-image">
//         <img src={imagenHome} alt="Background" className="background-img" />
//         <div className="overlay"></div>
//       </div>
      
//       <h2 style={{textAlign: 'left'}}>Registro de Pasantes</h2>
      
//       {isAuthenticated ? (
//         <Box sx={{ textAlign: 'left', mt: 2 }}>
//           <Typography variant="h5">
//             ¡Bienvenido {user.nombre}!
//           </Typography>
//           <Typography variant="body1">Rol: {user.rol}</Typography>
//           <Typography variant="body1">
//             {ultimoRegistro?.hora_entrada 
//               ? `Último ingreso: ${new Date(ultimoRegistro.hora_entrada).toLocaleString()}`
//               : 'No hay registros de ingreso'}
//           </Typography>
          
//           {(!ultimoRegistro || ultimoRegistro.hora_salida) ? (
//             <Button 
//               variant="contained" 
//               color="primary" 
//               onClick={registrarEntrada}
//               sx={{ mt: 2 }}
//             >
//               Registrar Asistencia
//             </Button>
//           ) : (
//             <Button 
//               variant="contained" 
//               color="secondary" 
//               onClick={registrarSalida}
//               sx={{ mt: 2 }}
//             >
//               Registrar Salida
//             </Button>
//           )}
//         </Box>
//       ) : (
//         <Button 
//           variant="contained" 
//           color="pink" 
//           onClick={() => setModalOpen(true)} 
//           align="center"
//           sx={{ mt: 2 }}
//         >
//           {"Regístrate / Iniciar Sesión"}
//         </Button>
//       )}
      
//       <AuthModal 
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import Header from '../components/Header/Header';
import imagenHome from '../assets/img/BannerLaboIA.png';
import '../assets/css/Home.css';
import AuthModal from '../context/AuthModal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { mt } from 'date-fns/locale';

// Funciones de formato de fecha
const formatFullDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ultimoRegistro, setUltimoRegistro] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const cargarUltimoRegistro = async () => {
    if (!isAuthenticated || !user?.id_usuario) return;
    
    try {
      const response = await axios.get('http://localhost:5000/api/mis-asistencias', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.length > 0) {
        setUltimoRegistro(response.data[0]);
      } else {
        setUltimoRegistro(null);
      }
    } catch (error) {
      console.error('Error al cargar registro:', error);
      setUltimoRegistro(null);
    }
  };

  useEffect(() => {
    cargarUltimoRegistro();
  }, [isAuthenticated, user?.id_usuario]);

  const registrarEntrada = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/registrar-entrada',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert(response.data.message);
      await cargarUltimoRegistro();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar entrada');
    }
  };

  const registrarSalida = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/registrar-salida', 
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert(response.data.message);
      await cargarUltimoRegistro();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar salida');
    }
  };

  return (
    <div className="home">


      <div className="background-image">
        <img src={imagenHome} alt="Background" className="background-img" />
        <div className="overlay"></div>
      </div>

      
      <Box sx={{ 
          textAlign: 'left', 
          mt: 0,
          maxWidth: '1200px',
          mx: 'auto'
        }}>
        <Typography variant='h6' textAlign={'left'} fontWeight={"bold"} fontSize={25} mt={2}>Registro de Pasantes</Typography>
      </Box>


      {isAuthenticated ? (
        <Box sx={{ 
          textAlign: 'left', 
          mt: 0,
          maxWidth: '1200px',
          mx: 'auto'
        }}>
            {/* <Typography variant='h6' textAlign={'left'} fontWeight={"bold"} fontSize={25} mt={2}>Registro de Pasantes</Typography> */}
          <Typography variant="h5">
            ¡Bienvenido {user.nombre}!
          </Typography>
          
          {ultimoRegistro && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
              <Typography variant="h6" fontWeight="bold">Último Ingreso</Typography>
              <Typography>Fecha: {formatFullDate(ultimoRegistro.hora_entrada)}</Typography>
              <Typography>Hora entrada: {formatTime(ultimoRegistro.hora_entrada)}</Typography>
              {ultimoRegistro.hora_salida && (
                <>
                  {/* <Typography>Fecha salida: {formatFullDate(ultimoRegistro.hora_salida)}</Typography> */}
                  <Typography>Hora salida: {formatTime(ultimoRegistro.hora_salida)}</Typography>
                </>
              )}
            </Box>
          )}
          
          <Box sx={{ mt: 2 }}>
            {(!ultimoRegistro || ultimoRegistro.hora_salida) ? (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={registrarEntrada}
                fullWidth
                sx={{ mt: 2 }}
              >
                Registrar Asistencia
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={registrarSalida}
                fullWidth
                sx={{ mt: 2 }}
              >
                Registrar Salida
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setModalOpen(true)} 
          align="center"
          sx={{ mt: 2 }}
        >
          {"Iniciar Sesión"}
        </Button>
      )}
      
      <AuthModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Home;

//   return (
//     <div
//       // className="home"
//       // style={{
//         // marginBottom: '-200px',
//         // paddingBottom: '-200px',
//       //   display: 'flex',
//       //   flexDirection: 'column',
//       //   //minHeight: isAuthenticated ? 'calc(50vh - 150px)' : '100px', // 64px es el header
//       //   //justifyContent: isAuthenticated ? 'flex-start' : 'center', // Si no está autenticado, centra el contenido
//       //   // padding: isAuthenticated ? '20px' : '10px',
//       //   maxHeight: isAuthenticated ? 'calc(100vh - 200px)' : '100px',
//       // }}
//     >
//       {/* Contenido principal */}
//       <Box>
//         {/* Banner */}
//         <div className="background-image">
//           <img src={imagenHome} alt="Background" className="background-img" />
//           <div className="overlay"></div>
//         </div>

//         {/* Título */}
//         <Typography
//           variant="h6"
//           textAlign="left"
//           fontWeight="bold"
//           fontSize={25}
//           mt={2}
//           px={2}
//         >
//           Registro de Pasantes
//         </Typography>

//         {/* Contenido según autenticación */}
//         <Box sx={{ px: 2, mt: 2 }}>
//           {isAuthenticated ? (
//             <Box sx={{ textAlign: 'left', mt: 0 }}>
//               <Typography variant="h5">¡Bienvenido {user.nombre}!</Typography>

//               {ultimoRegistro && (
//                 <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
//                   <Typography variant="h6" fontWeight="bold">
//                     Último Ingreso
//                   </Typography>
//                   <Typography>Fecha: {formatFullDate(ultimoRegistro.hora_entrada)}</Typography>
//                   <Typography>Hora: {formatTime(ultimoRegistro.hora_entrada)}</Typography>
//                   {ultimoRegistro.hora_salida && (
//                     <>
//                       <Typography>Fecha salida: {formatFullDate(ultimoRegistro.hora_salida)}</Typography>
//                       <Typography>Hora salida: {formatTime(ultimoRegistro.hora_salida)}</Typography>
//                     </>
//                   )}
//                 </Box>
//               )}

//               <Box sx={{ mt: 2 }}>
//                 {(!ultimoRegistro || ultimoRegistro.hora_salida) ? (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={registrarEntrada}
//                     fullWidth
//                     sx={{ mt: 2 }}
//                   >
//                     Registrar Asistencia
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={registrarSalida}
//                     fullWidth
//                     sx={{ mt: 2 }}
//                   >
//                     Registrar Salida
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//           ) : (
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => setModalOpen(true)}
//               //fullWidth
//               sx={{ mt: 2 }}
//             >
//               Regístrate / Iniciar Sesión
//             </Button>
              
//           )}
//           {/* <Box sx={{ mt: -10 }}>a</Box> */}
//         </Box>
//       </Box>

//       {/* Modal de autenticación */}
//       <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />

//     </div>
//   );
// };

// export default Home;