import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { user } = useAuth(); // aunque probablemente aquí no se use, sirve si quieres prellenar datos
  const [newUser, setNewUser] = useState({
    id_usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    horario: '',
    rol: 'pasante', // rol fijo
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/registro-pasante', newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { tempPassword } = response.data;
      setSuccess(`Usuario creado exitosamente. Contraseña temporal: ${tempPassword}`);
      setNewUser({ ...newUser, id_usuario: '', nombre: '', apellido: '', email: '' }); // reset campos
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  return (
    <Box sx={{ 
        p: 3, 
        maxWidth: '1200px', 
        mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Registro de Pasante</Typography>
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
            label="Rol"
            value="Pasante"
            disabled
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreateUser}>Crear Usuario</Button>
        </Box>
      </Paper>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
