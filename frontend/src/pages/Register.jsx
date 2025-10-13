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

  // const handleCreateUser = async () => {
  //   try {
  //     // Trim de todos los campos de texto
  //     const codigo = newUser.id_usuario.trim();
  //     const nombre = newUser.nombre.trim();
  //     const apellido = newUser.apellido.trim();
  //     const email = newUser.email.trim();
  //     const horario = newUser.horario.trim();

  //     // Validación Código Único
  //     if (!codigo || !/^\d{1,9}$/.test(codigo)) {
  //       setError('Código Único inválido. Debe contener solo números y máximo 9 dígitos.');
  //       return;
  //     }

  //     // Validación Nombre
  //     if (!nombre || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,30}$/.test(nombre)) {
  //       setError('Nombre inválido. Solo letras y máximo 30 caracteres.');
  //       return;
  //     }

  //     // Validación Apellido
  //     if (!apellido || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,30}$/.test(apellido)) {
  //       setError('Apellido inválido. Solo letras y máximo 30 caracteres.');
  //       return;
  //     }

  //     // Validación Email
  //     if (!email || !/^[A-Za-z0-9._%+-]+@epn\.edu\.ec$/.test(email)) {
  //       setError('Email inválido. Debe tener el dominio @epn.edu.ec');
  //       return;
  //     }

  //     const response = await axios.post('http://localhost:5000/api/registro-pasante', { ...newUser, id_usuario: codigo, nombre, apellido, email, horario }, 
  //       {headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  //     });

  //     const { tempPassword } = response.data;
  //     setSuccess(`Usuario creado exitosamente. Contraseña temporal: ${tempPassword}`);
  //     // setNewUser({ ...newUser, id_usuario: '', nombre: '', apellido: '', email: '' }); // reset campos
  //     setNewUser({ id_usuario: '', nombre: '', apellido: '', email: '', horario: '', rol: 'pasante'  }); 
  //   } catch (err) {
  //     setError(err.response?.data?.error || 'Error al crear usuario');
  //   }
  // };


const handleCreateUser = async () => {
    try {
      // === Validaciones previas ===
      const trimmedUser = {
        id_usuario: newUser.id_usuario.trim(),
        nombre: newUser.nombre.trim(),
        apellido: newUser.apellido.trim(),
        email: newUser.email.trim(),
        rol: newUser.rol.trim(),
        horario: newUser.horario.trim(),
      };

      // === Validaciones ===
      // Código único: obligatorio, solo números, máximo 9 dígitos
      if (!trimmedUser.id_usuario) return setError("El Código Único es obligatorio.");
      if (!/^\d{9}$/.test(trimmedUser.id_usuario)) return setError('El Código Único debe contener solo números y deben ser 9 dígitos.');
      
      // Nombre: obligatorio, solo letras, máximo 30 caracteres
      if (!trimmedUser.nombre) return setError("El Nombre es obligatorio.");
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(trimmedUser.nombre)) return setError('El Nombre solo puede contener letras.');
      if (trimmedUser.nombre.length > 30) return setError('El Nombre no puede superar 30 caracteres.');

      // Apellido: obligatorio, solo letras, máximo 30 caracteres
      if (!trimmedUser.apellido) return setError("El apellido es obligatorio.");
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(trimmedUser.apellido)) return setError('El Apellido solo puede contener letras.');
      if (trimmedUser.apellido.length > 30) return setError('El Apellido no puede superar 30 caracteres.');

      // Correo: obligatorio, debe terminar en @epn.edu.ec
      if (!trimmedUser.email) return setError("El Correo es obligatorio.");
      if (!/^[\w.-]+@epn\.edu\.ec$/.test(trimmedUser.email)) return setError('El Correo debe tener dominio @epn.edu.ec.');
      
      // Rol: obligatorio y debe ser 'pasante' o 'administrador'
      if (!trimmedUser.rol) return setError("El Rol es obligatorio.");
      
      const response = await axios.post('http://localhost:5000/api/registro-pasante', trimmedUser, {
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









  return (
    <Box sx={{ 
        p: 3, 
        maxWidth: '1200px', 
        mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Registro de Pasante</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Código Único*"
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
            label="Correo Institucional"
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
