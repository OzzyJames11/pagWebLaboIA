import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, Button,
  TextField, CircularProgress, Alert, Snackbar, Paper, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { formatFullDate, formatTime } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calcularHorasTotales } from '../../utils/asistenciasUtils';
import { exportUserAsCsv } from '../../utils/exportCsv';



const Administracion = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    id_usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: 'pasante',
    horario: ''
  });
  const [resetPassword, setResetPassword] = useState('');
  
  // Estado nuevo
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [mainTab, setMainTab] = useState(0); // 0=Ver Usuario, 1=Crear Usuario
  const selectedUser = usuarios.find(u => u.id_usuario === selectedUserId);
  
  const [editMode, setEditMode] = useState(false);
  
  // === Estado para asistencias del usuario seleccionado ===
  const [asistenciasUsuario, setAsistenciasUsuario] = useState([]);
  const [tabAsistencias, setTabAsistencias] = useState(0);
  const [filtroAsistencias, setFiltroAsistencias] = useState('semana');
  const [fechaInicioAsist, setFechaInicioAsist] = useState('');
  const [fechaFinAsist, setFechaFinAsist] = useState('');
  const [loadingAsistencias, setLoadingAsistencias] = useState(false);
  const [errorAsistencias, setErrorAsistencias] = useState(null);
  
  // === Cargar asistencias del usuario seleccionado ===
  useEffect(() => {
    const cargarAsistenciasUsuario = async () => {
      if (!selectedUserId) return;
      setLoadingAsistencias(true);
      try {
        const params = { 
          filtro: filtroAsistencias,
          ...(filtroAsistencias === 'rango' && { fechaInicio: fechaInicioAsist, fechaFin: fechaFinAsist })
        };
        const response = await axios.get(`http://localhost:5000/api/usuarios/${selectedUserId}/asistencias`, {
          params,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAsistenciasUsuario(response.data || []);
      } catch (err) {
        setErrorAsistencias(err.response?.data?.error || 'Error al cargar asistencias');
      } finally {
        setLoadingAsistencias(false);
      }
    };
    cargarAsistenciasUsuario();
  }, [selectedUserId, filtroAsistencias, fechaInicioAsist, fechaFinAsist]);
  
  // Calcular horas totales
  const { horasEnteras, minutos } = calcularHorasTotales(asistenciasUsuario);
  
  
  // Cuando seleccionas un usuario, clona sus datos para edición
  useEffect(() => {
    if (selectedUser) {
      setEditableUser({ ...selectedUser });
      setIsEditing(false); // al cambiar de usuario, se bloquea edición
    }
  }, [selectedUser]);

    // Manejar cambios en inputs
  const handleChange = (field, value) => {
    setEditableUser(prev => ({ ...prev, [field]: value }));
  };

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/usuarios', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsuarios(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.rol === 'administrador' || user?.rol === 'superadmin') {
      loadUsers();
    }
  }, [user]);

  

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/usuarios/${selectedUserId}`, selectedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Usuario actualizado correctamente');
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Usuario eliminado exitosamente');
      setSelectedUserId('');
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!selectedUserId) return;

      const response = await axios.post(
        `http://localhost:5000/api/usuarios/${selectedUserId}/reset-password`,
        {}, // no necesitas enviar nada, el backend genera la contraseña
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      const { tempPassword } = response.data;
      setSuccess(`Contraseña restablecida exitosamente. Nueva contraseña: ${tempPassword}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer contraseña');
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios', newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { tempPassword } = response.data;

      // Mostrar mensaje de éxito con la contraseña generada
      setSuccess(`Usuario creado exitosamente. Contraseña temporal: ${tempPassword}`);

      // Recargar lista de usuarios sin limpiar el formulario
      loadUsers();

      // Opcional: puedes actualizar el objeto newUser con la contraseña generada para mostrarla
      setNewUser(prev => ({ ...prev, password: tempPassword }));

      // No cambiamos de tab ni reseteamos el formulario
      // setMainTab(0); // <-- eliminamos esto
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  if (!user || !['administrador', 'superadmin'].includes(user.rol)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">No tienes permisos para acceder a esta sección</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }



















  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: '1200px', 
      mx: 'auto',
      // backgroundColor: 'background.paper'
    }}>
      <Typography variant="h4" gutterBottom>Administración de Pasantes</Typography>

      {/* Pestañas principales */}
      <Box sx={{ mb: 2 }}>
        <Tabs value={mainTab} onChange={(e, val) => setMainTab(val)} TabIndicatorProps={{ style: { backgroundColor: '#9B2EF4' } }}>
          <Tab label="Ver Usuario" sx={{ '&.Mui-selected': { color: '#9B2EF4' } }} />
          <Tab label="Crear Usuario" sx={{ '&.Mui-selected': { color: '#9B2EF4' } }} />
        </Tabs>
      </Box>

      {mainTab === 0 && (
        <>

        {/* Selector de usuario */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <Select
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              if (!e.target.value) setEditableUser(null); // si selecciona "Seleccionar usuario", limpia panel
            }}
            displayEmpty
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="">Seleccionar usuario</MenuItem>
            {usuarios.map(u => (
              <MenuItem key={u.id_usuario} value={u.id_usuario}>
                {u.nombre} {u.apellido} ({u.rol})
              </MenuItem>
            ))}
          </Select>
          {selectedUserId && (
            <>
              <Button variant="contained" color="warning" onClick={() => handleResetPassword('')}>
                Resetear Contraseña
              </Button>
              {user.rol === 'superadmin' && (
                <Button variant="contained" color="error" onClick={handleDeleteUser}>
                  Eliminar Usuario
                </Button>
              )}
            </>
          )}

        </Box> 

        {/* Información del usuario seleccionado */}
  {editableUser && (
    <Paper elevation={3} sx={{ p: 3, mb: 3, position: "relative" }}>
      <Typography variant="h6" gutterBottom>Datos del Usuario</Typography>

      {/* Botón Editar/Cancelar en esquina superior derecha */}
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        {!isEditing ? (
          <Button variant="outlined" onClick={() => setIsEditing(true)}>Editar</Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setEditableUser({ ...selectedUser }); // restaurar datos originales
              setIsEditing(false);
            }}
          >
            Cancelar
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          label="Código"
          value={editableUser.id_usuario}
          fullWidth
          disabled={!isEditing}
          onChange={(e) => handleChange("id_usuario", e.target.value)}
        />
        <TextField
          label="Nombre"
          value={editableUser.nombre}
          fullWidth
          disabled={!isEditing}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />
        <TextField
          label="Apellido"
          value={editableUser.apellido}
          fullWidth
          disabled={!isEditing}
          onChange={(e) => handleChange("apellido", e.target.value)}
        />
        <TextField
          label="Email"
          value={editableUser.email}
          fullWidth
          disabled={!isEditing}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* Campo Horario */}
        <TextField
          label="Horario"
          value={editableUser.horario || ''}
          fullWidth
          disabled={!isEditing}
          onChange={(e) => handleChange("horario", e.target.value)}
          multiline
          minRows={isEditing ? 4 : 1} // más grande cuando edites
          InputProps={{
            readOnly: !isEditing,
          }}
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: 'inherit', // mantiene el color del texto en modo disabled
              whiteSpace: 'pre-line',         // respeta los saltos de línea
            },
          }}
        />

        <TextField
          label="Rol"
          value={editableUser.rol}
          fullWidth
          disabled={!isEditing}
          onChange={(e) => handleChange("rol", e.target.value)}
        />
      </Box>

      {/* Guardar cambios solo si está en edición */}
      {isEditing && (
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              try {
                await axios.put(`http://localhost:5000/api/usuarios/${editableUser.id_usuario}`, editableUser, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSuccess('Usuario actualizado correctamente');
                setIsEditing(false);
                loadUsers();
              } catch (err) {
                setError(err.response?.data?.error || 'Error al actualizar usuario');
              }
            }}
          >
            Guardar Cambios
          </Button>
        </Box>
      )}
    </ Paper>
  )}

    <Paper elevation={3} sx={{ p : 1, pb : 2 }}>

    {/* Último ingreso */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Último Ingreso:</Typography>
          {asistenciasUsuario.length > 0 ? (() => {
            const ultimo = [...asistenciasUsuario].sort((a,b)=>new Date(b.hora_entrada)-new Date(a.hora_entrada))[0];
            return (
              <>
                <Typography> <strong>Fecha:</strong> {formatFullDate(ultimo.hora_entrada)}</Typography>
                <Typography><strong>Hora Entrada:</strong> {formatTime(ultimo.hora_entrada)}</Typography>
                {ultimo.hora_salida && <Typography><strong>Hora Salida:</strong> {formatTime(ultimo.hora_salida)}</Typography>}
                <Typography><strong>Duración:</strong> {(
                                    (new Date(ultimo.hora_salida) - new Date(ultimo.hora_entrada)) / (1000 * 60 * 60)
                                  ).toFixed(2)} horas</Typography>
              </>
            )
          })() : <Typography>No hay registros</Typography>}
        </Box>
            </Paper>

            {/* Futura descarga de reporte */}
                  <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
                    <Typography fontSize={20}><strong>Horas acumuladas totales:</strong> {horasEnteras} horas y {minutos} minutos</Typography>
                  </Paper>

{/* ===========================
         BLOQUE DE REGISTRO DE ASISTENCIAS
       =========================== */}
    {selectedUserId && (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mt : 4 }}>
          <Typography variant="h5" gutterBottom>Registro de Asistencias</Typography>

          {/* Filtros */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              select
              label="Filtrar por"
              value={filtroAsistencias}
              onChange={(e) => setFiltroAsistencias(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="semana">Semana actual</MenuItem>
              <MenuItem value="mes">Mes actual</MenuItem>
              <MenuItem value="semestre">Último semestre</MenuItem>
              <MenuItem value="rango">Rango personalizado</MenuItem>
            </TextField>

            {filtroAsistencias === 'rango' && (
              <>
                <TextField label="Fecha inicio" type="date" InputLabelProps={{ shrink: true }} value={fechaInicioAsist} onChange={(e) => setFechaInicioAsist(e.target.value)} />
                <TextField label="Fecha fin" type="date" InputLabelProps={{ shrink: true }} value={fechaFinAsist} onChange={(e) => setFechaFinAsist(e.target.value)} />
              </>
            )}
          </Box>

          {/* Pestañas Tabla / Gráfico */}
          <Tabs value={tabAsistencias} onChange={(e,val)=>setTabAsistencias(val)} sx={{ mb: 2 }} TabIndicatorProps={{
              style: { backgroundColor: '#9B2EF4' } 
            }}>
            <Tab label="Tabla" sx={{'&.Mui-selected': { color: '#9B2EF4' }}}/>
            <Tab label="Gráfico" sx={{'&.Mui-selected': { color: '#9B2EF4' }}}/>
          </Tabs>

          {/* Contenido según pestaña */}
          {loadingAsistencias ? (
            <Box sx={{ display:'flex', justifyContent:'center', p : 4 }}><CircularProgress /></Box>
          ) : tabAsistencias === 0 ? (
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
                  {asistenciasUsuario.length > 0 ? asistenciasUsuario.map(reg => (
                    <TableRow key={reg.id_registro}>
                      <TableCell align="center">{formatFullDate(reg.hora_entrada)}</TableCell>
                      <TableCell align="center">{formatTime(reg.hora_entrada)}</TableCell>
                      <TableCell align="center">{reg.hora_salida ? formatTime(reg.hora_salida) : '--'}</TableCell>
                      <TableCell align="center">{reg.hora_salida ? ((new Date(reg.hora_salida)-new Date(reg.hora_entrada))/(1000*60*60)).toFixed(2) : '--'}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No hay registros</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ height: 400, overflow: 'hidden' }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={[...asistenciasUsuario]
        .map(reg => ({
          diaNumero: new Date(reg.hora_entrada).getDate(),
          fecha: reg.hora_entrada,
          horas: reg.hora_salida
            ? (new Date(reg.hora_salida) - new Date(reg.hora_entrada)) / (1000 * 60 * 60)
            : 0
        }))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))} // 🔹 Ordenar por fecha
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="diaNumero"
        label={{ value: "Día del mes", position: "bottom", dx: -30, dy: -30, style: { fontFamily: "Poppins", fontSize: 18 } }}
        height={55}
        tick={{ style: { fontFamily: "Poppins", fontSize: 17 } }}
      />
      <YAxis
        label={{
          value: "Cantidad de horas",
          angle: -90,
          position: "outsideLeft",
          dx: -20,
          style: { fontFamily: "Poppins", fontSize: 18 }
        }}
        tick={{ style: { fontFamily: "Poppins", fontSize: 17 } }}
      />
      <Tooltip
        content={({ payload }) => {
          if (payload && payload.length) {
            const data = payload[0].payload;
            return (
              <div
                style={{
                  backgroundColor: "#fff",
                  color: "#9B2EF4",
                  padding: "5px",
                  border: "1px solid #8604f7ff",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  borderRadius: 5,
                }}
              >
                <div><strong>Fecha:</strong> {formatFullDate(data.fecha)}</div>
                <div><strong>Horas trabajadas:</strong> {data.horas.toFixed(2)}</div>
              </div>
            );
          }
          return null;
        }}
      />
      <Legend wrapperStyle={{ fontFamily: "Poppins", fontSize: 18 }}/>
      <Bar 
        dataKey="horas" 
        name="Horas trabajadas por día" 
        fill="#8884d8" 
        barSize={20}
      />
    </BarChart>
  </ResponsiveContainer>
</Box>

          )}

          <Box sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => exportUserAsCsv(editableUser, asistenciasUsuario)} 
              disabled={loadingAsistencias || asistenciasUsuario.length === 0}
              >
                Descargar informe CSV
            </Button>
          </Box>
        </Paper>
      </Box>
    )}

  
</>
)}

{mainTab === 1 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Crear Nuevo Usuario</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Código Único"
              placeholder="Ej: 202521932"
              value={newUser.id_usuario}
              onChange={(e) => setNewUser({ ...newUser, id_usuario: e.target.value })}
            />
            <TextField
              label="Nombre"
              placeholder="Ej: James"
              value={newUser.nombre}
              onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
            />
            <TextField
              label="Apellido"
              placeholder="Ej: Hetfield"
              value={newUser.apellido}
              onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })}
            />
            <TextField
              label="Email"
              placeholder="Ej: james.hetfield@epn.edu.ec"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              label="Horario"
              placeholder={`Lunes: 09:00-11:00\nMartes: 14:00-16:00\nMiércoles: 10:00-13:00`}
              value={newUser.horario}
              onChange={(e) => setNewUser({ ...newUser, horario: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              select
              label="Rol"
              value={newUser.rol}
              fullWidth
              onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
            >
              <MenuItem value="pasante">Pasante</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
            </TextField>

          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateUser}>Crear Usuario</Button>
          </Box>
        </Paper>
      )}


      {/* Notificaciones */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Administracion;
