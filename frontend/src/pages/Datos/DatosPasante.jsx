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
  MenuItem, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { formatFullDate, formatTime } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calcularHorasTotales } from '../../utils/asistenciasUtils';
import { exportUserAsCsv } from '../../utils/exportCsv';

const DatosPasante = () => {
  const { user, ultimoRegistro } = useAuth();
  const [asistencias, setAsistencias] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [filtro, setFiltro] = useState('semana');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const { horasEnteras, minutos } = calcularHorasTotales(asistencias);

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
        //log
        console.log('DEBUG - user object (from useAuth):', user);
        // imprime el user en forma legible:
        try {
          console.log('DEBUG - user (string):', JSON.stringify(user, null, 2));
        } catch (e) { /* ignore circular */ }

        // imprime las primeras 5 asistencias (o [] si no hay)
        console.log('DEBUG - asistencias recibidas (primeras 5):', response.data ? response.data.slice(0,5) : []);
        try {
          console.log('DEBUG - asistencias (string):', JSON.stringify((response.data || []).slice(0,5), null, 2));
        } catch (e) { /* ignore circular */ }


        
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
  // const datosGrafico = asistencias.map(reg => ({
  //   fecha: new Date(reg.hora_entrada).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
  //   horas: reg.hora_salida 
  //     ? ((new Date(reg.hora_salida) - new Date(reg.hora_entrada)) / (1000 * 60 * 60))
  //     : 0,
  //   entrada: formatTime(reg.hora_entrada),
  //   salida: reg.hora_salida ? formatTime(reg.hora_salida) : '--'
  // }));
  const datosGrafico = asistencias
  .map(reg => ({
    fecha: new Date(reg.hora_entrada),
    fechaTexto: new Date(reg.hora_entrada).toLocaleDateString('es-ES', { 
      // day: 'numeric', 
      // month: 'short',
      // year: '2-digit'
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    }),
    diaNumero: new Date(reg.hora_entrada).getDate(),
    horas: reg.hora_salida 
      ? ((new Date(reg.hora_salida) - new Date(reg.hora_entrada)) / (1000 * 60 * 60)) : 0,
    entrada: formatTime(reg.hora_entrada),
    salida: reg.hora_salida ? formatTime(reg.hora_salida) : '--'
  }))
  .sort((a, b) => a.fecha - b.fecha); // Ordenamos cronológicamente

  // === FUNCIONES MODAL CAMBIO DE CONTRASEÑA ===
  const handleOpenPasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => setOpenPasswordModal(false);

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/usuarios/${user.id_usuario}/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPasswordSuccess('Contraseña cambiada correctamente');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Error al cambiar la contraseña');
    }
  };

  return (
    <Box sx={{ 
      // display: 'flex',
      // flexDirection: 'column',
      p: 3,
      maxWidth: '1200px', 
      mx: 'auto',
      // backgroundColor: 'background.paper'
      }}>

      <Typography variant="h4" gutterBottom>Información General</Typography>
      
      <Grid container spacing={3}>
        {/* Columna izquierda - Datos personales */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2/*, height: '100%'*/ }}>
            <Typography variant="h6" gutterBottom>Datos Personales</Typography>
            <Typography><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</Typography>
            <Typography><strong>Rol:</strong> {user?.rol}</Typography>
            <Typography><strong>Código Único:</strong> {user?.id_usuario}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleOpenPasswordModal}>Cambiar Contraseña</Button>
              </Box>
          </Paper>
        </Grid>
        
        {/* Columna derecha - Horario */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2/*, height: '100%' */}}>
            <Typography variant="h6" gutterBottom>Horario</Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {user?.horario}
            </Typography>
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
              <Typography><strong>Hora Entrada:</strong> {formatTime(ultimoRegistro.hora_entrada)}</Typography>
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

      {/* Futura descarga de reporte */}
      <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
        <Typography fontSize={20}><strong>Horas acumuladas totales:</strong> {horasEnteras} horas y {minutos} minutos</Typography>
      </Paper>

      {/* === MODAL CAMBIO DE CONTRASEÑA === */}
      <Dialog open={openPasswordModal} onClose={handleClosePasswordModal}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            label="Contraseña actual"
            type="password"
            fullWidth
            margin="dense"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="Nueva contraseña"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {passwordError && <Typography color="error" sx={{ mt: 1 }}>{passwordError}</Typography>}
          {passwordSuccess && <Typography color="success.main" sx={{ mt: 1 }}>{passwordSuccess}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleChangePassword}>Guardar</Button>
        </DialogActions>
      </Dialog>


      {/* Registro de Asistencias */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        mt: 3,
        position: 'relative',
        zIndex: 0,
        minHeight: 300 // Altura mínima garantizada

      }}>
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h5" gutterBottom>Registro de Asistencias</Typography>
          
          {/* Pestañas Tabla/Gráfico */}
          <Box sx={{ mb: 2 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} TabIndicatorProps={{
              style: { backgroundColor: '#9B2EF4' } 
            }}>
              <Tab label="Tabla" sx={{'&.Mui-selected': { color: '#9B2EF4' }}} />
              <Tab label="Gráfico" sx={{'&.Mui-selected': { color: '#9B2EF4' }}} />
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
            // <Typography>Cargando datos...</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : tabValue === 0 ? (
            // Vista de tabla
            <TableContainer sx={{ maxHeight: 500, overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Fecha</TableCell>
                    <TableCell align="center">Hora Entrada</TableCell>
                    <TableCell align="center">Hora Salida</TableCell>
                    <TableCell align="center">Horas trabajadas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asistencias.length > 0 ? (
                    asistencias.map((registro) => (
                      <TableRow key={registro.id_registro}>
                        <TableCell align="center">{formatFullDate(registro.hora_entrada)}</TableCell>
                        <TableCell align="center">{formatTime(registro.hora_entrada)}</TableCell>
                        <TableCell align="center">
                          {registro.hora_salida ? formatTime(registro.hora_salida) : '--'}
                        </TableCell>
                        <TableCell align="center">
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
            <Box sx={{ height: 500, overflow: 'hidden' }}>
              {asistencias.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datosGrafico}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="diaNumero" 
                      label={{ value: "Día del mes", position: "bottom", dx: -30, dy: -30, style: { fontFamily: "Poppins", fontSize: 18 } }}
                      angle={0} 
                      textAnchor="middle"
                      height={55}
                      tick={{ style: { fontFamily: "Poppins", fontSize: 17 } }}

                    />
                    <YAxis 
                      label={{ 
                        value: 'Cantidad de horas', 
                        angle: -90, 
                        position: 'outsideLeft',
                        dx: -20,
                        dy: 0,
                        style: { fontFamily: "Poppins", fontSize: 18 }
                      }} 
                      tick={{ style: { fontFamily: "Poppins", fontSize: 17 } }}
                    />
                    <Tooltip content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div style={{ 
                            backgroundColor: '#ffffffff', 
                            color: '#9B2EF4', 
                            padding: '5px', 
                            border: '1px solid #8604f7ff',
                            fontFamily: "Poppins",
                            fontSize: 14,
                            borderRadius: 5, 
                        }}>   
                            <div><strong>Fecha:</strong> {formatFullDate(data.fecha)}</div>
                            <div><strong>Horas trabajadas:</strong> {data.horas.toFixed(2)}</div>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend wrapperStyle={{ fontFamily: "Poppins", fontSize: 18 }}/>
                    <Bar 
                      dataKey="horas" 
                      name="Horas trabajadas por día" 
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

          <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => exportUserAsCsv(user, asistencias)} disabled={asistencias.length === 0}>Descargar informe CSV</Button>
              </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DatosPasante;