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

// Ruta para obtener los usuarios (solo administradores)
app.get('/api/usuarios', authenticateToken, async (req, res) => {
    try {
        // Verificar si el usuario es administrador
        if (req.user.rol !== 'administrador') {
            return res.status(403).json({ message: 'No autorizado' });
        }
        
        const result = await pool.query('SELECT id_usuario, nombre, apellido, email, fecha_ingreso, rol FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error("Error en la consulta a la base de datos:", err);
        res.status(500).json({ error: 'Error al obtener los usuarios', details: err.message });
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