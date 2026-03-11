import React, { useState } from 'react';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AuthModal = ({ open, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    id_usuario: '',
    password: ''
  });
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        id_usuario: formData.id_usuario,
        password: formData.password
      });
      
      if (response.data && response.data.success) {
        await login(response.data.user, response.data.token);
        onClose();
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error en login:', error);
      // Mostrar error solo si realmente falló
      if (error.response?.status === 400 || error.response?.status === 401) {
        alert(error.response?.data?.message || 'Credenciales incorrectas');
      } else {
        alert('Error al conectar con el servidor');
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h6" mb={2}>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="ID de Usuario"
            name="id_usuario"
            value={formData.id_usuario}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Iniciar Sesión
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AuthModal;