// import React, { useState, useEffect } from 'react';
// import { 
//   Box, Typography, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Paper, Button, TextField, Dialog, 
//   DialogActions, DialogContent, DialogTitle, IconButton,
//   FormControl, InputLabel, Select, MenuItem, Tabs, Tab, Alert
// } from '@mui/material';

// import { Edit, Delete, Add } from '@mui/icons-material';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';

// const Administracion = () => {
//   const [usuarios, setUsuarios] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [currentUsuario, setCurrentUsuario] = useState(null);
//   const [formData, setFormData] = useState({
//     id_usuario: '',
//     nombre: '',
//     apellido: '',
//     email: '',
//     fecha_ingreso: '',
//     rol: 'pasante'
//   });
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user?.rol === 'administrador') {
//       fetchUsuarios();
//     }
//   }, [user]);

//   const fetchUsuarios = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/usuarios');
//       setUsuarios(response.data);
//     } catch (error) {
//       console.error('Error al obtener usuarios:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (currentUsuario) {
//         // Actualizar usuario
//         await axios.put(`http://localhost:5000/api/usuarios/${currentUsuario.id_usuario}`, formData);
//       } else {
//         // Crear nuevo usuario (sin contraseña en este ejemplo)
//         await axios.post('http://localhost:5000/api/usuarios', formData);
//       }
//       fetchUsuarios();
//       handleCloseDialog();
//     } catch (error) {
//       console.error('Error al guardar usuario:', error);
//     }
//   };

//   const handleEdit = (usuario) => {
//     setCurrentUsuario(usuario);
//     setFormData({
//       id_usuario: usuario.id_usuario,
//       nombre: usuario.nombre,
//       apellido: usuario.apellido,
//       email: usuario.email,
//       fecha_ingreso: usuario.fecha_ingreso,
//       rol: usuario.rol
//     });
//     setOpenDialog(true);
//   };

//   const handleDelete = async (id_usuario) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/usuarios/${id_usuario}`);
//       fetchUsuarios();
//     } catch (error) {
//       console.error('Error al eliminar usuario:', error);
//     }
//   };

//   const handleOpenDialog = () => {
//     setCurrentUsuario(null);
//     setFormData({
//       id_usuario: '',
//       nombre: '',
//       apellido: '',
//       email: '',
//       fecha_ingreso: new Date().toISOString().split('T')[0],
//       rol: 'pasante'
//     });
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Administración de Usuarios
//       </Typography>
      
//       <Button 
//         variant="contained" 
//         startIcon={<Add />} 
//         onClick={handleOpenDialog}
//         sx={{ mb: 3 }}
//       >
//         Agregar Usuario
//       </Button>
      
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID Usuario</TableCell>
//               <TableCell>Nombre</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Rol</TableCell>
//               <TableCell>Acciones</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {usuarios.map((usuario) => (
//               <TableRow key={usuario.id_usuario}>
//                 <TableCell>{usuario.id_usuario}</TableCell>
//                 <TableCell>{usuario.nombre} {usuario.apellido}</TableCell>
//                 <TableCell>{usuario.email}</TableCell>
//                 <TableCell>{usuario.rol}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(usuario)} color="primary">
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(usuario.id_usuario)} color="error">
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>{currentUsuario ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
//         <DialogContent>
//           <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//             <TextField
//               margin="normal"
//               name="id_usuario"
//               label="ID Usuario"
//               fullWidth
//               value={formData.id_usuario}
//               onChange={handleInputChange}
//               required
//               disabled={!!currentUsuario}
//             />
//             <TextField
//               margin="normal"
//               name="nombre"
//               label="Nombre"
//               fullWidth
//               value={formData.nombre}
//               onChange={handleInputChange}
//               required
//             />
//             <TextField
//               margin="normal"
//               name="apellido"
//               label="Apellido"
//               fullWidth
//               value={formData.apellido}
//               onChange={handleInputChange}
//               required
//             />
//             <TextField
//               margin="normal"
//               name="email"
//               label="Email"
//               type="email"
//               fullWidth
//               value={formData.email}
//               onChange={handleInputChange}
//               required
//             />
//             <TextField
//               margin="normal"
//               name="fecha_ingreso"
//               label="Fecha de Ingreso"
//               type="date"
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               value={formData.fecha_ingreso}
//               onChange={handleInputChange}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel id="rol-label">Rol</InputLabel>
//               <Select
//                 labelId="rol-label"
//                 name="rol"
//                 value={formData.rol}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <MenuItem value="pasante">Pasante</MenuItem>
//                 <MenuItem value="administrador">Administrador</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancelar</Button>
//           <Button onClick={handleSubmit} color="primary" variant="contained">
//             {currentUsuario ? 'Actualizar' : 'Agregar'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Administracion;


// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Tabs, 
//   Tab, 
//   Paper, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert
// } from '@mui/material';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';

// const Administracion = () => {
//   const [usuarios, setUsuarios] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
//   const [tabValue, setTabValue] = useState(0);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [formData, setFormData] = useState({
//     id_usuario: '',
//     nombre: '',
//     apellido: '',
//     email: '',
//     rol: 'pasante',
//     horario: '08:00 - 17:00'
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const { user } = useAuth();

//   // Cargar lista de usuarios
//   useEffect(() => {
//     // const cargarUsuarios = async () => {
//     //   try {
//     //     const response = await axios.get('/api/usuarios', {
//     //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     //     });
//     //     setUsuarios(response.data);
//     //   } catch (err) {
//     //     setError('Error al cargar usuarios');
//     //   }
//     // };
//     const cargarUsuarios = async () => {
//       if (!user?.rol || !(user.rol === 'administrador' || user.rol === 'superadmin')) return;
      
//       setLoading(true);
//       setError(null);
      
//       try {
//         const response = await axios.get('/api/usuarios', {
//           headers: { 
//             Authorization: `Bearer ${localStorage.getItem('token')}` 
//           }
//         });
        
//         // VERIFICACIÓN ADICIONAL - AQUÍ VA EL CÓDIGO
//         const usuariosValidos = Array.isArray(response.data) && 
//         response.data.every(usuario => 
//           usuario && 
//           typeof usuario.id_usuario === 'string' &&
//           typeof usuario.nombre === 'string' &&
//           typeof usuario.apellido === 'string'
//         );
      
//         if (!usuariosValidos) {
//           console.error('Estructura de usuarios inválida:', response.data);
//           throw new Error('Formato de datos incorrecto');
//         }
      
//       setUsuarios(response.data);
//       console.log('Usuarios cargados:', response.data);
      
//     } catch (err) {
//       console.error('Error al cargar usuarios:', err);
//       setError(err.response?.data?.error || 'Error al cargar usuarios');
//       setUsuarios([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   cargarUsuarios();

//   }, [user?.rol]);

//   // Manejar selección de usuario
//   const handleSeleccionUsuario = (id) => {
//     const usuario = usuarios.find(u => u.id_usuario === id);
//     setUsuarioSeleccionado(usuario);
//   };

//   // Manejar cambios en el formulario
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Crear nuevo usuario
//   const crearUsuario = async () => {
//     try {
//       await axios.post('/api/usuarios', formData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setSuccess('Usuario creado exitosamente');
//       setOpenDialog(false);
//       // Recargar lista
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error al crear usuario');
//     }
//   };

//   // Restablecer contraseña
//   const resetearPassword = async (id) => {
//     if (!window.confirm('¿Restablecer contraseña a valor por defecto?')) return;
    
//     try {
//       await axios.put(`/api/usuarios/${id}/reset-password`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setSuccess('Contraseña restablecida');
//     } catch (err) {
//       setError('Error al restablecer contraseña');
//     }
//   };

//   // Eliminar usuario
//   const eliminarUsuario = async (id) => {
//     if (!window.confirm('¿Eliminar este usuario permanentemente?')) return;
    
//     try {
//       await axios.delete(`/api/usuarios/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setSuccess('Usuario eliminado');
//       // Recargar lista
//     } catch (err) {
//       setError('Error al eliminar usuario');
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>Panel de Administración</Typography>
      
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//       {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

//       <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
//         <Tab label="Gestión de Usuarios" />
//         {user?.rol === 'superadmin' && <Tab label="Configuración Avanzada" />}
//       </Tabs>

//       <Paper sx={{ p: 2, mt: 2 }}>
//         {tabValue === 0 && (
//           <>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//               <Select
//                 value={usuarioSeleccionado?.id_usuario || ''}
//                 onChange={(e) => handleSeleccionUsuario(e.target.value)}
//                 displayEmpty
//                 sx={{ minWidth: 200 }}
//               >
//                 <MenuItem value="">Seleccionar usuario</MenuItem>
//                 {loading ? (
//                   <MenuItem disabled>Cargando usuarios...</MenuItem>
//                 ) : error ? (
//                   <MenuItem disabled>Error al cargar usuarios</MenuItem>
//                 ) : (
//                   usuarios.map((usuario) =>(
//                     <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
//                       {usuario.nombre} {usuario.apellido} ({usuario.id_usuario})
//                     </MenuItem>
//                   ))
//                 )}
//               </Select>
              
//               <Button 
//                 variant="contained" 
//                 onClick={() => setOpenDialog(true)}
//               >
//                 Nuevo Usuario
//               </Button>
//             </Box>

//             {usuarioSeleccionado && (
//               <Box sx={{ mt: 2 }}>
//                 <Typography variant="h6">Información del Usuario</Typography>
//                 <TableContainer>
//                   <Table>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell><strong>Código:</strong></TableCell>
//                         <TableCell>{usuarioSeleccionado.id_usuario}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell><strong>Nombre:</strong></TableCell>
//                         <TableCell>{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell><strong>Email:</strong></TableCell>
//                         <TableCell>{usuarioSeleccionado.email}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell><strong>Rol:</strong></TableCell>
//                         <TableCell>{usuarioSeleccionado.rol}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell><strong>Horario:</strong></TableCell>
//                         <TableCell>{usuarioSeleccionado.horario}</TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>

//                 <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
//                   <Button 
//                     variant="contained" 
//                     color="warning"
//                     onClick={() => resetearPassword(usuarioSeleccionado.id_usuario)}
//                   >
//                     Restablecer Contraseña
//                   </Button>
                  
//                   {user?.rol === 'superadmin' && (
//                     <Button 
//                       variant="contained" 
//                       color="error"
//                       onClick={() => eliminarUsuario(usuarioSeleccionado.id_usuario)}
//                     >
//                       Eliminar Usuario
//                     </Button>
//                   )}
//                 </Box>
//               </Box>
//             )}
//           </>
//         )}
//       </Paper>

//       {/* Diálogo para nuevo usuario */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Crear Nuevo Usuario</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//             <TextField
//               label="Código de Usuario"
//               name="id_usuario"
//               value={formData.id_usuario}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               label="Nombre"
//               name="nombre"
//               value={formData.nombre}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               label="Apellido"
//               name="apellido"
//               value={formData.apellido}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//             <Select
//               label="Rol"
//               name="rol"
//               value={formData.rol}
//               onChange={handleChange}
//               required
//             >
//               <MenuItem value="pasante">Pasante</MenuItem>
//               {user?.rol === 'superadmin' && <MenuItem value="administrador">Administrador</MenuItem>}
//             </Select>
//             <TextField
//               label="Horario"
//               name="horario"
//               value={formData.horario}
//               onChange={handleChange}
//               required
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
//           <Button onClick={crearUsuario} variant="contained">Crear</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Administracion;

// import React, { useState, useEffect } from 'react';
// import { 
//   Box, Typography, Select, MenuItem, Button, 
//   Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Paper, Dialog, 
//   DialogTitle, DialogContent, DialogActions, TextField,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';

// const Administracion = () => {
//   const { user } = useAuth();
//   const [usuarios, setUsuarios] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [newUser, setNewUser] = useState({
//     id_usuario: '',
//     nombre: '',
//     apellido: '',
//     email: '',
//     rol: 'pasante',
//     horario: '08:00-17:00',
//     password: 'Temp1234'
//   });

//   // Cargar usuarios
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:5000/api/usuarios', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         // Verificación robusta de la respuesta
//         if (!response.data || !Array.isArray(response.data)) {
//           throw new Error('Formato de respuesta inválido');
//         }

//         setUsuarios(response.data);
//         setError(null);
//       } catch (err) {
//         console.error('Error al cargar usuarios:', err);
//         setError(err.response?.data?.error || 'Error al cargar usuarios');
//         setUsuarios([]); // Asegurar que es un array vacío
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.rol === 'administrador' || user?.rol === 'superadmin') {
//       fetchUsers();
//     }
//   }, [user]);

//   // Crear nuevo usuario
//   const handleCreateUser = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/usuarios', 
//         newUser,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       if (response.data.success) {
//         // Recargar lista de usuarios
//         const updatedUsers = await axios.get('http://localhost:5000/api/usuarios', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         setUsuarios(updatedUsers.data);
//         setOpenDialog(false);
//         setNewUser({
//           id_usuario: '',
//           nombre: '',
//           apellido: '',
//           email: '',
//           rol: 'pasante',
//           horario: '08:00-17:00',
//           password: 'Temp1234'
//         });
//       }
//     } catch (err) {
//       console.error('Error al crear usuario:', err);
//       setError(err.response?.data?.error || 'Error al crear usuario');
//     }
//   };

//   if (!user || !['administrador', 'superadmin'].includes(user.rol)) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error">
//           No tienes permisos para acceder a esta sección
//         </Alert>
//       </Box>
//     );
//   }

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error">{error}</Alert>
//         <Button 
//           variant="contained" 
//           sx={{ mt: 2 }}
//           onClick={() => window.location.reload()}
//         >
//           Reintentar
//         </Button>
//       </Box>
//     );
//   }

//   const selectedUser = usuarios.find(u => u.id_usuario === selectedUserId);

//   return (
//     <Box sx={{ p: 3, mt: 20 }}>
//       <Typography variant="h4" gutterBottom>Panel de Administración</Typography>

//       <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//         <Select
//           value={selectedUserId}
//           onChange={(e) => setSelectedUserId(e.target.value)}
//           displayEmpty
//           sx={{ minWidth: 300 }}
//         >
//           <MenuItem value="">Seleccionar usuario</MenuItem>
//           {usuarios.map((usuario) => (
//             <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
//               {usuario.nombre} {usuario.apellido} ({usuario.rol})
//             </MenuItem>
//           ))}
//         </Select>

//         <Button 
//           variant="contained" 
//           onClick={() => setOpenDialog(true)}
//           disabled={user.rol !== 'superadmin'}
//         >
//           Nuevo Usuario
//         </Button>
//       </Box>

//       {selectedUser && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Campo</TableCell>
//                 <TableCell>Valor</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {Object.entries(selectedUser).filter(([key]) => key !== 'password').map(([key, value]) => (
//                 <TableRow key={key}>
//                   <TableCell><strong>{key}</strong></TableCell>
//                   <TableCell>{String(value)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Diálogo para nuevo usuario */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Crear Nuevo Usuario</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//             <TextField
//               label="Código de Usuario"
//               value={newUser.id_usuario}
//               onChange={(e) => setNewUser({...newUser, id_usuario: e.target.value})}
//               fullWidth
//             />
//             <TextField
//               label="Nombre"
//               value={newUser.nombre}
//               onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
//               fullWidth
//             />
//             <TextField
//               label="Apellido"
//               value={newUser.apellido}
//               onChange={(e) => setNewUser({...newUser, apellido: e.target.value})}
//               fullWidth
//             />
//             <TextField
//               label="Email"
//               type="email"
//               value={newUser.email}
//               onChange={(e) => setNewUser({...newUser, email: e.target.value})}
//               fullWidth
//             />
//             <Select
//               label="Rol"
//               value={newUser.rol}
//               onChange={(e) => setNewUser({...newUser, rol: e.target.value})}
//               fullWidth
//             >
//               <MenuItem value="pasante">Pasante</MenuItem>
//               {user.rol === 'superadmin' && (
//                 <>
//                   <MenuItem value="administrador">Administrador</MenuItem>
//                   <MenuItem value="superadmin">Super Admin</MenuItem>
//                 </>
//               )}
//             </Select>
//             <TextField
//               label="Horario"
//               value={newUser.horario}
//               onChange={(e) => setNewUser({...newUser, horario: e.target.value})}
//               fullWidth
//             />
//             <TextField
//               label="Contraseña"
//               type="password"
//               value={newUser.password}
//               onChange={(e) => setNewUser({...newUser, password: e.target.value})}
//               fullWidth
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
//           <Button 
//             onClick={handleCreateUser} 
//             variant="contained"
//             disabled={!newUser.id_usuario || !newUser.nombre || !newUser.password}
//           >
//             Crear Usuario
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Administracion;

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Select, MenuItem, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Alert, Snackbar
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Administracion = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    id_usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: 'pasante',
    horario: '08:00-17:00',
    password: 'Temp1234'
  });
  const [resetPassword, setResetPassword] = useState('NuevaPass123');

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

  // Crear nuevo usuario
  const handleCreateUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/usuarios', newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Usuario creado exitosamente');
      setOpenDialog(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Usuario eliminado exitosamente');
      setOpenDeleteDialog(false);
      setSelectedUserId('');
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  // Resetear contraseña
  const handleResetPassword = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/usuarios/${selectedUserId}/reset-password`,
        { newPassword: resetPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Contraseña restablecida exitosamente');
      setOpenResetDialog(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer contraseña');
    }
  };

  const selectedUser = usuarios.find(u => u.id_usuario === selectedUserId);

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
    <Box sx={{ p: 3, mt: 20 }}>
      <Typography variant="h4" gutterBottom>Panel de Administración</Typography>

      {/* Selector de usuarios y botones de acción */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          displayEmpty
          sx={{ minWidth: 300 }}
        >
          <MenuItem value="">Seleccionar usuario</MenuItem>
          {usuarios.map((usuario) => (
            <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
              {usuario.nombre} {usuario.apellido} ({usuario.rol})
            </MenuItem>
          ))}
        </Select>

        {user.rol === 'superadmin' && (
          <Button 
            variant="contained" 
            onClick={() => setOpenDialog(true)}
          >
            Nuevo Usuario
          </Button>
        )}

        {selectedUserId && (
          <>
            <Button 
              variant="contained" 
              color="warning"
              onClick={() => setOpenResetDialog(true)}
            >
              Resetear Contraseña
            </Button>
            
            {user.rol === 'superadmin' && (
              <Button 
                variant="contained" 
                color="error"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Eliminar Usuario
              </Button>
            )}
          </>
        )}
      </Box>

      {/* Detalles del usuario seleccionado */}
      {selectedUser && (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campo</TableCell>
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(selectedUser).filter(([key]) => key !== 'password').map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell><strong>{key}</strong></TableCell>
                  <TableCell>{String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para nuevo usuario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Código de Usuario"
              value={newUser.id_usuario}
              onChange={(e) => setNewUser({...newUser, id_usuario: e.target.value})}
              fullWidth
            />
            <TextField
              label="Nombre"
              value={newUser.nombre}
              onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
              fullWidth
            />
            <TextField
              label="Apellido"
              value={newUser.apellido}
              onChange={(e) => setNewUser({...newUser, apellido: e.target.value})}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              fullWidth
            />
            <Select
              label="Rol"
              value={newUser.rol}
              onChange={(e) => setNewUser({...newUser, rol: e.target.value})}
              fullWidth
            >
              <MenuItem value="pasante">Pasante</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
              {user.rol === 'superadmin' && (
                <MenuItem value="superadmin">Super Admin</MenuItem>
              )}
            </Select>
            <TextField
              label="Horario"
              value={newUser.horario}
              onChange={(e) => setNewUser({...newUser, horario: e.target.value})}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={!newUser.id_usuario || !newUser.nombre || !newUser.password}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para resetear contraseña */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Resetear Contraseña</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Nueva Contraseña"
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Cancelar</Button>
          <Button onClick={handleResetPassword} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para eliminar usuario */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar al usuario {selectedUser?.nombre}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Administracion;