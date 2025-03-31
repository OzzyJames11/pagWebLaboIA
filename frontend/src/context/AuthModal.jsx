// import React, { useState } from 'react';
// import { Box, Modal, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
// import axios from 'axios';

// const AuthModal = ({ open, onClose, onLoginSuccess }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     nombre: '',
//     rol: 'pasante' // valor por defecto
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const endpoint = isLogin ? '/api/login' : '/api/register';
//       const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
//       if (response.data.success) {
//         onLoginSuccess(response.data.user);
//         onClose();
//       }
//     } catch (error) {
//       console.error('Error:', error.response?.data?.message || 'Error desconocido');
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: 400,
//         bgcolor: 'background.paper',
//         boxShadow: 24,
//         p: 4,
//         borderRadius: 2
//       }}>
//         <Typography variant="h6" mb={2}>
//           {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
//         </Typography>
        
//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <>
//               <TextField
//                 fullWidth
//                 label="Nombre"
//                 name="nombre"
//                 value={formData.nombre}
//                 onChange={handleChange}
//                 margin="normal"
//                 required
//               />
//               <Select
//                 fullWidth
//                 name="rol"
//                 value={formData.rol}
//                 onChange={handleChange}
//                 margin="dense"
//                 required
//                 sx={{ mt: 2, mb: 2 }}
//               >
//                 <MenuItem value="pasante">Pasante</MenuItem>
//                 <MenuItem value="admin">Administrador</MenuItem>
//               </Select>
//             </>
//           )}
          
//           <TextField
//             fullWidth
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />
          
//           <TextField
//             fullWidth
//             label="Contraseña"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />
          
//           <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
//             <Button type="submit" variant="contained" color="primary">
//               {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
//             </Button>
            
//             <Button 
//               onClick={() => setIsLogin(!isLogin)} 
//               color="secondary"
//             >
//               {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
//             </Button>
//           </Box>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default AuthModal;

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
      
      if (response.data.success) {
        await login(response.data.user, response.data.token);
        onClose();
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error al iniciar sesión');
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