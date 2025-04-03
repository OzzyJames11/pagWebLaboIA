// import React from 'react';
// import { Typography, Box, Paper } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';

// const DatosPasante = () => {
//   const { user } = useAuth();

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Mis Datos Personales
//       </Typography>
      
//       <Paper elevation={3} sx={{ p: 3, maxWidth: 600 }}>
//         <Typography variant="body1" paragraph>
//           <strong>ID Usuario:</strong> {user?.id_usuario}
//         </Typography>
//         <Typography variant="body1" paragraph>
//           <strong>Nombre:</strong> {user?.nombre} {user?.apellido}
//         </Typography>
//         <Typography variant="body1" paragraph>
//           <strong>Email:</strong> {user?.email}
//         </Typography>
//         <Typography variant="body1" paragraph>
//           <strong>Rol:</strong> {user?.rol}
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default DatosPasante;


// import React, { useEffect, useState } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Grid, 
//   Paper,
//   Tabs,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   MenuItem
// } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';
// import { formatFullDate, formatTime } from '../../utils/dateUtils';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const DatosPasante = () => {
//   const { user, ultimoRegistro } = useAuth();
//   const [asistencias, setAsistencias] = useState([]);
//   const [tabValue, setTabValue] = useState(0);
//   const [filtro, setFiltro] = useState('semana');
//   const [fechaInicio, setFechaInicio] = useState('');
//   const [fechaFin, setFechaFin] = useState('');

//   useEffect(() => {
//     const cargarAsistencias = async () => {
//       try {
//         let url = '/api/mis-asistencias';
//         const params = {};
        
//         if (filtro === 'rango' && fechaInicio && fechaFin) {
//           params.fechaInicio = fechaInicio;
//           params.fechaFin = fechaFin;
//         } else {
//           params.filtro = filtro;
//         }
        
//         const response = await axios.get(url, { params });
//         setAsistencias(response.data);
//       } catch (error) {
//         console.error('Error al cargar asistencias:', error);
//       }
//     };

//     cargarAsistencias();
//   }, [filtro, fechaInicio, fechaFin]);

//   // Datos para el gráfico
//   const datosGrafico = asistencias.map(reg => ({
//     fecha: formatFullDate(reg.hora_entrada),
//     horas: (new Date(reg.hora_salida) - new Date(reg.hora_entrada)) / (1000 * 60 * 60),
//     entrada: formatTime(reg.hora_entrada),
//     salida: reg.hora_salida ? formatTime(reg.hora_salida) : '--'
//   }));

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>Información General</Typography>
      
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>Datos Personales</Typography>
//             <Typography><strong>Nombre:</strong> {user.nombre} {user.apellido}</Typography>
//             <Typography><strong>Rol:</strong> {user.rol}</Typography>
//             <Typography><strong>Código Único:</strong> {user.id_usuario}</Typography>
//           </Paper>
//         </Grid>
        
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>Horario</Typography>
//             <Typography>{user.horario || 'No especificado'}</Typography>
//           </Paper>
//         </Grid>
//       </Grid>

//       <Box sx={{ mt: 3 }}>
//         <Paper elevation={3} sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>Último Ingreso</Typography>
//           {ultimoRegistro ? (
//             <>
//               <Typography><strong>Fecha:</strong> {formatFullDate(ultimoRegistro.hora_entrada)}</Typography>
//               <Typography><strong>Hora:</strong> {formatTime(ultimoRegistro.hora_entrada)}</Typography>
//             </>
//           ) : (
//             <Typography>No hay registros de ingreso</Typography>
//           )}
//         </Paper>
//       </Box>

//       <Box sx={{ mt: 3 }}>
//         <Paper elevation={3} sx={{ p: 2 }}>
//           <Typography variant="h5" gutterBottom>Registro de Asistencias</Typography>
          
//           <Box sx={{ mb: 2 }}>
//             <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
//               <Tab label="Tabla" />
//               <Tab label="Gráfico" />
//             </Tabs>
//           </Box>
          
//           <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//             <TextField
//               select
//               label="Filtrar por"
//               value={filtro}
//               onChange={(e) => setFiltro(e.target.value)}
//               sx={{ minWidth: 120 }}
//             >
//               <MenuItem value="semana">Semana actual</MenuItem>
//               <MenuItem value="mes">Mes actual</MenuItem>
//               <MenuItem value="semestre">Último semestre</MenuItem>
//               <MenuItem value="rango">Rango personalizado</MenuItem>
//             </TextField>
            
//             {filtro === 'rango' && (
//               <>
//                 <TextField
//                   label="Fecha inicio"
//                   type="date"
//                   InputLabelProps={{ shrink: true }}
//                   value={fechaInicio}
//                   onChange={(e) => setFechaInicio(e.target.value)}
//                 />
//                 <TextField
//                   label="Fecha fin"
//                   type="date"
//                   InputLabelProps={{ shrink: true }}
//                   value={fechaFin}
//                   onChange={(e) => setFechaFin(e.target.value)}
//                 />
//               </>
//             )}
//           </Box>
          
