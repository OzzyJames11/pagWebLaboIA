// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Configuración CORS
// app.use(cors());

// // Middleware para parsear JSON
// app.use(express.json());

// // Conectar a la base de datos
// const pool = new Pool({
//     user: 'postgres', // Usuario de PostgreSQL
//     host: 'localhost',
//     database: 'pasantias_lab', // Nombre de la base de datos
//     password: process.env.PG_PASSWORD, // La contraseña que tienes en el archivo .env
//     port: 5432,
// });

// // Ruta para obtener los pasantes
// app.get('/api/usuarios', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM usuarios');
//         console.log("Usuarios obtenidos:", result.rows); // Verifica que llegan datos
//         res.json(result.rows);
//     } catch (err) {
//         console.error("Error en la consulta a la base de datos:", err);
//         res.status(500).json({ error: 'Error al obtener los usuarios', details: err.message });
//     }
// });

// // Iniciar el servidor
// pool.connect()
//     .then(() => console.log('🟢 Conectado a PostgreSQL'))
//     .catch(err => console.error('🔴 Error al conectar con PostgreSQL:', err));

// app.listen(port, () => {
//     console.log(`Servidor corriendo en el puerto ${port}`);
// });


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


app.post('/api/login', async (req, res) => {
    try {
        const { id_usuario, password } = req.body;
        
        const userResult = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        
        const user = userResult.rows[0];
        
        // Comparación directa (temporal)
        if (password.trim() !== user.password.trim()) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        
        // Crear token JWT
        const token = jwt.sign(
            { 
                id_usuario: user.id_usuario,
                rol: user.rol 
            },
            process.env.JWT_SECRET || 'mi_super_secreto',
            { expiresIn: '24h' }
        );
        
        // Devolver todos los datos necesarios
        res.json({
            success: true,
            user: {
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                rol: user.rol
            },
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
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


// Crear nuevo usuario
app.post('/api/usuarios', authenticateToken, async (req, res) => {
    try {
      const { id_usuario, nombre, apellido, email, rol, horario, password } = req.body;
      
      // Solo superadmin puede crear otros admins
      if (req.user.rol !== 'superadmin' && ['administrador', 'superadmin'].includes(rol)) {
        return res.status(403).json({ error: 'No tienes permisos para crear este rol' });
      }
      
      await pool.query(
        `INSERT INTO usuarios 
         (id_usuario, nombre, apellido, email, rol, horario, password) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id_usuario, nombre, apellido, email, rol, horario, password]
      );
      
      res.json({ success: true });
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


// Ruta protegida para obtener datos del usuario actual
app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id_usuario, nombre, apellido, email, rol FROM usuarios WHERE id_usuario = $1', [req.user.id_usuario]);
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
      `;
      const params = [];
      
      // 3. Filtro para administradores normales
      if (req.user.rol === 'administrador') {
        query += ' WHERE rol = $1';
        params.push('pasante');
      }
      
      // 4. Ejecutar consulta
      const result = await pool.query(query, params);
      
      // 5. Enviar respuesta en formato correcto
      res.json(result.rows);
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });


// Endpoint corregido para obtener asistencias
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
  
// Eliminar usuario (solo superadmin)
app.delete('/api/usuarios/:id', authenticateToken, checkSuperAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});
  
function generarPasswordTemporal() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Iniciar el servidor
pool.connect()
    .then(() => {
        console.log('🟢 Conectado a PostgreSQL');
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch(err => console.error('🔴 Error al conectar con PostgreSQL:', err));