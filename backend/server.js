const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const config = require('./labConfig');

const app = express();
const port = process.env.PORT || 5000;

// Configuración CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pasantias_lab',
    password: process.env.PG_PASSWORD,
    port: 5432,
});

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET || 'mi_super_secreto', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};



const checkAdmin = (req, res, next) => {
    if (req.user.rol !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};
  
  const checkSuperAdmin = (req, res, next) => {
    if (req.user.rol !== 'superadmin') {
      return res.status(403).json({ message: 'Se requieren privilegios de super administrador' });
    }
    next();
  };

  function generarPasswordTemporal() {
  return Math.random().toString(36).slice(-6); // ej: "a9f2kq"
}


// Función para verificar si la hora actual está dentro del horario del laboratorio
function isWithinWorkingHours(date) {
  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeString = `${hour}:${minutes}`;
  return timeString >= config.HORA_APERTURA && timeString <= config.HORA_CIERRE;
}

// Función para obtener la fecha local exacta (YYYY-MM-DD) sin desfase UTC
function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Función mejorada para saber si un Date ya pasó la hora de cierre de hoy
function yaPasoHoraCierre(fechaComparar) {
  const cierreHoy = new Date();
  const [horas, minutos] = config.HORA_CIERRE.split(':');
  cierreHoy.setHours(parseInt(horas, 10), parseInt(minutos, 10), 0, 0);
  return fechaComparar > cierreHoy;
}


// implementacion con bcrypt
app.post('/api/login', async (req, res) => {
  try {
    const { id_usuario, password } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1 AND activo = true', [id_usuario]);

    if (result.rows.length === 0) return res.status(400).json({ message: 'Credenciales inválidas' });
    const user = result.rows[0];

    // === VERIFICACIÓN CON BCRYPT ===
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id_usuario: user.id_usuario, rol: user.rol },
      process.env.JWT_SECRET || 'mi_super_secreto',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        horario: user.horario,
        must_change_password: !!user.must_change_password
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});



// Registrar asistencia (entrada)
app.post('/api/registrar-entrada', authenticateToken, async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const ahora = new Date();
    
    // === CONSTRUCCIÓN DE FECHA Y HORA LOCAL EXACTA A PRUEBA DE FALLOS ===
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0');
    const day = String(ahora.getDate()).padStart(2, '0');
    const hours = String(ahora.getHours()).padStart(2, '0');
    const minutes = String(ahora.getMinutes()).padStart(2, '0');
    const seconds = String(ahora.getSeconds()).padStart(2, '0');
    const ms = String(ahora.getMilliseconds()).padStart(3, '0');

    // Ej: "2026-03-05"
    const fechaLocal = `${year}-${month}-${day}`; 
    // Ej: "2026-03-05 14:30:15.123"
    const horaExactaLocal = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`; 
    
    // 1. Validar horario de apertura y cierre
    if (!isWithinWorkingHours(ahora)) {
      return res.status(400).json({ message: `El laboratorio opera de ${config.HORA_APERTURA} a ${config.HORA_CIERRE}.` });
    }

    // 2. Buscar ÚNICAMENTE el último registro
    const ultimoRegistro = await pool.query(
      `SELECT id_registro, hora_salida, fecha FROM registros_asistencia 
       WHERE id_usuario = $1 ORDER BY hora_entrada DESC LIMIT 1`,
      [id_usuario]
    );

    if (ultimoRegistro.rows.length > 0) {
      const registro = ultimoRegistro.rows[0];
      // Si el último registro NO tiene salida
      if (registro.hora_salida === null) {
        const fechaRegistro = new Date(registro.fecha);
        const hoy = new Date();
        const esDeHoy = fechaRegistro.getDate() === hoy.getDate() && 
                        fechaRegistro.getMonth() === hoy.getMonth() && 
                        fechaRegistro.getFullYear() === hoy.getFullYear();
        
        // Si es de hoy y AÚN NO es la hora de cierre, está activo, bloqueamos.
        if (esDeHoy && !yaPasoHoraCierre(ahora)) {
           return res.status(400).json({ message: 'Ya tienes un turno activo en este momento. Registra tu salida primero.' });
        }
      }
    }

    // 3. Insertar enviando los strings exactos
    const resultado = await pool.query(
      `INSERT INTO registros_asistencia (id_usuario, fecha, hora_entrada, estado) 
       VALUES ($1, $2, $3, 'pendiente') RETURNING *`,
      [id_usuario, fechaLocal, horaExactaLocal]
    );
    
    res.json({ success: true, registro: resultado.rows[0], message: 'Ingreso registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar entrada' });
  }
});

  
// Registrar asistencia (salida)
app.post('/api/registrar-salida', authenticateToken, async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const ahora = new Date();
    
    // 1. Validar horario
    if (!isWithinWorkingHours(ahora)) {
      return res.status(400).json({ message: `El laboratorio opera de ${config.HORA_APERTURA} a ${config.HORA_CIERRE}. No se pueden registrar salidas fuera de este horario.` });
    }

    // Buscar el último registro que no tenga salida
    const registro = await pool.query(
      `SELECT * FROM registros_asistencia 
       WHERE id_usuario = $1 AND hora_salida IS NULL 
       ORDER BY hora_entrada DESC LIMIT 1`,
      [id_usuario]
    );
    
    if (registro.rows.length === 0) {
      return res.status(400).json({ message: 'No tienes ninguna entrada activa para registrar salida.' });
    }

    // Verificar que ese registro pertenezca a HOY (para que no cierre un turno de ayer)
    const fechaEntrada = new Date(registro.rows[0].hora_entrada);
    if (fechaEntrada.getDate() !== ahora.getDate()) {
       return res.status(400).json({ message: 'Tu último registro abierto es de un día anterior y ha sido invalidado.' });
    }

    const diffMs = ahora - fechaEntrada;
    const diffHoras = diffMs / (1000 * 60 * 60);

    // 2. Penalidad por superar máximo de horas
    if (diffHoras > config.HORAS_MAXIMAS) {
      return res.status(400).json({ message: `Has excedido el tiempo máximo permitido (${config.HORAS_MAXIMAS}h). Tu registro ha sido invalidado.` });
    }

    // Registro normal exitoso
    const resultado = await pool.query(
      `UPDATE registros_asistencia SET hora_salida = $1, estado = 'completo' WHERE id_registro = $2 RETURNING *`,
      [ahora, registro.rows[0].id_registro]
    );
    
    res.json({ success: true, registro: resultado.rows[0], message: 'Salida registrada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar salida' });
  }
});



// Crear nuevo usuario (Admin)
app.post('/api/usuarios', authenticateToken, async (req, res) => {
  try {
    const { id_usuario, nombre, apellido, email, rol, horario } = req.body;
    const password = generarPasswordTemporal();
    
    // Hashear la contraseña temporal antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `INSERT INTO usuarios (id_usuario, nombre, apellido, email, rol, horario, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id_usuario, nombre, apellido, email, rol, horario, hashedPassword] // Insertamos el hash
    );

    res.json({ success: true, tempPassword: password }); // Devolvemos el texto plano a la pantalla
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Registro público (Home)
app.post('/api/registro-pasante', async (req, res) => {
  try {
    const { id_usuario, nombre, apellido, email, horario } = req.body;
    const rol = 'pasante';
    const password = generarPasswordTemporal();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `INSERT INTO usuarios (id_usuario, nombre, apellido, email, rol, horario, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id_usuario, nombre, apellido, email, rol, horario, hashedPassword]
    );

    res.json({ success: true, tempPassword: password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});


// Resetear contraseña (Admin)
app.post('/api/usuarios/:id/reset-password', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const tempPassword = generarPasswordTemporal();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    await pool.query(
      'UPDATE usuarios SET password = $1, must_change_password = true WHERE id_usuario = $2',
      [hashedPassword, id]
    );

    res.json({ success: true, tempPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al resetear contraseña' });
  }
});
// Cambiar contraseña (Pasante/Admin desde su perfil)
app.put('/api/usuarios/:id/change-password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.user.id_usuario !== id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const result = await pool.query('SELECT password FROM usuarios WHERE id_usuario = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];

    // Verificar la contraseña actual contra el hash
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await pool.query(
      'UPDATE usuarios SET password = $1, must_change_password = false WHERE id_usuario = $2',
      [hashedNewPassword, id]
    );

    res.json({ success: true, message: 'Contraseña cambiada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
});


// Agregar registro de asistencia manual (solo admin)
app.post('/api/usuarios/:id/asistencia-manual', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora_entrada, hora_salida } = req.body;

    // Verificar que el usuario exista
    const userCheck = await pool.query('SELECT 1 FROM usuarios WHERE id_usuario = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Formatear las horas para insertarlas como timestamp en PostgreSQL
    const entradaTimestamp = `${fecha} ${hora_entrada}:00`;
    const salidaTimestamp = `${fecha} ${hora_salida}:00`;

    const resultado = await pool.query(
      `INSERT INTO registros_asistencia 
       (id_usuario, fecha, hora_entrada, hora_salida, estado) 
       VALUES ($1, $2, $3, $4, 'completo') 
       RETURNING *`,
      [id, fecha, entradaTimestamp, salidaTimestamp]
    );

    res.json({
      success: true,
      registro: resultado.rows[0],
      message: 'Registro manual agregado con éxito'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar registro manual' });
  }
});


// Ruta protegida para obtener datos del usuario actual
app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id_usuario, nombre, apellido, email, rol, horario FROM usuarios WHERE id_usuario = $1 AND activo = true', [req.user.id_usuario]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error en la consulta a la base de datos:", err);
        res.status(500).json({ error: 'Error al obtener los datos del usuario', details: err.message });
    }
});

// Ruta para obtener usuarios
app.get('/api/usuarios', authenticateToken, async (req, res) => {
    console.log("Usuario que hace la petición:", req.user); // Para depuración
    
    try {
      // 1. Verificar que el usuario es admin
      if (!req.user || !['administrador', 'superadmin'].includes(req.user.rol)) {
        return res.status(403).json({ error: 'No tienes permisos' });
      }
  
      // 2. Consulta SQL simple
      let query = `
        SELECT id_usuario, nombre, apellido, email, rol, horario 
        FROM usuarios
        WHERE activo = true
      `;
      const params = [];
      
      // 3. Filtro para administradores normales
      // if (req.user.rol === 'administrador') {
      //   query += ' WHERE rol = $1';
      //   params.push('pasante');
      // }
      
      // 4. Ejecutar consulta
      const result = await pool.query(query, params);
      
      // 5. Enviar respuesta en formato correcto
      res.json(result.rows);
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });

  //obtener un usuario por id
  app.get('/api/usuarios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id_usuario, nombre, apellido, email, rol, horario FROM usuarios WHERE id_usuario = $1 AND activo = true',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});



// Endpoint para obtener asistencias del usuario logeado
app.get('/api/mis-asistencias', authenticateToken, async (req, res) => {
    try {
      const { id_usuario } = req.user;
      const { filtro = 'semestre', fechaInicio, fechaFin } = req.query; // Cambiado a semestre por defecto
      
      let query = `
        SELECT 
          id_registro,
          id_usuario,
          fecha,
          hora_entrada,
          hora_salida,
          estado,
          EXTRACT(EPOCH FROM (hora_salida - hora_entrada))/3600 AS horas_trabajadas
        FROM registros_asistencia 
        WHERE id_usuario = $1
      `;
      
      const params = [id_usuario];
      
      // Aplicar filtros
      if (filtro === 'semana') {
        query += ` AND fecha >= CURRENT_DATE - INTERVAL '7 days'`;
      } else if (filtro === 'mes') {
        query += ` AND fecha >= CURRENT_DATE - INTERVAL '30 days'`;
      } else if (filtro === 'semestre') {
        query += ` AND fecha >= CURRENT_DATE - INTERVAL '6 months'`;
      } else if (filtro === 'rango' && fechaInicio && fechaFin) {
        query += ` AND fecha BETWEEN $2 AND $3`;
        params.push(fechaInicio, fechaFin);
      }
      
      query += ` ORDER BY hora_entrada DESC`;
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error en /api/mis-asistencias:', error);
      res.status(500).json({ error: 'Error al obtener asistencias' });
    }
});

// Endpoint para admins: obtener asistencias de cualquier usuario en base a su ID
app.get('/api/usuarios/:id/asistencias', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { filtro = 'semestre', fechaInicio, fechaFin } = req.query;

    // Solo admins o superadmins pueden ver asistencias de otros
    if (!['administrador', 'superadmin'].includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    // Validación previa: comprobar si el usuario existe y está activo
    const userCheck = await pool.query(
      'SELECT 1 FROM usuarios WHERE id_usuario = $1 AND activo = true',
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario inactivo o no encontrado' });
    }

    let query = `
      SELECT 
        id_registro,
        id_usuario,
        fecha,
        hora_entrada,
        hora_salida,
        estado,
        EXTRACT(EPOCH FROM (hora_salida - hora_entrada))/3600 AS horas_trabajadas
      FROM registros_asistencia 
      WHERE id_usuario = $1
    `;

    const params = [id];

    if (filtro === 'semana') {
      query += ` AND fecha >= CURRENT_DATE - INTERVAL '7 days'`;
    } else if (filtro === 'mes') {
      query += ` AND fecha >= CURRENT_DATE - INTERVAL '30 days'`;
    } else if (filtro === 'semestre') {
      query += ` AND fecha >= CURRENT_DATE - INTERVAL '6 months'`;
    } else if (filtro === 'rango' && fechaInicio && fechaFin) {
      query += ` AND fecha BETWEEN $2 AND $3`;
      params.push(fechaInicio, fechaFin);
    }

    query += ` ORDER BY hora_entrada DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error en /api/usuarios/:id/asistencias:', error);
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
});


// Endpoint para obtener la configuración del laboratorio
app.get('/api/config', (req, res) => {
  const config = require('./labConfig');
  res.json(config);
});



// Cambiar contraseña en la interfaz de usuario (pasante)
app.put('/api/usuarios/:id/change-password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Solo el propio usuario puede cambiarla
    if (req.user.id_usuario !== id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const result = await pool.query('SELECT password FROM usuarios WHERE id_usuario = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];

    // === TEXTO PLANO ===
    if (currentPassword !== user.password) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    await pool.query(
      'UPDATE usuarios SET password = $1, must_change_password = false WHERE id_usuario = $2',
      [newPassword, id] // 🔒 futuro: usar [hashed, id]
    );

    res.json({ success: true, message: 'Contraseña cambiada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
});



// Restablecer contraseña
app.put('/api/usuarios/:id/reset-password', authenticateToken, checkAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar permisos (admin solo puede resetear pasantes)
      if (req.user.rol === 'administrador') {
        const user = await pool.query('SELECT rol FROM usuarios WHERE id_usuario = $1', [id]);
        if (user.rows[0]?.rol !== 'pasante') {
          return res.status(403).json({ error: 'No tienes permisos para esta acción' });
        }
      }
      
      const tempPassword = generarPasswordTemporal();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      await pool.query(
        'UPDATE usuarios SET password = $1 WHERE id_usuario = $2',
        [hashedPassword, id]
      );
      
      // Enviar email con nueva contraseña (implementar esto)
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
});

//update usuario
app.put('/api/usuarios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol, horario } = req.body;

    // Un admin solo puede editar pasantes, superadmin edita todo
    if (req.user.rol === 'administrador') {
      const checkUser = await pool.query('SELECT rol FROM usuarios WHERE id_usuario = $1', [id]);
      if (checkUser.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      if (checkUser.rows[0].rol !== 'pasante') {
        return res.status(403).json({ error: 'No tienes permisos para editar este usuario' });
      }
    }

    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, apellido = $2, email = $3, rol = $4, horario = $5 
       WHERE id_usuario = $6 
       RETURNING id_usuario, nombre, apellido, email, rol, horario`,
      [nombre, apellido, email, rol, horario, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

  
// Eliminar usuario (soft delete) — solo admins o superadmins
app.delete('/api/usuarios/:id', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Opcional: evitar que un admin se borre a sí mismo
    if (req.user.id_usuario === id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }

    // Soft delete: marcar activo = false
    await pool.query('UPDATE usuarios SET activo = false WHERE id_usuario = $1', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Eliminar un registro de asistencia específico (físicamente)
// Solo accesible para administradores
app.delete('/api/asistencias/:id_registro', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { id_registro } = req.params;

    // Ejecutar la eliminación física (HARD DELETE)
    const result = await pool.query(
      'DELETE FROM registros_asistencia WHERE id_registro = $1 RETURNING *',
      [id_registro]
    );

    // Verificar si el registro existía
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }

    res.json({ 
      success: true, 
      message: 'Registro eliminado definitivamente',
      registroEliminado: result.rows[0] // Opcional, por si necesitas info del registro borrado
    });
  } catch (error) {
    console.error('Error al eliminar asistencia:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el registro' });
  }
});

// Endpoint específico para anular una entrada menor a 10 minutos (solo del día actual)
app.delete('/api/cancelar-entrada', authenticateToken, async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const ahora = new Date();
    const fechaLocal = getLocalDateString(ahora);
    
    // Buscar el registro pendiente CREADO HOY localmente
    const registro = await pool.query(
      `SELECT id_registro FROM registros_asistencia 
       WHERE id_usuario = $1 AND hora_salida IS NULL AND fecha = $2 
       ORDER BY hora_entrada DESC LIMIT 1`,
      [id_usuario, fechaLocal]
    );
    
    if (registro.rows.length > 0) {
      // Eliminar el registro físicamente
      await pool.query('DELETE FROM registros_asistencia WHERE id_registro = $1', [registro.rows[0].id_registro]);
      return res.json({ success: true, message: 'Registro anulado correctamente.' });
    }
    
    res.status(400).json({ message: 'No se encontró un registro activo de hoy para anular.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al anular registro' });
  }
});

  
// Iniciar el servidor
pool.connect()
    .then(() => {
        console.log('🟢 Conectado a PostgreSQL');
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch(err => console.error('🔴 Error al conectar con PostgreSQL:', err));