//           {tabValue === 0 ? (
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Fecha</TableCell>
//                     <TableCell>Hora Entrada</TableCell>
//                     <TableCell>Hora Salida</TableCell>
//                     <TableCell>Horas</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {asistencias.map((registro) => (
//                     <TableRow key={registro.id_registro}>
//                       <TableCell>{formatFullDate(registro.hora_entrada)}</TableCell>
//                       <TableCell>{formatTime(registro.hora_entrada)}</TableCell>
//                       <TableCell>
//                         {registro.hora_salida ? formatTime(registro.hora_salida) : '--'}
//                       </TableCell>
//                       <TableCell>
//                         {registro.hora_salida 
//                           ? ((new Date(registro.hora_salida) - new Date(registro.hora_entrada)) / (1000 * 60 * 60)).toFixed(2)
//                           : '--'}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <Box sx={{ height: 400 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={datosGrafico}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="fecha" />
//                   <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="horas" name="Horas trabajadas" fill="#8884d8" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Box>
//           )}
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default DatosPasante;



// Funciona pero presenta una tabla super simple
// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';
// import { formatFullDate, formatTime } from '../../utils/dateUtils';

// const Datos = () => {
//   const { user, isAuthenticated } = useAuth();
//   const [tabValue, setTabValue] = useState('semana');
//   const [asistencias, setAsistencias] = useState([]);
//   const [fechaInicio, setFechaInicio] = useState('');
//   const [fechaFin, setFechaFin] = useState('');

//   const cargarAsistencias = async (filtro = 'semana') => {
//     if (!isAuthenticated || !user?.id_usuario) return;
    
//     try {
//       const params = {
//         filtro: filtro,
//         ...(filtro === 'rango' && { fechaInicio, fechaFin })
//       };
      
//       const response = await axios.get('http://localhost:5000/api/mis-asistencias', {
//         params,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       setAsistencias(response.data);
//     } catch (error) {
//       console.error('Error al cargar asistencias:', error);
//       setAsistencias([]);
//     }
//   };

//   useEffect(() => {
//     cargarAsistencias(tabValue);
//   }, [isAuthenticated, user?.id_usuario, tabValue]);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleFiltrarPorRango = () => {
//     if (fechaInicio && fechaFin) {
//       cargarAsistencias('rango');
//     }
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Typography variant="h4" gutterBottom>
//         Mis Asistencias
//       </Typography>
      
//       <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
//         <Tab label="Semanal" value="semana" />
//         <Tab label="Mensual" value="mes" />
//         <Tab label="Semestral" value="semestre" />
//         <Tab label="Rango Personalizado" value="rango" />
//       </Tabs>
      
//       {tabValue === 'rango' && (
//         <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//           <TextField
//             label="Fecha inicio"
//             type="date"
//             value={fechaInicio}
//             onChange={(e) => setFechaInicio(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             label="Fecha fin"
//             type="date"
//             value={fechaFin}
//             onChange={(e) => setFechaFin(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//           />
//           <Button 
//             variant="contained" 
//             onClick={handleFiltrarPorRango}
//             disabled={!fechaInicio || !fechaFin}
//           >
//             Filtrar
//           </Button>
//         </Box>
//       )}
      
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Fecha</TableCell>
//               <TableCell>Hora Entrada</TableCell>
//               <TableCell>Hora Salida</TableCell>
//               <TableCell>Estado</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {asistencias.length > 0 ? (
//               asistencias.map((asistencia) => (
//                 <TableRow key={asistencia.id_registro}>
//                   <TableCell>{formatFullDate(asistencia.hora_entrada)}</TableCell>
//                   <TableCell>{formatTime(asistencia.hora_entrada)}</TableCell>
//                   <TableCell>
//                     {asistencia.hora_salida ? formatTime(asistencia.hora_salida) : 'No registrada'}
//                   </TableCell>
//                   <TableCell>{asistencia.estado}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={4} align="center">
//                   No hay registros de asistencia
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default Datos;


