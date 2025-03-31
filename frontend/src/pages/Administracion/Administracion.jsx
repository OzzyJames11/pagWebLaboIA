import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, Dialog, 
  DialogActions, DialogContent, DialogTitle, IconButton,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Administracion = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [formData, setFormData] = useState({
    id_usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    fecha_ingreso: '',
    rol: 'pasante'
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user?.rol === 'administrador') {
      fetchUsuarios();
    }
  }, [user]);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUsuario) {
        // Actualizar usuario
        await axios.put(`http://localhost:5000/api/usuarios/${currentUsuario.id_usuario}`, formData);
      } else {
        // Crear nuevo usuario (sin contraseña en este ejemplo)
        await axios.post('http://localhost:5000/api/usuarios', formData);
      }
      fetchUsuarios();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const handleEdit = (usuario) => {
    setCurrentUsuario(usuario);
    setFormData({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      fecha_ingreso: usuario.fecha_ingreso,
      rol: usuario.rol
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id_usuario) => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${id_usuario}`);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleOpenDialog = () => {
    setCurrentUsuario(null);
    setFormData({
      id_usuario: '',
      nombre: '',
      apellido: '',
      email: '',
      fecha_ingreso: new Date().toISOString().split('T')[0],
      rol: 'pasante'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administración de Usuarios
      </Typography>
      
      <Button 
        variant="contained" 
        startIcon={<Add />} 
        onClick={handleOpenDialog}
        sx={{ mb: 3 }}
      >
        Agregar Usuario
      </Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id_usuario}>
                <TableCell>{usuario.id_usuario}</TableCell>
                <TableCell>{usuario.nombre} {usuario.apellido}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.rol}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(usuario)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(usuario.id_usuario)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{currentUsuario ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              name="id_usuario"
              label="ID Usuario"
              fullWidth
              value={formData.id_usuario}
              onChange={handleInputChange}
              required
              disabled={!!currentUsuario}
            />
            <TextField
              margin="normal"
              name="nombre"
              label="Nombre"
              fullWidth
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              name="apellido"
              label="Apellido"
              fullWidth
              value={formData.apellido}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              name="fecha_ingreso"
              label="Fecha de Ingreso"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.fecha_ingreso}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="pasante">Pasante</MenuItem>
                <MenuItem value="administrador">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {currentUsuario ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Administracion;