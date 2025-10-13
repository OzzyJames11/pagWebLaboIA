const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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


// En tu backend (server.js)
const checkAdmin = (req, res, next) => {
    if (req.user.rol !== 'administrador' && req.user.rol !== 'superadmin') {
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

// app.post('/api/login', async (req, res) => {
//     try {
//         const { id_usuario, password } = req.body;
        
//         const userResult = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);
//         if (userResult.rows.length === 0) {
//             return res.status(400).json({ message: 'Credenciales inválidas' });
//         }
        
//         const user = userResult.rows[0];
        
//         // Comparación directa (temporal)
//         if (password.trim() !== user.password.trim()) {
//             return res.status(400).json({ message: 'Credenciales inválidas' });
//         }
        
//         // Crear token JWT
//         const token = jwt.sign(
//             { 
//                 id_usuario: user.id_usuario,
//                 rol: user.rol 
//             },
//             process.env.JWT_SECRET || 'mi_super_secreto',
//             { expiresIn: '24h' }
//         );
        
//         // Devolver todos los datos necesarios
//         res.json({
//             success: true,
//             user: {
//                 id_usuario: user.id_usuario,
//                 nombre: user.nombre,
//                 apellido: user.apellido,
//                 email: user.email,
//                 rol: user.rol,
//                 horario: user.horario
//             },
//             token
//         });
//     } catch (error) {
//         console.error('Error en login:', error);
//         res.status(500).json({ message: 'Error en el servidor' });
//     }
// });
app.post('/api/login', async (req, res) => {
  try {
    const { id_usuario, password } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1 AND activo = true', [id_usuario]);

    if (result.rows.length === 0) return res.status(400).json({ message: 'Credenciales inválidas' });
    const user = result.rows[0];

    // === TEXTO PLANO ===
    if (password !== user.password) {
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
      const fecha = ahora.toISOString().split('T')[0];
      
      const resultado = await pool.query(
        `INSERT INTO registros_asistencia 
         (id_usuario, fecha, hora_entrada, estado) 
         VALUES ($1, $2, $3, 'pendiente') 
         RETURNING *`,
        [id_usuario, fecha, ahora]
      );
      
      res.json({
        success: true,
        registro: resultado.rows[0],
        message: 'Ingreso registrado con éxito'
      });
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
    
    // Buscar el registro más reciente sin salida
    const registro = await pool.query(
    `SELECT * FROM registros_asistencia 
        WHERE id_usuario = $1 AND hora_salida IS NULL 
        ORDER BY hora_entrada DESC LIMIT 1`,
    [id_usuario]
    );
    
    if (registro.rows.length === 0) {
    return res.status(400).json({ message: 'No hay registro de entrada' });
    }
    
    const resultado = await pool.query(
    `UPDATE registros_asistencia 
        SET hora_salida = $1, estado = 'completo' 
        WHERE id_registro = $2 RETURNING *`,
    [ahora, registro.rows[0].id_registro]
    );
    
    res.json({
    success: true,
    registro: resultado.rows[0],
    message: 'Salida registrada con éxito'
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar salida' });
}
});


// Crear nuevo usuario con generación automática de contraseña
app.post('/api/usuarios', authenticateToken, async (req, res) => {
  try {
    const { id_usuario, nombre, apellido, email, rol, horario } = req.body;

    // Generar contraseña temporal automáticamente
    const password = generarPasswordTemporal();

    await pool.query(
      `INSERT INTO usuarios 
       (id_usuario, nombre, apellido, email, rol, horario, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id_usuario, nombre, apellido, email, rol, horario, password]
    );

    // Devolver la contraseña generada al frontend
    res.json({ success: true, tempPassword: password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Registro público de pasantes desde Home (no requiere token)
app.post('/api/registro-pasante', async (req, res) => {
  try {
    const { id_usuario, nombre, apellido, email, horario } = req.body;
    const rol = 'pasante';
    const password = generarPasswordTemporal();

    await pool.query(
      `INSERT INTO usuarios (id_usuario, nombre, apellido, email, rol, horario, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id_usuario, nombre, apellido, email, rol, horario, password]
    );

    res.json({ success: true, tempPassword: password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});



/*

// Ruta para login de usuarios (VERSIÓN PRODUCCIÓN CON HASH)
app.post('/api/login', async (req, res) => {
    try {
        const { id_usuario, password } = req.body;
        
        const userResult = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        
        const user = userResult.rows[0];
        
        // Comparación segura con bcrypt
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        
        // Resto del código igual...
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta para registro de usuarios (VERSIÓN PRODUCCIÓN CON HASH)
app.post('/api/register', async (req, res) => {
    try {
        const { id_usuario, nombre, apellido, email, fecha_ingreso, password, rol } = req.body;
        
        const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR id_usuario = $2', [email, id_usuario]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await pool.query(
            'INSERT INTO usuarios (id_usuario, nombre, apellido, email, fecha_ingreso, password, rol) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id_usuario, nombre, apellido, email, fecha_ingreso, hashedPassword, rol]
        );
        
        // Resto del código igual...
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

*/

// Resetear contraseña y generar una temporal (admin)
app.post('/api/usuarios/:id/reset-password', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Si el rol es admin (no superadmin), solo puede resetear pasantes
    if (req.user.rol === 'administrador') {
      const r = await pool.query('SELECT rol FROM usuarios WHERE id_usuario = $1', [id]);
      if (r.rows[0]?.rol !== 'pasante') {
        return res.status(403).json({ error: 'No puedes resetear a este usuario' });
      }
    }

    const tempPassword = generarPasswordTemporal();

    // === TEXTO PLANO ===
    await pool.query(
      'UPDATE usuarios SET password = $1, must_change_password = true WHERE id_usuario = $2',
      [tempPassword, id]
    );

    // === 🔒 FUTURO: HASH ===
    // const hashed = await bcrypt.hash(tempPassword, 10);
    // await pool.query(
    //   'UPDATE usuarios SET password = $1, must_change_password = true WHERE id_usuario = $2',
    //   [hashed, id]
    // );

    res.json({ success: true, tempPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al resetear contraseña' });
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

    // === 🔒 FUTURO: HASH ===
    // const ok = await bcrypt.compare(currentPassword, user.password);
    // if (!ok) return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    // const hashed = await bcrypt.hash(newPassword, 10);

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

  
// // Eliminar (desactivar) usuario (solo admin)
// app.delete('/api/usuarios/:id', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Solo permitir si el usuario autenticado es admin
//     if (req.user.rol !== 'administrador') {
//       return res.status(403).json({ error: 'No tienes permisos para eliminar usuarios' });
//     }

//     // En lugar de borrar físicamente:
//     await pool.query('UPDATE usuarios SET activo = false WHERE id_usuario = $1', [id]);

//     res.json({ success: true, message: 'Usuario desactivado correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al eliminar usuario' });
//   }
// });

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

  
// function generarPasswordTemporal() {
//     const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
//     let result = '';
//     for (let i = 0; i < 10; i++) {
//         result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
// }

// Iniciar el servidor
pool.connect()
    .then(() => {
        console.log('🟢 Conectado a PostgreSQL');
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch(err => console.error('🔴 Error al conectar con PostgreSQL:', err));