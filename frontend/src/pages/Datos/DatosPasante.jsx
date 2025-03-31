import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const DatosPasante = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mis Datos Personales
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="body1" paragraph>
          <strong>ID Usuario:</strong> {user?.id_usuario}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Nombre:</strong> {user?.nombre} {user?.apellido}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Email:</strong> {user?.email}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Rol:</strong> {user?.rol}
        </Typography>
      </Paper>
    </Box>
  );
};

export default DatosPasante;