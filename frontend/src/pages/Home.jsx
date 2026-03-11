import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Alert } from '@mui/material';
import Header from '../components/Header/Header';
import imagenHome from '../assets/img/BannerLaboIA.png';
import '../assets/css/Home.css';
import AuthModal from '../context/AuthModal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Funciones de formato de fecha
const formatFullDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const esMismoDia = (fechaString) => {
  if (!fechaString) return false;
  const hoy = new Date();
  const fecha = new Date(fechaString);
  return hoy.getFullYear() === fecha.getFullYear() &&
         hoy.getMonth() === fecha.getMonth() &&
         hoy.getDate() === fecha.getDate();
};

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ultimoRegistro, setUltimoRegistro] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Estados para reglas de negocio
  const [labConfig, setLabConfig] = useState({ HORA_APERTURA: '09:00', HORA_CIERRE: '18:00', MINUTOS_MINIMOS: 10 });
  const [isWorkingHours, setIsWorkingHours] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(null);

  // 1. Obtener configuración del servidor
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/config');
        setLabConfig(res.data);
      } catch (error) {
        console.error("No se pudo cargar labConfig, usando valores por defecto.");
      }
    };
    fetchConfig();
  }, []);

  // 2. Verificar el horario en tiempo real para bloquear/desbloquear botones
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setIsWorkingHours(timeString >= labConfig.HORA_APERTURA && timeString <= labConfig.HORA_CIERRE);
    };
    
    checkTime(); 
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, [labConfig]);

  const cargarUltimoRegistro = async () => {
    if (!isAuthenticated || !user?.id_usuario) return;
    
    try {
      const response = await axios.get('http://localhost:5000/api/mis-asistencias', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.length > 0) {
        setUltimoRegistro(response.data[0]);
      } else {
        setUltimoRegistro(null);
      }
    } catch (error) {
      console.error('Error al cargar registro:', error);
      setUltimoRegistro(null);
    }
  };

  useEffect(() => {
    cargarUltimoRegistro();
  }, [isAuthenticated, user?.id_usuario]);
  
  // Determinar si hay un turno activo HOY (restaurado)
  const tieneTurnoActivo = ultimoRegistro && !ultimoRegistro.hora_salida && esMismoDia(ultimoRegistro.hora_entrada);

  // 3. Lógica del contador regresivo para el tiempo mínimo
  useEffect(() => {
    if (tieneTurnoActivo && ultimoRegistro?.hora_entrada && labConfig?.MINUTOS_MINIMOS) {
      
      const calcularTiempo = () => {
        const ahora = new Date();
        const entrada = new Date(ultimoRegistro.hora_entrada); 
        
        const tiempoMinimoMs = labConfig.MINUTOS_MINIMOS * 60 * 1000;
        const tiempoObjetivo = new Date(entrada.getTime() + tiempoMinimoMs);

        const diferenciaMs = tiempoObjetivo - ahora;

        if (diferenciaMs <= 0) {
          setTiempoRestante(null); 
        } else {
          const min = Math.floor(diferenciaMs / 60000);
          const sec = Math.floor((diferenciaMs % 60000) / 1000);
          setTiempoRestante(`${min}:${sec.toString().padStart(2, '0')}`);
        }
      };

      calcularTiempo(); 
      const interval = setInterval(calcularTiempo, 1000); 

      return () => clearInterval(interval); 
    } else {
      setTiempoRestante(null);
    }
  }, [tieneTurnoActivo, ultimoRegistro, labConfig]);

  const registrarEntrada = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/registrar-entrada',
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert(response.data.message); // <-- ¡Alert RESTAURADO aquí!
      await cargarUltimoRegistro();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar entrada');
    }
  };

  const handleRegistrarSalidaClick = () => {
    if (!ultimoRegistro) return;
    
    // Si el contador sigue activo (tiempoRestante no es null), abrimos confirmación
    if (tiempoRestante) {
      setConfirmDeleteOpen(true); 
    } else {
      registrarSalidaNormal(); 
    }
  };

  const registrarSalidaNormal = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/registrar-salida', 
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert(response.data.message); // <-- Confirmación de salida exitosa
      await cargarUltimoRegistro();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar salida');
    }
  };

  const handleConfirmarEliminacion = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cancelar-entrada', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setConfirmDeleteOpen(false); 
      await cargarUltimoRegistro(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Error al anular el registro');
    }
  };

  return (
    <div className="home">
      <div className="background-image">
        <img src={imagenHome} alt="Background" className="background-img" />
        <div className="overlay"></div>
      </div>

      <Box sx={{ textAlign: 'left', mt: 0, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant='h6' textAlign={'left'} fontWeight={"bold"} fontSize={25} mt={2}>Registro de Pasantes</Typography>
      </Box>

      {isAuthenticated ? (
        <Box sx={{ textAlign: 'left', mt: 0, maxWidth: '1200px', mx: 'auto' }}>
          <Typography variant="h5">¡Bienvenido {user.nombre}!</Typography>
          
          {ultimoRegistro && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <Typography variant="h6" fontWeight="bold">Último Ingreso</Typography>
              <Typography>Fecha: {formatFullDate(ultimoRegistro.hora_entrada)}</Typography>
              <Typography>Hora entrada: {formatTime(ultimoRegistro.hora_entrada)}</Typography>
              {ultimoRegistro.hora_salida && (
                <Typography>Hora salida: {formatTime(ultimoRegistro.hora_salida)}</Typography>
              )}
            </Box>
          )}
          
          <Box sx={{ mt: 2 }}>
            {!tieneTurnoActivo ? (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={registrarEntrada}
                fullWidth
                disabled={!isWorkingHours} 
                sx={{ mt: 2, height: '54px' }}
              >
                Registrar Asistencia
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleRegistrarSalidaClick} 
                fullWidth
                disabled={!isWorkingHours} 
                sx={{ mt: 2, height: '54px' }}
              >
                Registrar Salida
              </Button>
            )}

            {!isWorkingHours && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Acción bloqueada. El horario de atención del laboratorio es de {labConfig.HORA_APERTURA} a {labConfig.HORA_CIERRE}.
              </Alert>
            )}

            {isWorkingHours && tieneTurnoActivo && tiempoRestante && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Recuerda: El tiempo mínimo de permanencia para ser contabilizado es de {labConfig.MINUTOS_MINIMOS} minutos.
                <br />
                Tiempo restante para habilitar salida válida: <strong>{tiempoRestante}</strong>
              </Alert>
            )}
          </Box>
        </Box>
      ) : (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setModalOpen(true)} 
          align="center"
          sx={{ mt: 2 }}
        >
          Iniciar Sesión
        </Button>
      )}
      
      <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Advertencia: Tiempo mínimo no alcanzado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Has estado en el laboratorio por menos del tiempo mínimo requerido ({labConfig.MINUTOS_MINIMOS} minutos). 
            <br/><br/>
            Si continúas, tu registro actual de entrada <strong>se eliminará</strong>.
            ¿Estás seguro de que deseas anular tu registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">Cancelar (Quedarme)</Button>
          <Button onClick={handleConfirmarEliminacion} color="error" variant="contained">Aceptar y Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;