import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { formatFullDate, formatTime } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DatosPasante = () => {
  const { user, ultimoRegistro } = useAuth();
  const [asistencias, setAsistencias] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [filtro, setFiltro] = useState('semana');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const cargarAsistencias = async () => {
  //     if (!user?.id_usuario) return;
      
  //     setLoading(true);
  //     setError(null);
      
  //     try {
  //       const params = { filtro };
        
  //       if (filtro === 'rango' && fechaInicio && fechaFin) {
  //         params.fechaInicio = fechaInicio;
  //         params.fechaFin = fechaFin;
  //       }
        
  //       const response = await axios.get('http://localhost:5000/api/mis-asistencias', {
  //         params,
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`
  //         }
  //       });
        
  //       console.log('Datos recibidos:', response.data); // Para depuración
  //       setAsistencias(response.data);
  //     } catch (err) {
  //       console.error('Error al cargar asistencias:', err);
  //       setError('Error al cargar los datos de asistencia');
  //       setAsistencias([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   cargarAsistencias();
  // }, [filtro, fechaInicio, fechaFin, user?.id_usuario]);

  useEffect(() => {
    const cargarAsistencias = async () => {
      if (!user?.id_usuario) return;
      
      setLoading(true);
      try {
        const params = { 
          filtro,
          ...(filtro === 'rango' && { fechaInicio, fechaFin })
        };
        
        const response = await axios.get('http://localhost:5000/api/mis-asistencias', {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Verifica la estructura de los datos recibidos
        console.log('Datos de asistencia:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setAsistencias(response.data);
        } else {
          setAsistencias([]);
          console.error('Formato de datos inesperado:', response.data);
        }
      } catch (error) {
        console.error('Error al cargar asistencias:', error);
        setError('Error al cargar los registros de asistencia');
      } finally {
        setLoading(false);
      }
    };
  
    cargarAsistencias();
  }, [filtro, fechaInicio, fechaFin, user?.id_usuario]);

  // Preparar datos para el gráfico
  const datosGrafico = asistencias.map(reg => ({
    fecha: new Date(reg.hora_entrada).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    horas: reg.hora_salida 
      ? ((new Date(reg.hora_salida) - new Date(reg.hora_entrada)) / (1000 * 60 * 60))
      : 0,
    entrada: formatTime(reg.hora_entrada),
    salida: reg.hora_salida ? formatTime(reg.hora_salida) : '--'
  }));

  return (
    <Box sx={{ p: 3, pt: 35 }}>
      {/* Información General */}
      <Typography variant="h4" gutterBottom>Información General</Typography>
      
      <Grid container spacing={3}>
        {/* Columna izquierda - Datos personales */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Datos Personales</Typography>
            <Typography><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</Typography>
            <Typography><strong>Rol:</strong> {user?.rol}</Typography>
            <Typography><strong>Código Único:</strong> {user?.id_usuario}</Typography>
          </Paper>
        </Grid>
        
        {/* Columna derecha - Horario */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Horario</Typography>
            <Typography>{user?.horario || 'Lunes a Viernes, 8:00 AM - 5:00 PM'}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Último Ingreso */}
      <Box sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Último Ingreso</Typography>
          {ultimoRegistro ? (
            <>
              <Typography><strong>Fecha:</strong> {formatFullDate(ultimoRegistro.hora_entrada)}</Typography>
              <Typography><strong>Hora:</strong> {formatTime(ultimoRegistro.hora_entrada)}</Typography>
              {ultimoRegistro.hora_salida && (
                <>
                  <Typography><strong>Hora Salida:</strong> {formatTime(ultimoRegistro.hora_salida)}</Typography>
                  <Typography><strong>Duración:</strong> {(
                    (new Date(ultimoRegistro.hora_salida) - new Date(ultimoRegistro.hora_entrada)) / (1000 * 60 * 60)
                  ).toFixed(2)} horas</Typography>
                </>
              )}
            </>
          ) : (
            <Typography>No hay registros de ingreso</Typography>
          )}
        </Paper>
      </Box>

      {/* Registro de Asistencias */}
      <Box sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>Registro de Asistencias</Typography>
          
          {/* Pestañas Tabla/Gráfico */}
          <Box sx={{ mb: 2 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Tabla" />
              <Tab label="Gráfico" />
            </Tabs>
          </Box>
          
          {/* Filtros */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Filtrar por"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="semana">Semana actual</MenuItem>
              <MenuItem value="mes">Mes actual</MenuItem>
              <MenuItem value="semestre">Último semestre</MenuItem>
              <MenuItem value="rango">Rango personalizado</MenuItem>
            </TextField>
            
            {filtro === 'rango' && (
              <>
                <TextField
                  label="Fecha inicio"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
                <TextField
                  label="Fecha fin"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </>
            )}
          </Box>
          
          {/* Contenido según pestaña seleccionada */}
          {loading ? (
            <Typography>Cargando datos...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : tabValue === 0 ? (
            // Vista de tabla
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora Entrada</TableCell>
                    <TableCell>Hora Salida</TableCell>
                    <TableCell>Horas trabajadas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asistencias.length > 0 ? (
                    asistencias.map((registro) => (
                      <TableRow key={registro.id_registro}>
                        <TableCell>{formatFullDate(registro.hora_entrada)}</TableCell>
                        <TableCell>{formatTime(registro.hora_entrada)}</TableCell>
                        <TableCell>
                          {registro.hora_salida ? formatTime(registro.hora_salida) : '--'}
                        </TableCell>
                        <TableCell>
                          {registro.hora_salida 
                            ? ((new Date(registro.hora_salida) - new Date(registro.hora_entrada)) / (1000 * 60 * 60)).toFixed(2)
                            : '--'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No hay registros de asistencia para el período seleccionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            // Vista de gráfico
            <Box sx={{ height: 400 }}>
              {asistencias.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datosGrafico}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="fecha" 
                      angle={-45} 
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Horas trabajadas', 
                        angle: -90, 
                        position: 'insideLeft' 
                      }} 
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} horas`, 'Horas trabajadas']}
                      labelFormatter={(label) => `Fecha: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="horas" 
                      name="Horas trabajadas" 
                      fill="#8884d8" 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography align="center" sx={{ mt: 10 }}>
                  No hay datos suficientes para mostrar el gráfico
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default DatosPasante;